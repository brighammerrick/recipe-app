import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { titleToFilename } from "@/lib/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Recipes");

    const recipes = result.recordset.map((recipe) => ({
      ...recipe,
      ImageUrl: `/images/${titleToFilename(recipe.Title)}`,
    }));

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, content, author } = await req.json();
  const pool = await getConnection();

  const result = await pool.request().query("SELECT MAX(Id) AS maxId FROM Recipes");
  const maxId = result.recordset[0].maxId ?? -1;
  const newId = maxId + 1;

  await pool
    .request()
    .input("id", newId)
    .input("title", title)
    .input("description", description)
    .input("content", content)
    .input("author", author)
    .input("hidden", 0)
    .query(`
      INSERT INTO Recipes (Id, Title, Description, Content, Author, Hidden)
      VALUES (@id, @title, @description, @content, @author, @hidden)
    `);

  return NextResponse.json({ message: "Recipe added", id: newId });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const pool = await getConnection();

  await pool.request().input("id", id).query("DELETE FROM Recipes WHERE Id = @id");

  await pool.request().query(`
    WITH Ordered AS (
      SELECT Id, ROW_NUMBER() OVER (ORDER BY Id) - 1 AS NewId
      FROM Recipes
    )
    UPDATE Recipes
    SET Id = Ordered.NewId
    FROM Recipes
    JOIN Ordered ON Recipes.Id = Ordered.Id;
  `);

  return NextResponse.json({ message: `Deleted recipe ${id} and resequenced IDs.` });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, hidden } = await req.json();
  const pool = await getConnection();

  await pool
    .request()
    .input("id", id)
    .input("hidden", hidden)
    .query("UPDATE Recipes SET Hidden = @hidden WHERE Id = @id");

  return NextResponse.json({ message: "Recipe updated" });
}

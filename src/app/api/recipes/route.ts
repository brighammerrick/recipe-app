import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { titleToFilename } from "@/lib/utils";

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM Recipes WHERE Hidden = 0");

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

export async function PUT(req: Request) {
  const { id, title, description, content, author } = await req.json();
  const pool = await getConnection();

  await pool
    .request()
    .input("id", id)
    .input("title", title)
    .input("description", description)
    .input("content", content)
    .input("author", author)
    .query(`
      UPDATE Recipes
      SET Title = @title,
          Description = @description,
          Content = @content,
          Author = @author
      WHERE Id = @id
    `);

  return NextResponse.json({ message: "Recipe updated" });
}
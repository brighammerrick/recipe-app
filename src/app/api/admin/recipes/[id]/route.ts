import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  const { hidden } = await req.json();
  const pool = await getConnection();

  await pool
    .request()
    .input("id", id)
    .input("hidden", hidden ? 1 : 0)
    .query("UPDATE Recipes SET Hidden = @hidden WHERE Id = @id");

  return NextResponse.json({ message: "Recipe updated" });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = params;
  const pool = await getConnection();

  await pool.request().input("id", id).query("DELETE FROM Recipes WHERE Id = @id");

  return NextResponse.json({ message: "Recipe deleted" });
}

import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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
  const { id } = params;
  const pool = await getConnection();

  await pool.request().input("id", id).query("DELETE FROM Recipes WHERE Id = @id");

  return NextResponse.json({ message: "Recipe deleted" });
}

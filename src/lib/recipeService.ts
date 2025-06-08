import { getConnection } from "./db";

export async function getVisibleRecipes() {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM Recipes WHERE Hidden = 0");
  return result.recordset;
}

export async function addRecipe(title: string, description: string) {
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("title", title)
    .input("description", description)
    .query(
      `INSERT INTO Recipes (Title, Description) VALUES (@title, @description);
       SELECT SCOPE_IDENTITY() AS id;`
    );
  return result.recordset[0].id;
}

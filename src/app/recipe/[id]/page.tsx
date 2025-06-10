import { getConnection } from "@/lib/db";
import { titleToFilename } from "@/lib/utils";
import Image from "next/image";
import "./page.css";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = parseInt(params.id);
  const pool = await getConnection();
  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT Title FROM Recipes WHERE Id = @id AND Hidden = 0");
  const recipe = result.recordset[0];
  return {
    title: recipe?.Title || "Recipe",
  };
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const pool = await getConnection();

  const result = await pool
    .request()
    .input("id", id)
    .query("SELECT * FROM Recipes WHERE Id = @id AND Hidden = 0");

  const recipe = result.recordset[0];

  if (!recipe) {
    return <div className="p-8 text-center text-red-600"><h1>Recipe not found or is hidden.</h1></div>;
  }

  const imgSrc = `/images/${titleToFilename(recipe.Title)}`;
  console.warn('Invalid imgSrc for recipe:', recipe.Id, imgSrc);
  return (
    <div className="recipe-container">
      <h1 className="recipe-title">{recipe.Title}</h1>
      <p className="recipe-author">By: {recipe.Author || "Unknown"}</p>
      {typeof imgSrc === 'string' &&
        imgSrc.length > 0 &&
        (imgSrc.startsWith('http://') ||
          imgSrc.startsWith('https://') ||
          imgSrc.startsWith('/')) && (
          <Image
            src={imgSrc}
            alt={recipe.Title}
            width={400}
            height={300}
            className="recipe-image"
            priority
          />
        )}
      <p className="recipe-description">{recipe.Description}</p>
      <div
        className="recipe-content"
        dangerouslySetInnerHTML={{ __html: recipe.Content || 'No instructions provided.' }}
      />
    </div>
  );
}

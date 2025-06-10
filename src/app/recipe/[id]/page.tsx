import { getConnection } from "@/lib/db";
import { titleToFilename } from "@/lib/utils";
import Image from "next/image";
import "./page.css"

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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-2">{recipe.Title}</h1>
      <p className="text-gray-300 mb-4">By: {recipe.Author || "Unknown"}</p>

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
            className="rounded"
          />
        )}

      <p className="text-xl text-gray-300 mb-6 italic">{recipe.Description}</p>

      <div style={{ marginTop: '2rem' }} dangerouslySetInnerHTML={{ __html: recipe.Content || 'No instructions provided.' }} />
    </div>
  );
}

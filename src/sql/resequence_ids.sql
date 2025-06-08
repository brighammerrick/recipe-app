WITH Ordered AS (
  SELECT Id, ROW_NUMBER() OVER (ORDER BY Id) - 1 AS NewId
  FROM Recipes
)
UPDATE Recipes
SET Id = Ordered.NewId
FROM Recipes
JOIN Ordered ON Recipes.Id = Ordered.Id;
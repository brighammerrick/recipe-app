CREATE TABLE Recipes (
  Id INT PRIMARY KEY,
  Title NVARCHAR(255),
  Description NVARCHAR(MAX),
  Content NVARCHAR(MAX),
  Author NVARCHAR(255),
  -- CreatedAt DATETIME DEFAULT GETDATE(),
  Hidden BIT
);
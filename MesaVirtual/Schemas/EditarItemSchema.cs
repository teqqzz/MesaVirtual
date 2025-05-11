public record EditarItemSchema(
    long Id,
    string Nome,
    decimal Preco,
    long CategoriaId,
    string? Descricao,
    string? Ingredientes,
    string? ImagemUrl
);

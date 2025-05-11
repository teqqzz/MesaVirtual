using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MesaVirtual.Models;
public class Item
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(100, ErrorMessage = "O nome n�o pode ter mais de 100 caracteres.")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "O pre�o � obrigat�rio.")]
    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O pre�o deve ser maior que zero.")]
    public decimal Preco { get; set; }

    [Required(ErrorMessage = "A categoria � obrigat�ria.")]
    public long CategoriaId { get; set; }

    public Categoria? Categoria { get; set; }

    [MaxLength(500, ErrorMessage = "A descri��o n�o pode ter mais de 500 caracteres.")]
    public string? Descricao { get; set; }

    [MaxLength(500, ErrorMessage = "Os ingredientes n�o podem ter mais de 500 caracteres.")]
    public string? Ingredientes { get; set; }

    [MaxLength(500, ErrorMessage = "O caminho da imagem n�o pode ter mais de 500 caracteres.")]
    public string? ImagemUrl { get; set; }
}

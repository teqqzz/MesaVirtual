namespace MesaVirtual.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Pedido
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string? NomeCliente { get; set; } // Propriedade anul�vel

    [Required]
    public DateTime DataPedido { get; set; } = DateTime.Now;

    [Required]
    public int NumeroMesaCliente { get; set; }

    public bool ChamadoGarcom { get; set; } = false;

    public List<DetalhePedido> DetalhesPedido { get; set; } = new List<DetalhePedido>();
}


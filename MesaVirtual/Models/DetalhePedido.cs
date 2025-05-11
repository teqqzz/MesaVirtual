namespace MesaVirtual.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class DetalhePedido
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    public int Quantidade { get; set; }

    [Required]
    public long PedidoId { get; set; }

    public Pedido? Pedido { get; set; } // Propriedade anul�vel

    [Required]
    public long ItemId { get; set; }

    public Item? Item { get; set; } // Propriedade anul�vel
}

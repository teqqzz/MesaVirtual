namespace MesaVirtual.Schemas;

public record AdicionarDetalhePedidoSchema
{
    public int Quantidade { get; set; }
    public long PedidoId { get; set; }
    public long ItemId { get; set; }
}

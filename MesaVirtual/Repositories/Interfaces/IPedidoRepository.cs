using MesaVirtual.Models;

namespace MesaVirtual.Repositories.Interfaces;

public interface IPedidoRepository
{
    Task AddAsync(Pedido categoria);
    Task AddDetalhesPedidoAsync(Pedido pedido, DetalhePedido novoDetalhePedido);
    Task<IEnumerable<Pedido>> GetAllAsync();
    Task<Pedido?> GetByIdAsync(long id);
    Task<List<Pedido>> GetByNumeroDaMesa(long numeroMesa);
    Task<Pedido?> GetByIdWithoutIncludeAsync(long id);
    Task UpdateAsync(Pedido categoria);
    Task DeleteAsync(Pedido pedido);
    Task ChamarGarcom(Pedido pedido);
}

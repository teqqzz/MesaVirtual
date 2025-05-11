namespace MesaVirtual.Repositories.Interfaces;

using MesaVirtual.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IDetalhePedidoRepository
{
    Task<IEnumerable<DetalhePedido>> GetAllAsync();
    Task<DetalhePedido?> GetByIdAsync(long id);
    Task<List<DetalhePedido>> GetListaDetalhePedidoAtualizada(long pedidoId);
    Task AddAsync(DetalhePedido detalhePedido);
    Task UpdateAsync(DetalhePedido detalhePedido);
    Task DeleteAsync(DetalhePedido detalhePedido);
    Task<IEnumerable<DetalhePedido>> GetByPedidoIdAsync(long pedidoId);
}

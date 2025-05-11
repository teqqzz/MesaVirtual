using MesaVirtual.Infra;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MesaVirtual.Repositories;

public class DetalhePedidoRepository : IDetalhePedidoRepository
{
    private readonly AppDbContext _context;

    public DetalhePedidoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DetalhePedido>> GetAllAsync()
    {
        return await _context.DetalhesPedidos.ToListAsync();
    }
    public async Task<List<DetalhePedido>> GetListaDetalhePedidoAtualizada(long pedidoId)
    {
        return await _context.DetalhesPedidos
                        .Where(p => p.PedidoId == pedidoId)
                        .Select(d => new DetalhePedido
                        {
                            Id = d.Id,
                            Quantidade = d.Quantidade,
                            ItemId = d.ItemId,
                            Item = d.Item
                        })
                        .ToListAsync();

    }

    public async Task<DetalhePedido?> GetByIdAsync(long id)
    {
        return await _context.DetalhesPedidos.FindAsync(id);
    }
    public async Task<IEnumerable<DetalhePedido>> GetByPedidoIdAsync(long pedidoId)
    {
        return await _context.DetalhesPedidos
            .Where(dp => dp.PedidoId == pedidoId)
            .Include(dp => dp.Item)
            .ToListAsync();
    }

    public async Task AddAsync(DetalhePedido detalhePedido)
    {
        await _context.DetalhesPedidos.AddAsync(detalhePedido);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(DetalhePedido detalhePedido)
    {
        _context.DetalhesPedidos.Update(detalhePedido);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(DetalhePedido detalhePedido)
    {
        _context.DetalhesPedidos.Remove(detalhePedido);
        await _context.SaveChangesAsync();
    }
}
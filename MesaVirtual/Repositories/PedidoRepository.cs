using MesaVirtual.Infra;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MesaVirtual.Repositories;

public class PedidoRepository : IPedidoRepository
{
    private readonly AppDbContext _context;
    public PedidoRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<Pedido?> GetByIdAsync(long id)
    {
        return await _context.Pedidos
                         .Include(p => p.DetalhesPedido)
                             .ThenInclude(dp => dp.Item)
                         .FirstOrDefaultAsync(p => p.Id == id);
    }
    public async Task<Pedido?> GetByIdWithoutIncludeAsync(long id)
    {
        return await _context.Pedidos.FindAsync(id);
    }
    public async Task<IEnumerable<Pedido>> GetAllAsync()
    {
        return await _context.Pedidos
                        .Include(p => p.DetalhesPedido)
                            .ThenInclude(d => d.Item)
                        .ToListAsync();
    }
    public async Task AddAsync(Pedido pedido)
    {
        await _context.Pedidos.AddAsync(pedido);
        await _context.SaveChangesAsync();
    }
    public async Task AddDetalhesPedidoAsync(Pedido pedido, DetalhePedido novoDetalhePedido)
    {
        pedido.DetalhesPedido.Add(novoDetalhePedido);
        await _context.SaveChangesAsync();
    }
    public async Task ChamarGarcom(Pedido pedido)
    {
        pedido.ChamadoGarcom = true;
        _context.Pedidos.Update(pedido);
        await _context.SaveChangesAsync();
    }
    public async Task UpdateAsync(Pedido pedido)
    {
        _context.Pedidos.Update(pedido);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(Pedido pedido)
    {
        _context.Pedidos.Remove(pedido);
        await _context.SaveChangesAsync();
    }
    public async Task<List<Pedido>> GetByNumeroDaMesa(long numeroMesa)
    {
        return await _context.Pedidos
                .Where(p => p.NumeroMesaCliente == numeroMesa)
                .Include(p => p.DetalhesPedido)
                    .ThenInclude(dp => dp.Item)
                .ToListAsync();
    }
}
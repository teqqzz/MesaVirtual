namespace MesaVirtual.Repositories;

using System.Diagnostics.Contracts;
using MesaVirtual.Infra;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class ItemRepository : IItemRepository
{
    private readonly AppDbContext _context;

    public ItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Item>> GetItensByCategoria(long? categoriaId)
    {
        var query = _context.Itens.AsQueryable();

        if (categoriaId.HasValue)
            query = query.Where(i => i.CategoriaId == categoriaId.Value);

        return await query.ToListAsync();
    }
    public async Task<IEnumerable<Item>> GetAllAsync()
    {
        return await _context.Itens
            .Include(i => i.Categoria)
            .ToListAsync();
    }
    public async Task<Item?> GetByIdAsync(long id)
    {
        return await _context.Itens
            .Include(i => i.Categoria)
            .FirstOrDefaultAsync(i => i.Id == id);
    }
    public async Task AddAsync(Item item)
    {
        await _context.Itens.AddAsync(item);
        await _context.SaveChangesAsync();
    }
    public async Task<Item?> GetByIdWithoutIncludeAsync(long id)
    {
        return await _context.Itens.FindAsync(id);
    }
    public async Task UpdateAsync(Item item)
    {
        _context.Itens.Update(item);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(Item item)
    {
        _context.Itens.Remove(item);
        await _context.SaveChangesAsync();
    }
}
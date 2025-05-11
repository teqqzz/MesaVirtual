using MesaVirtual.Infra;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MesaVirtual.Repositories;
public class CategoriaRepository : ICategoriaRepository
{
    private readonly AppDbContext _context;

    public CategoriaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Categoria>> GetAllAsync()
    {
        return await _context.Categorias
                .Include(c => c.Itens)
                .ToListAsync();
    }
    public async Task<Categoria?> GetByIdWithoutIncludeAsync(long id)
    {
        return await _context.Categorias.FindAsync(id);
    }
    //Nunca usado, mas pode ser útil no futuro
    public async Task<Categoria?> GetByIdAsync(long id)
    {
        return await _context.Categorias
                .Include(c => c.Itens)
                .FirstOrDefaultAsync(c => c.Id == id);
    }
    public async Task AddAsync(Categoria categoria)
    {
        await _context.Categorias.AddAsync(categoria);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Categoria categoria)
    {
        _context.Categorias.Update(categoria);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Categoria categoria)
    {
        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();
    }
}
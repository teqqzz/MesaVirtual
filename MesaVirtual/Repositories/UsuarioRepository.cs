namespace MesaVirtual.Repositories;

using System.Diagnostics.Contracts;
using MesaVirtual.Infra;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }
    public async Task<IEnumerable<Usuario>> GetAllAsync()
    {
        return await _context.Usuarios.ToListAsync();
    }
    public async Task<Usuario?> GetByIdAsync(long id)
    {
        return await _context.Usuarios.FindAsync(id);
    }
    public async Task<Usuario?> GetByEmailAsync(string email)
    {
        return await _context.Usuarios.FirstOrDefaultAsync(u => u.Email.Equals(email));
    }
    public async Task AddAsync(Usuario usuario)
    {
        await _context.Usuarios.AddAsync(usuario);
        await _context.SaveChangesAsync();
    }
    public async Task<Usuario?> GetByIdWithoutIncludeAsync(long id)
    {
        return await _context.Usuarios.FindAsync(id);
    }
    public async Task UpdateAsync(Usuario usuario)
    {
        _context.Usuarios.Update(usuario);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(Usuario usuario)
    {
        _context.Usuarios.Remove(usuario);
        await _context.SaveChangesAsync();
    }
}
using MesaVirtual.Models;

namespace MesaVirtual.Repositories.Interfaces;
public interface ICategoriaRepository
{
    Task<IEnumerable<Categoria>> GetAllAsync();
    Task<Categoria?> GetByIdAsync(long id);
    Task<Categoria?> GetByIdWithoutIncludeAsync(long id);
    Task AddAsync(Categoria categoria);
    Task UpdateAsync(Categoria categoria);
    Task DeleteAsync(Categoria categoria);
}

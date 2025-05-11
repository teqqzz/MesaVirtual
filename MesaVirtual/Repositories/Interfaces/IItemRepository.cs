using MesaVirtual.Models;

namespace MesaVirtual.Repositories.Interfaces;

public interface IItemRepository
{
    Task<IEnumerable<Item>> GetAllAsync();
    Task<IEnumerable<Item>> GetItensByCategoria(long? categoriaId);
    Task<Item?> GetByIdWithoutIncludeAsync(long id);
    Task<Item?> GetByIdAsync(long id);
    Task AddAsync(Item categoria);
    Task UpdateAsync(Item categoria);
    Task DeleteAsync(Item item);
}

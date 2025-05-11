using Microsoft.AspNetCore.Mvc;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace MesaVirtual.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaRepository _categoriaRepository;
        public CategoriasController(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategorias()
        {
            var categorias = await _categoriaRepository.GetAllAsync();
            if (categorias is null || !categorias.Any()) return NotFound("Nenhuma categoria encontrada.");

            return Ok(categorias);
        }

        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetCategoriaPorId(long id)
        {
            var categoria = await _categoriaRepository.GetByIdWithoutIncludeAsync(id);
            if (categoria is null) return NotFound();

            return Ok(categoria);
        }

        [HttpPost]
        [Authorize(Roles = "Funcionario,Gerente")]
        public async Task<IActionResult> CriarCategoria([FromBody] Categoria categoria)
        {
            await _categoriaRepository.AddAsync(categoria);
            if (categoria is null) return BadRequest("Erro ao criar categoria.");
            if (string.IsNullOrEmpty(categoria.Nome)) return BadRequest("Nome da categoria não pode ser vazio.");
            if (categoria.Nome.Length > 100) return BadRequest("Nome da categoria deve ter no máximo 100 caracteres.");

            return CreatedAtAction(nameof(GetCategoriaPorId), new { id = categoria.Id }, categoria);
        }

        [HttpPut("{id:long}")]
        [Authorize(Roles = "Funcionario,Gerente")]
        public async Task<IActionResult> UpdateCategoria(long id, [FromBody] Categoria updatedCategoria)
        {
            var categoria = await _categoriaRepository.GetByIdWithoutIncludeAsync(id);
            if (categoria is null) return NotFound("Categoria não encontrada.");

            categoria.Nome = updatedCategoria.Nome;
            categoria.AtualizadoEm = DateTime.Now;

            await _categoriaRepository.UpdateAsync(categoria);
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Gerente")]
        public async Task<IActionResult> DeletarCategoria(long id)
        {
            var categoria = await _categoriaRepository.GetByIdWithoutIncludeAsync(id);
            if (categoria is null) return NotFound("Categoria não encontrada.");
        
            await _categoriaRepository.DeleteAsync(categoria);
            return NoContent();
        }
    }
}

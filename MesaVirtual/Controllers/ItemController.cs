using Microsoft.AspNetCore.Mvc;
using MesaVirtual.Models;
using System.Globalization;
using MesaVirtual.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace MesaVirtual.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItensController : ControllerBase
    {
        private readonly IItemRepository _itemRepository;
        private readonly IWebHostEnvironment _env;

        public ItensController(IItemRepository itemRepository, IWebHostEnvironment env)
        {
            _itemRepository = itemRepository;
            _env = env;
        }

        [HttpGet("{categoriaId:long?}")]
        public async Task<IActionResult> GetItensPorCategoria(long? categoriaId)
        {
            var itens = await _itemRepository.GetItensByCategoria(categoriaId);
            if (itens is null || !itens.Any())
                return NotFound("Nenhum item encontrado para esta categoria.");
        
            return Ok(itens);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllItens()
        {
            var itens = await _itemRepository.GetAllAsync();
            if (itens is null || !itens.Any())
                return NotFound("Nenhum item encontrado.");

            return Ok(itens);
        }

        [HttpPost]
        [Authorize(Roles = "Funcionario,Gerente")]
        public async Task<IActionResult> CriarItem()
        {
            var form = await Request.ReadFormAsync();
            var nome = form["nome"];
            var descricao = form["descricao"];
            var precoString = form["preco"];
            var categoriaIdString = form["categoriaId"];
            var imagem = form.Files.GetFile("imagem");

            if (!decimal.TryParse(precoString, NumberStyles.Number, CultureInfo.InvariantCulture, out decimal preco) || preco <= 0 ||
                !long.TryParse(categoriaIdString, out long categoriaId) || categoriaId <= 0)
            {
                return BadRequest("Preço ou Categoria inválidos.");
            }

            if (string.IsNullOrEmpty(nome) || string.IsNullOrEmpty(descricao) || imagem == null)
            {
                return BadRequest("Todos os campos são obrigatórios.");
            }

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imagem.FileName);
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imagem.CopyToAsync(stream);
            }

            var novoItem = new Item
            {
                Nome = nome!,
                Descricao = descricao,
                Preco = preco,
                CategoriaId = categoriaId,
                ImagemUrl = $"/uploads/{fileName}"
            };

            await _itemRepository.AddAsync(novoItem);

            return Created($"/api/itens/{novoItem.Id}", novoItem);
        }

        [HttpPut("{id:long}")]
        [Authorize(Roles = "Funcionario,Gerente")]
        public async Task<IActionResult> UpdateItem(long id)
        {
            var item = await _itemRepository.GetByIdWithoutIncludeAsync(id);
            if (item is null) return NotFound("Nenhum item encontrado com este ID.");

            var form = await Request.ReadFormAsync();
            var nome = form["nome"];
            var descricao = form["descricao"];
            var precoString = form["preco"];
            var categoriaIdString = form["categoriaId"];
            var imagem = form.Files.GetFile("imagem");

            if (string.IsNullOrEmpty(nome) || string.IsNullOrEmpty(precoString) || string.IsNullOrEmpty(categoriaIdString))
            {
                return BadRequest("Campos obrigatórios estão faltando.");
            }

            if (!decimal.TryParse(precoString, NumberStyles.Number, CultureInfo.InvariantCulture, out decimal preco) || preco <= 0 ||
                !long.TryParse(categoriaIdString, out long categoriaId) || categoriaId <= 0)
            {
                return BadRequest("Preço ou Categoria inválidos.");
            }

            item.Nome = nome!;
            item.Preco = preco;
            item.CategoriaId = categoriaId;
            item.Descricao = descricao;
            item.Ingredientes = form["ingredientes"];

            if (imagem is not null)
            {
                var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imagem.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imagem.CopyToAsync(stream);
                }

                item.ImagemUrl = $"/uploads/{fileName}";
            }

            await _itemRepository.UpdateAsync(item);

            return NoContent();
        }

        [HttpDelete("{id:long}")]
        [Authorize(Roles = "Gerente")]
        public async Task<IActionResult> DeletarItem(long id)
        {
            var item = await _itemRepository.GetByIdWithoutIncludeAsync(id);
            if (item is null) return NotFound("Nenhum item encontrado com este ID.");

            await _itemRepository.DeleteAsync(item);
            return NoContent();
        }
    }
}

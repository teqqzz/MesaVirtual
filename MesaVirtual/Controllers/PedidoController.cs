using MesaVirtual.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using MesaVirtual.Models;
using MesaVirtual.Schemas;

namespace MesaVirtual.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IPedidoRepository _pedidoRepository;
    private readonly IItemRepository _itemRepository;
    private readonly IDetalhePedidoRepository _detalhePedidoRepository;

    public PedidosController(IPedidoRepository pedidoRepository, IItemRepository itemRepository, IDetalhePedidoRepository detalhePedidoRepository)
    {
        _pedidoRepository = pedidoRepository;
        _itemRepository = itemRepository;
        _detalhePedidoRepository = detalhePedidoRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetPedidos()
    {
        var pedidos = await _pedidoRepository.GetAllAsync();
        if (pedidos is null || !pedidos.Any())
            return NotFound("Nenhum pedido encontrado.");

        return Ok(pedidos);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetPedidoById(long id)
    {
        var pedido = await _pedidoRepository.GetByIdAsync(id);

        return pedido is null ? NotFound() : Ok(pedido);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePedido([FromBody] Pedido pedido)
    {
        await _pedidoRepository.AddAsync(pedido);
        return Created($"/api/pedidos/{pedido.Id}", pedido);
    }

    [HttpPut("{id:long}/chamar-garcom")]
    public async Task<IActionResult> ChamarGarcom(long id)
    {
        var pedido = await _pedidoRepository.GetByIdWithoutIncludeAsync(id);
        if (pedido is null) return NotFound();
        await _pedidoRepository.ChamarGarcom(pedido);

        return Ok("Garçom foi chamado.");
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeletePedido(long id)
    {
        var pedido = await _pedidoRepository.GetByIdWithoutIncludeAsync(id);
        if (pedido is null) return NotFound();

        await _pedidoRepository.DeleteAsync(pedido);

        return NoContent();
    }

    [HttpGet("{id:long}/total")]
    public async Task<IActionResult> GetTotalPedido(long id)
    {
        var pedido = await _pedidoRepository.GetByIdAsync(id);

        if (pedido is null) return NotFound("Pedido não encontrado");

        decimal total = pedido.DetalhesPedido.Sum(dp => dp.Quantidade * dp.Item.Preco);
        return Ok(total);
    }

    [HttpPost("adicionar-detalhe")]
    public async Task<IActionResult> AdicionarDetalhe([FromBody] AdicionarDetalhePedidoSchema detalhePedido)
    {
        var pedido = await _pedidoRepository.GetByIdWithoutIncludeAsync(detalhePedido.PedidoId);
        if (pedido is null) return NotFound("Pedido não encontrado.");

        var item = await _itemRepository.GetByIdAsync(detalhePedido.ItemId);
        if (item is null) return NotFound("Item não encontrado.");

        var novoDetalhePedido = new DetalhePedido
        {
            Quantidade = detalhePedido.Quantidade,
            PedidoId = pedido.Id,
            ItemId = item.Id,
            Item = item
        };

        await _pedidoRepository.AddDetalhesPedidoAsync(pedido, novoDetalhePedido);

        var detalhesAtualizados = await _detalhePedidoRepository
            .GetListaDetalhePedidoAtualizada(pedido.Id);

        return Ok(detalhesAtualizados);
    }

    [HttpGet("mesa/{numeroMesa:long}")]
    public async Task<IActionResult> GetPedidosPorMesa(long numeroMesa)
    {
        var pedidos = await _pedidoRepository.GetByNumeroDaMesa(numeroMesa);
        if (pedidos is null || !pedidos.Any())
            return NotFound("Nenhum pedido encontrado para esta mesa.");

        return Ok(pedidos);
    }
}

using Microsoft.AspNetCore.Mvc;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;

namespace MesaVirtual.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetalhesPedidosController : ControllerBase
    {
        private readonly IDetalhePedidoRepository _detalhePedidoRepository;
        public DetalhesPedidosController(IDetalhePedidoRepository detalhePedidoRepository)
        {
            _detalhePedidoRepository = detalhePedidoRepository;
        }
        [HttpPost]
        public async Task<IActionResult> CriarDetalhePedido([FromBody] DetalhePedido detalhe)
        {
            await _detalhePedidoRepository.AddAsync(detalhe);

            return CreatedAtAction(nameof(GetByPedidoId), new { pedidoId = detalhe.PedidoId }, detalhe);
        }

        [HttpGet("{pedidoId:long}")]
        public async Task<IActionResult> GetByPedidoId(long pedidoId)
        {
            var detalhes = await _detalhePedidoRepository.GetByPedidoIdAsync(pedidoId);

            return Ok(detalhes);
        }
    }
}

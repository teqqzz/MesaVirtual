using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MesaVirtual.Models;
using MesaVirtual.Repositories.Interfaces;
using MesaVirtual.Schemas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IConfiguration _configuration;

    public UsuarioController(IUsuarioRepository usuarioRepository, IConfiguration configuration)
    {
        _usuarioRepository = usuarioRepository;
        _configuration = configuration;
    }

    [HttpPost("cadastrar")]
    public async Task<IActionResult> Cadastrar([FromBody]UsuarioCadastrarDto dto)
    {
        if (await _usuarioRepository.GetByEmailAsync(dto.Email) is not null)
            return BadRequest(new { message = "Email já cadastrado" });

        var funcionario = new Usuario
        {
            Nome = dto.Nome,
            Email = dto.Email,
            Role = dto.Role ?? Role.Funcionario, // Se não especificado, assume "funcionario"
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha)
        };

        await _usuarioRepository.AddAsync(funcionario);

        return Ok(new { message = "Funcionário cadastrado com sucesso!" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var usuario =  await _usuarioRepository.GetByEmailAsync(dto.Email);

        if (usuario is null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
            return Unauthorized(new { message = "Credenciais inválidas" });

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Email),
            new Claim(ClaimTypes.Role, usuario.Role.ToString())
        };

        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    }
}


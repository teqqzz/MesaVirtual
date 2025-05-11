using MesaVirtual.Models;

namespace MesaVirtual.Schemas;

public class UsuarioCadastrarDto
{
    public string Email { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public Role? Role { get; set; }
    public string Senha { get; set; } = string.Empty;
}
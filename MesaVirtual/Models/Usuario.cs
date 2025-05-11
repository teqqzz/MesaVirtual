namespace MesaVirtual.Models;
public class Usuario
{
    public long Id { get; set; }
    public string Nome { get; set; }
    public string Email { get; set; }
    public string SenhaHash { get; set; }
    public Role Role { get; set; }// "gerente" ou "funcionario"
}

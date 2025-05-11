using Microsoft.EntityFrameworkCore;
using MesaVirtual.Models;

namespace MesaVirtual.Infra
{
    public partial class AppDbContext : DbContext

    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            // O construtor base gerencia as opções
        }

        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<Categoria> Categorias { get; set; }
        public virtual DbSet<Item> Itens { get; set; }
        public virtual DbSet<Pedido> Pedidos { get; set; }
        public virtual DbSet<DetalhePedido> DetalhesPedidos { get; set; }


        // Configurações do banco de dados
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração da entidade Categoria
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired();
                entity.Property(e => e.CriadoEm).HasColumnType("DATETIME").IsRequired();
                entity.Property(e => e.AtualizadoEm).HasColumnType("DATETIME");

                // Relacionamento 1:N com Itens
                entity.HasMany(c => c.Itens)
                      .WithOne(i => i.Categoria)
                      .HasForeignKey(i => i.CategoriaId);
            });

            // Configuração da entidade Item
            modelBuilder.Entity<Item>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired();
                entity.Property(e => e.Preco).HasColumnType("DECIMAL(18, 2)").IsRequired();

                entity.HasOne(i => i.Categoria)
                      .WithMany(c => c.Itens)
                      .HasForeignKey(i => i.CategoriaId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configuração da entidade Pedido
            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.NomeCliente).IsRequired();
                entity.Property(e => e.DataPedido).HasColumnType("DATETIME").IsRequired();

                // Relacionamento 1:N com DetalhePedido
                entity.HasMany(p => p.DetalhesPedido)
                      .WithOne(dp => dp.Pedido)
                      .HasForeignKey(dp => dp.PedidoId);
            });

            // Configuração da entidade DetalhePedido
            modelBuilder.Entity<DetalhePedido>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantidade).IsRequired();

                entity.HasOne(dp => dp.Pedido)
                      .WithMany(p => p.DetalhesPedido)
                      .HasForeignKey(dp => dp.PedidoId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
            var categoria1 = new Categoria
            {
                Id = 1,
                Nome = "Bebidas"
            };
            var categoria2 = new Categoria
            {
                Id = 2,
                Nome = "Entradas"
            };

            var item1 = new Item
            {
                Id = 1,
                Nome = "Coca-Cola",
                Preco = 6.99m,
                CategoriaId = 1
            };
            var item2 = new Item
            {
                Id = 2,
                Nome = "Empanado",
                Preco = 15.99m,
                CategoriaId = 2
            };

            modelBuilder.Entity<Categoria>().HasData(categoria1, categoria2);
            modelBuilder.Entity<Item>().HasData(item1, item2);
        }
    }
}

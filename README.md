# MesaVirtual
Aplicação fullstack desenvolvida em ASP.NET Core (.NET 8) e Next.js 15 para gestão de cardápios de restaurantes.


**Vídeo de Apresentação Novo do Frontend: https://youtu.be/2gPlWyVNfNg**

Vídeo de Apresentação do Backend(entrega anterior): https://youtu.be/E3M7buhhKYA


## Instruções Para rodar o projeto

instale o dotnet-ef 8 globalmente, e na pasta "MesaVirtual" rode:

```
dotnet ef database update
```
Logo após, modifique a string de conexão do MySQL em appsettings.json para as suas credenciais e inicie a aplicação com:
```
dotnet run
```

Para o frontend, vá para a pasta "mesa-virtual-next" e instale as dependências:
```
npm install
```
Depois, rode um dos scripts para inicializar a aplicação:
```
npm run dev
```

Certifique que o MySQL, o frontend e o backend estão rodando corretamente e use a aplicação.





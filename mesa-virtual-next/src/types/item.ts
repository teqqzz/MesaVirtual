import Categoria from "./categoria";

export default interface Item {
    id: number;
    nome: string;
    preco: number;
    categoriaId: number;
    descricao: string;
    ingredientes: string;
    imagemUrl: string;
    categoria: Categoria;
}

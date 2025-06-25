import Item from "./item";

export default interface Categoria {
    id: number;
    nome: string;
    criadoEm: string;
    atualizadoEm: string;
    itens: Item[];
}

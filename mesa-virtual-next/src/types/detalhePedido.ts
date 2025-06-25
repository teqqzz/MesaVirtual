import Item from "./item";

export default interface DetalhePedido {
    id: number;
    quantidade: number;
    item: Item;
}
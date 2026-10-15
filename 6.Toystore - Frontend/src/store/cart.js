import { emit } from "../utils/events";

let items = [];

export function getItems() { return items; }

//счетчик считает количество товаров, а не позиций
export function getCount() { return items.reduce((sum, item) => sum + item.quantity, 0); }

//функция с эмитом
export function setItems(newItems) {
    items = newItems || [];
    emit('cart-changed', items);
    return items;
}

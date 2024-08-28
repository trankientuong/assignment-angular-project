export interface Product {
    id: number;
    name: string;
    price: number;
    image: string
}

export interface ProductCart {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    userName?: string;
}

export interface WishlistItem extends ProductCart {
    savedForLater: boolean;
}
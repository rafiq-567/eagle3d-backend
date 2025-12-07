
export interface Product {
    id: string; 
    name: string;
    description: string;
    price: number;
    stock: number;
   
}


export interface AddProductPayload extends Omit<Product, 'id'> {}


export type UpdateProductPayload = Partial<AddProductPayload>;


export interface UserPayload {
    uid: string;
    email: string;
    role: 'admin' | 'viewer';
}
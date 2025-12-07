import { Request, Response } from 'express';
import { db, admin } from '../config/firebase'; 
import { Product, AddProductPayload, UpdateProductPayload } from '../types/product.types';

const productsCollection = db.collection('products');


const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : "An unknown error occurred.";
};



export const getProducts = async (req: Request, res: Response) => {
    try {
        const snapshot = await productsCollection.get();
        const products: Product[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Product, 'id'>)
        }));
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Failed to retrieve products.', error: getErrorMessage(error) });
    }
};


export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const doc = await productsCollection.doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() } as Product);
    } catch (error) {
        console.error("Error fetching single product:", error);
        res.status(500).json({ message: 'Failed to retrieve product.', error: getErrorMessage(error) });
    }
};



export const addProduct = async (req: Request, res: Response) => {
    const data: AddProductPayload = req.body;
    
   
    if (!data.name || !data.price || !data.stock || data.description === undefined) {
        return res.status(400).json({ message: 'Missing required fields: name, price, stock, or description.' });
    }

    try {
        
        const productData = {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await productsCollection.add(productData);
        res.status(201).json({ 
            id: docRef.id, 
            message: 'Product added successfully.', 
            product: { id: docRef.id, ...productData } 
        });

    } catch (error) {
        console.error("Error adding product:", error);
        
        res.status(500).json({ message: 'Failed to add product.', error: getErrorMessage(error) });
    }
};



export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: UpdateProductPayload = req.body;

    try {
        const updateData: any = { 
            ...data, 
            updatedAt: admin.firestore.FieldValue.serverTimestamp() 
        };

        
        if (data.price !== undefined) updateData.price = Number(data.price);
        if (data.stock !== undefined) updateData.stock = Number(data.stock);

        await productsCollection.doc(id).update(updateData);
        res.status(200).json({ message: 'Product updated successfully.' });

    } catch (error) {
        console.error("Error updating product:", error);
        
        const errorMessage = getErrorMessage(error);
        
        
        if (errorMessage.includes('not found')) { 
            return res.status(404).json({ message: 'Product to update not found.' });
        }
        res.status(500).json({ message: 'Failed to update product.', error: errorMessage });
    }
};


export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await productsCollection.doc(id).delete();
        res.status(200).json({ message: 'Product deleted successfully.' });

    } catch (error) {
        console.error("Error deleting product:", error);
        
        res.status(500).json({ message: 'Failed to delete product.', error: getErrorMessage(error) });
    }
};
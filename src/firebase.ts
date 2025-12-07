import * as admin from 'firebase-admin';
import * as path from 'path';


import * as dotenv from 'dotenv';
dotenv.config();


const serviceAccountPath = path.resolve(
    __dirname, 
    '..', 
    process.env.FIREBASE_SERVICE_ACCOUNT || '' 
);

try {
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
    });
} catch (error) {
   
    if (error instanceof Error) {
        
        
        if (!/already exists/u.test(error.message)) {
            console.error("Firebase admin initialization error", error.stack);
        }
    } else {
        
        console.error("Unknown Firebase admin initialization error", error);
    }
}


export const db = admin.firestore();
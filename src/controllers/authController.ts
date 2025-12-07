import { Request, Response } from 'express';
import { auth, admin } from '../config/firebase';
import { UserPayload } from '../types/product.types';


const expiresIn = 60 * 60 * 24 * 5 * 1000; 

interface AuthRequest extends Request {
    body: {
        idToken?: string; 
    };
    user?: UserPayload;
}



export const login = async (req: AuthRequest, res: Response) => {
    const idToken = req.body.idToken;

    if (!idToken) {
        return res.status(400).json({ message: "ID Token is missing." });
    }

    try {
        const decodedIdToken = await auth.verifyIdToken(idToken);
        const userRole = decodedIdToken.role;

        if (userRole !== 'admin') {
            return res.status(403).json({ message: "Access denied. Only administrators can log in." });
        }

        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

       
        res.cookie("session", sessionCookie, {
            httpOnly: true,
            secure: false,     
            sameSite: "lax",   
            path: "/",
            maxAge: expiresIn,
        });

        res.status(200).json({
            message: 'Login successful. Session cookie set.',
            user: {
                uid: decodedIdToken.uid,
                email: decodedIdToken.email,
                role: userRole,
            }
        });

    } catch (error) {
        console.error("Login failed:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(401).json({ message: 'Login failed', error: errorMessage });
    }
};



export const logout = async (req: Request, res: Response) => {
   
    res.clearCookie('session');

    
    const sessionCookie = req.cookies.session || '';
    if (sessionCookie) {
        try {
            const decodedClaims = await auth.verifySessionCookie(sessionCookie);
            await auth.revokeRefreshTokens(decodedClaims.sub);
        } catch (error) {
           
            const errorMessage = error instanceof Error ? error.message : 'Unknown error during token revocation.';
            console.log(`Session already invalid or missing: ${errorMessage}`);
        }
    }

    res.status(200).json({ message: 'Logout successful.' });
};


export const getMe = (req: AuthRequest, res: Response) => {
    if (req.user) {
        
        return res.status(200).json({ user: req.user });
    }
   
    res.status(401).json({ message: 'Not authenticated.' });
};
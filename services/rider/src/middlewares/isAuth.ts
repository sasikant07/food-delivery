import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    restaurantId?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Please Login - No Authorization header" });
            return;
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Please Login - Token missing" });
            return;
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({ message: "Please Login - Invalid Token" });
            return;
        }

        req.user = decodedValue.user;
        next();
    } catch (error: any) {
        res.status(500).json({ message: "Please Login - JWT Error" });
    }
};

export const isSeller = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (user && user.role !== "seller") {
        res.status(401).json({
            message: "You are not authorised seller"
        });
        return;
    }
    next();
}
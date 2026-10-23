import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
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
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedValue || !decodedValue.user) {
            res.status(401).json({ message: "Please Login - Invalid Token" });
            return;
        }
        req.user = decodedValue.user;
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Please Login - JWT Error" });
    }
};
export const isSeller = async (req, res, next) => {
    const user = req.user;
    if (user && user.role !== "seller") {
        res.status(401).json({
            message: "You are not authorised seller"
        });
        return;
    }
    next();
};

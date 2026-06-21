import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // vérifier présence token
    if(!authHeader){

        return res.status(401).json({
            message: 'Token manquant'
        });
    }

    // récupérer token
    const token = authHeader.split(' ')[1];

    try {

        // vérifier token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // stocker infos user
        req.user = decoded;

        // passer à la suite
        next();

    } catch(error){

        return res.status(403).json({
            message: 'Token invalide'
        });
    }
};
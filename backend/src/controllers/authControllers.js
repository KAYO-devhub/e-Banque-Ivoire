import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 
import { pool } from '../config/database.js'
import dotenv from 'dotenv' 
dotenv.config({path: '/home/kayo/Documents/projetu_zero_papiers/backend/.env'})

export async function hashPassword(plainPassword) {
    const saltRounds = 10
    const hash = await bcrypt.hash(plainPassword,saltRounds)
    return hash
    
}




export const loginUser = async (
    email,
    password
) => {

    // requête SQL
    const [results] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    // utilisateur introuvable
    if(results.length === 0){

        throw {
            status: 404,
            message: 'Utilisateur introuvable'
        };
    }

    const user = results[0];

    // vérification password
    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    // mauvais password
    if(!validPassword){

        throw {
            status: 401,
            message: 'Mot de passe incorrect'
        };
    }

    // génération JWT
    const token = jwt.sign(

        {
            id: user.id,
            uuid: user.uuid,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: '1d'
        }
    );

    // retour
    return {

        message: 'Connexion réussie',

        token,

        user: {
            id: user.id,
            uuid: user.uuid,
            nom: user.nom,
            prenom: user.prenom,
            role: user.role
        }
    };
};


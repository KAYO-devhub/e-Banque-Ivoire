import { pool } from "../config/database.js"
import { hashPassword } from "../controllers/authControllers.js"
import { v4 } from "uuid"

//Inscription et authentification utilisateur
export async function register(nom,prenom,email,password) {
    const uuid = v4()
    const hashedPassword = await hashPassword(password)
    const request = await pool.query(`
        INSERT INTO
        users(uuid,nom,prenom,email,password)
        VALUES(?,?,?,?,?)
        `,[uuid,nom,prenom,email,hashedPassword])
    
}




//Voir les documents de l'utilisateur
export async function getDocuments(user_uuid) {
    const request = await pool.query(`
        SELECT * FROM
        documents
        WHERE user_uuid = ?
        `,[user_uuid])
    return request
    
}

export async function deleteDocuments(user_uuid, nom_document) {
    const request = await pool.query(`
        DELETE FROM
        documents
        WHERE user_uuid = ? AND nom_document = ?
        `,[user_uuid, nom_document])
}


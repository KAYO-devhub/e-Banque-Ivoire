import { pool } from "../config/database.js"
import { hashPassword } from "../controllers/authControllers.js"
import { v4 } from "uuid"
import { unlink } from "fs/promises"
import path from "path"

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

//Effacer les documents de l'utilisateur
export async function deleteDocuments(user_uuid, nom_document) {
    try {
        // 1. On récupère le chemin EN PREMIER (pendant que la ligne existe encore)
        const [rows] = await pool.query(`
            SELECT chemin_fichier 
            FROM documents
            WHERE user_uuid = ? AND nom_document = ?
        `, [user_uuid, nom_document]);

        // Si le document n'existe pas du tout en BDD, on s'arrête proprement
        if (!rows || rows.length === 0) {
            console.log("⚠️ Aucun document correspondant trouvé en base de données.");
            return false;
        }

        // rows[0] ressemble à : { chemin_fichier: 'backend/src/uploads/12345.md' }
        const relativePath = rows[0].chemin_fichier;
        const absolutePath = path.join(process.cwd(), relativePath);

        // 2. On supprime le fichier physique sur le disque dur
        try {
            await unlink(absolutePath); // Bien utiliser le chemin absolu ici !
            console.log(`💾 Fichier physique supprimé avec succès : ${absolutePath}`);
        } catch (fileError) {
            // Si le fichier a déjà été supprimé à la main, on log mais on ne bloque pas la suite
            console.log(`ℹ️ Le fichier physique n'a pas pu être supprimé (peut-être déjà inexistant) : ${fileError.message}`);
        }

        // 3. On supprime enfin la ligne dans la base de données
        await pool.query(`
            DELETE FROM documents
            WHERE user_uuid = ? AND nom_document = ?
        `, [user_uuid, nom_document]);

        console.log(`✅ Ligne MySQL supprimée avec succès pour le document : ${nom_document}`);
        return true;

    } catch (error) {
        console.error("❌ Erreur critique lors de la suppression globale :", error);
        throw error;
    }
}

//Mettre à jour le nom des documents de l'utilisateur
export async function updateDocumentName(user_uuid, nom_document, nouveau_nom) {
    const request = await pool.query(`
        UPDATE documents 
        SET nom_document = ? 
        WHERE user_uuid = ? AND nom_document = ?
    `, [nouveau_nom, user_uuid, nom_document])
    return request
}





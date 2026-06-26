import { app } from '../routes/routes.js';
import multer from 'multer';
import path from 'path';

export let nomFinal;
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Utilisation de process.cwd() pour éviter l'erreur "ENOENT" sur le serveur Render
        cb(null, path.join(process.cwd(), 'backend/src/uploads')); 
    },
    filename: (req, file, cb) => {
        // 1. Récupération de la valeur de la case cochée (envoyée par le frontend)
        // Si pour une raison quelconque la valeur est absente, on met "Document" par défaut
        const typeDoc = req.body.typeDocument || 'Document';
        
        // 2. Extraction de l'extension (.pdf, .jpg, etc.)
        const extension = path.extname(file.originalname);
        
        // 3. Création de la date au format YYYY_MM_DD
        const date = new Date();
        const annee = date.getFullYear();
        const mois = String(date.getMonth() + 1).padStart(2, '0');
        const jour = String(date.getDate()).padStart(2, '0');
        const dateFormatee = `${annee}_${mois}_${jour}`;

        // 4. Récupération de l'email de l'utilisateur
        const {email} = req.body

        // 4. Assemblage du nom : [valeur_de_la_case]_[annee_mois_jour].[extension]
        nomFinal = `${typeDoc}_${email}_${dateFormatee}${extension}`;
        
        // 5. Nettoyage de sécurité (optionnel mais recommandé)
        // Remplace les espaces et les apostrophes par des tirets pour éviter les bugs d'URL
        // Exemple : "Extrait d'acte de naissance" devient "Extrait-d-acte-de-naissance"
        nomFinal = nomFinal.replace(/[' ]/g, '-');
        
        cb(null, nomFinal); 
    }
});


export const upload = multer({ storage: storage });
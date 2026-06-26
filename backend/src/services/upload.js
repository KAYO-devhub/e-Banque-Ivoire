import multer from 'multer';
import path from 'path';

export const nomFichierFinal
// Fonction unifiée pour nettoyer TOUTES les chaînes (Type doc, Nom, Prénom)
const nettoyerTexte = (texte) => {
    if (!texte) return '';
    return texte
        .toLowerCase()
        // Enclenche le retrait des accents (ex: é -> e, ç -> c)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        // Remplace les espaces, apostrophes et caractères spéciaux par un seul underscore
        .replace(/[^a-z0-9]/g, '_') 
        // Évite d'avoir plusieurs underscores à la suite (ex: __)
        .replace(/_+/g, '_')
        // Supprime les underscores au début ou à la fin s'il y en a
        .replace(/^_+|_+$/g, ''); 
};

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Excellente idée : process.cwd() est indispensable pour le système de fichiers éphémère de Render
        cb(null, path.join(process.cwd(), 'backend/src/uploads')); 
    },
    filename: (req, file, cb) => {
        // 1. Récupération et NETTOYAGE du type de document (ex: "Extrait d'acte" -> "extrait_d_acte")
        const typeDocBrut = req.body.typeDocument || 'document';
        const typeDoc = nettoyerTexte(typeDocBrut);

        // 2. Récupération et nettoyage du Nom / Prénom (Via ton middleware JWT req.user)
        const nom = req.user?.nom || 'nom';
        const prenom = req.user?.prenom || 'prenom';
        const nomPropre = nettoyerTexte(nom);
        const prenomPropre = nettoyerTexte(prenom);
        
        // 3. Extraction de l'extension (.pdf, .jpg) en minuscules
        const extension = path.extname(file.originalname).toLowerCase();
        
        // 4. Création de la date au format YYYY_MM_DD
        const date = new Date();
        const dateFormatee = `${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}_${String(date.getDate()).padStart(2, '0')}`;

        // 5. Assemblage final 100% standardisé en snake_case (_)
        // Exemple : cni_kouame_axel_2026_06_26.jpg
        nomFichierFinal = `${typeDoc}_${nomPropre}_${prenomPropre}_${dateFormatee}${extension}`;
        
        cb(null, nomFichierFinal); 
    }
});

export const upload = multer({ storage: storage });
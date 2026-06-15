import express from 'express'
import { register, getDocuments, deleteDocuments, updateDocumentName } from '../services/features.js'
import { storage, upload } from '../services/upload.js'
import { pool } from '../config/database.js'
import { loginUser } from '../controllers/authControllers.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import cors from 'cors'


export const app = express()
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
    // Supprimez ou passez credentials à false
}));


app.use(express.json())

//Inscription et authentification des utilisateurs
app.post("/register",async (req,res) => {
    try {
        const {nom,prenom,email,password} = req.body
        const result = await register(nom,prenom,email,password)
        res.status(201).send("User created")
        
    } catch (error) {
        res.status(403).json({message: "Cet utilisateur existe déja"})
        
    }

    
    
})

app.post('/login', async (req, res) => {

    // récupérer email/password
    const { email, password} = req.body;

    try {

        // appel fonction login
        const result = await loginUser(
            email,
            password
        );

        // succès
        res.status(200).json(result);

    } catch(error){

        // erreur
        res.status(error.status || 500).json({
            message: error.message
        });
    }
});



//Upload les fichiers existant vers le serveur
app.post('/documents/:uuid',verifyToken,upload.single('monFichier'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded")
        }

        //Enregistrer les donnée du document dans la base de donnée
        await pool.query(`
            INSERT INTO documents(nom_document,type_document,mime_type,chemin_fichier,user_uuid)
            VALUES(?,?,?,?,?)
        `, [
            req.file.originalname,
            "document administratif",
            req.file.mimetype,
            req.file.path,
            req.params.uuid
        ])

        return res.status(201).send("Document registered with success !")
    } catch (error) {
        console.error(error)
        return res.status(500).send("Server error")
    }
})

// Upload les fichiers scannés vers le serveurs
app.post('/documents/scan/:uuid', verifyToken, upload.single('monFichier'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Capture de scan manquante." });
        }

        // Enregistrement spécifique pour identifier que ça vient de la caméra
        await pool.query(`
            INSERT INTO documents(nom_document, type_document, mime_type, chemin_fichier, user_uuid)
            VALUES(?, ?, ?, ?, ?)
        `, [
            `Scan_${Date.now()}_` + req.file.originalname,
            "Document Scanné",
            req.file.mimetype,
            req.file.path,
            req.params.uuid
        ]);

        return res.status(201).json({ message: "Document scanné et enregistré avec succès !" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur lors de l'enregistrement du scan." });
    }
});

//Voir les documents de l'utilisateur
app.get("/getDocuments/:uuid",verifyToken, async (req,res) => {
    try {
        const result = await getDocuments(req.params.uuid)
        res.status(200).send(result[0])
        
    } catch (error) {
        res.status(500).json({message: "Impossible de récupérer les documents."})
        
    }
    
})


app.put("/updateDocuments/:uuid",verifyToken,async (req,res) => {
    try {
        const {nom_document, nouveau_nom} = req.body
        await updateDocumentName(req.params.uuid,nom_document,nouveau_nom)
        res.status(200).json({message: "Document modifié avec succes."})
        
    } catch (error) {
        res.status(500).json({message: "Erreur lors de la modification."})
        
    }
    
})





app.delete("/deleteDocuments/:uuid",verifyToken,upload.single("monFichier"), async (req,res) => {
    try {
        const {nom_document} = req.body
        await deleteDocuments(req.params.uuid, nom_document)
        res.status(200).json({message: "Le document à été supprimer avec succès."})
        
    } catch (error) {
        res.status(500).json({message: "Erreur lors de la suppression."})
        
    }
    
})


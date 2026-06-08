import express from 'express'
import { register, getDocuments, deleteDocuments } from '../services/features.js'
import { storage, upload } from '../services/upload.js'
import { pool } from '../config/database.js'
import { loginUser } from '../controllers/authControllers.js'
import { verifyToken } from '../middleware/authMiddleware.js'


export const app = express()
app.use(express.json())

//Inscription et authentification des utilisateurs
app.post("/register",async (req,res) => {
    const {nom,prenom,email,password} = req.body
    const result = await register(nom,prenom,email,password)
    res.status(201).send("User created")
    
})

app.post('/login', async (req, res) => {

    // récupérer email/password
    const { email, password } = req.body;

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



//Upload les fichiers sur le serveur
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

//Voir les documents de l'utilisateur
app.get("/getDocuments/:uuid",verifyToken, async (req,res) => {
    const result = await getDocuments(req.params.uuid)
    res.status(200).send(result[0])
    
})

app.delete("/deleteDocuments/:uuid",verifyToken,upload.single("monFichier"), async (req,res) => {
    const result = await deleteDocuments(req.params.uuid, req.file.originalname)
    res.status(200).send(`Le fichier ${req.file.originalname} a été effacer avec succès`)
    
})


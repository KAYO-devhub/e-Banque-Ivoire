import express from 'express'
import { register, getDocuments, deleteDocuments, updateDocumentName } from '../services/features.js'
import { storage, upload, nomFichierFinal } from '../services/upload.js'
import { pool } from '../config/database.js'
import { loginUser } from '../controllers/authControllers.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import cors from 'cors'
import crypto from 'crypto'
import path from 'path'


export const app = express()
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
    // Supprimez ou passez credentials à false
}));

app.use(express.json())

// Indique à Express que le contenu statique est dans le dossier 'frontend'

app.use(express.static(path.join(process.cwd(), 'frontend')));

// Route par défaut pour servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
});

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
            nomFinal,
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
            nomFinal,
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

// ==========================================
// 1. L'ADMIN CREE LA DEMANDE APRES LE SCAN
// ==========================================
app.post('/requests/create', async (req, res) => {
    try {
        const { adminUuid, clientUuid } = req.body;
        
        // On génère un identifiant unique pour cette transaction
        const requestId = crypto.randomUUID(); 

        await pool.query(
            `INSERT INTO partages_temporaires (request_id, admin_uuid, client_uuid, status) 
             VALUES (?, ?, ?, 'en_attente')`,
            [requestId, adminUuid, clientUuid]
        );

        res.status(200).json({ success: true, requestId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de la demande" });
    }
});


// ==========================================
// 2. LE CLIENT VERIFIE S'IL A UNE DEMANDE
// ==========================================
app.get('/requests/check-client/:uuid', async (req, res) => {
    try {
        const clientUuid = req.params.uuid;

        // On cherche la demande la plus récente en attente pour ce client
        const [results] = await pool.query(
            `SELECT request_id FROM partages_temporaires 
             WHERE client_uuid = ? AND status = 'en_attente' 
             ORDER BY created_at DESC LIMIT 1`,
            [clientUuid]
        );

        if (results.length > 0) {
            res.status(200).json({ hasRequest: true, requestId: results[0].request_id });
        } else {
            res.status(200).json({ hasRequest: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// ==========================================
// 3. LE CLIENT ACCEPTE ET ENVOIE SES DOCUMENTS
// ==========================================
app.post('/requests/accept', async (req, res) => {
    try {
        const { requestId, documents } = req.body;
        
        // documents est un tableau d'ID, ex: [1, 2, 3]
        // On le convertit en chaîne JSON pour le stocker dans MySQL
        const documentsJson = JSON.stringify(documents);

        await pool.query(
            `UPDATE partages_temporaires 
             SET status = 'accepte', documents_partages = ? 
             WHERE request_id = ?`,
            [documentsJson, requestId]
        );

        res.status(200).json({ success: true, message: "Documents envoyés" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la validation" });
    }
});


// ==========================================
// 4. L'ADMIN VERIFIE LA REPONSE ET RECUPERE LES FICHIERS
// ==========================================
app.get('/requests/check-admin/:reqId', async (req, res) => {
    try {
        const reqId = req.params.reqId;

        const [requests] = await pool.query(
            `SELECT status, documents_partages FROM partages_temporaires WHERE request_id = ?`,
            [reqId]
        );

        if (requests.length === 0) {
            return res.status(404).json({ message: "Demande introuvable" });
        }

        const demande = requests[0];

        // Si le client a accepté
        if (demande.status === 'accepte') {
            const docIds = demande.documents_partages; // Tableau des IDs [1, 2, 3]

            if (!docIds || docIds.length === 0) {
                return res.status(200).json({ status: 'accepted', documents: [] });
            }

            // On va chercher les vraies informations des documents dans ta table `documents`
            // /!\ Assure-toi que les noms de colonnes correspondent à TA table documents (id, nom_document, chemin_fichier)
            const [documents] = await pool.query(
                `SELECT id, nom_document, chemin_fichier 
                 FROM documents 
                 WHERE id IN (?)`,
                [docIds] // MySQL gère automatiquement le tableau avec le IN (?)
            );

            return res.status(200).json({ 
                status: 'accepted', 
                documents: documents 
            });
        } 
        // Si c'est refusé
        else if (demande.status === 'refuse') {
            return res.status(200).json({ status: 'rejected' });
        } 
        // Si c'est toujours en attente
        else {
            return res.status(200).json({ status: 'pending' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// À ajouter dans ton fichier backend (ex: routes.js)
app.post('/requests/reject', async (req, res) => {
    try {
        const { requestId } = req.body;
        
        await pool.query(
            `UPDATE partages_temporaires SET status = 'refuse' WHERE request_id = ?`,
            [requestId]
        );

        res.status(200).json({ success: true, message: "Demande refusée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors du traitement du refus" });
    }
});

// Récupérer les informations publiques d'un utilisateur via son UUID
app.get('/users/info/:uuid', async (req, res) => {
    try {
        // Assure-toi que le nom de ta table est bien "users" ou "utilisateurs" selon ta base de données
        const [rows] = await pool.query(
            'SELECT nom, prenom, email FROM users WHERE uuid = ?', 
            [req.params.uuid]
        );

        if (rows.length > 0) {
            res.status(200).json({ success: true, user: rows[0] });
        } else {
            res.status(404).json({ success: false, message: "Citoyen introuvable." });
        }
    } catch (error) {
        console.error("Erreur récupération infos utilisateur :", error);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
});

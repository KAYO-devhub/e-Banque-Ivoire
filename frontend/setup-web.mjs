import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définition de l'arborescence et du contenu en pur HTML / CSS / Vanilla JS
const files = {
  // PACKAGE.JSON (Optionnel, juste pour lancer un serveur web local facilement)
  'package.json': JSON.stringify({
    name: "zero-papier-web-frontend",
    version: "1.0.0",
    type: "module",
    scripts: {
      "start": "npx serve ."
    },
    dependencies: {
      "serve": "^14.2.3"
    }
  }, null, 2),

  // FEUILLE DE STYLE CENTRALISÉE
  'css/style.css': `:root {
  --primary: #FF6B00;    /* Orange Côte d'Ivoire */
  --success: #009A44;    /* Vert Côte d'Ivoire */
  --danger: #FF3B30;
  --dark: #333333;
  --light: #F9F9F9;
  --white: #FFFFFF;
  --border: #E0E0E0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #F4F4F6;
  color: var(--dark);
  line-height: 1.6;
}

.container {
  max-width: 750px;
  margin: 40px auto;
  padding: 25px;
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid var(--success);
}

header h1 {
  color: var(--primary);
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 1px;
}

.subtitle {
  color: var(--success);
  font-size: 13px;
  font-weight: 600;
  margin-top: 4px;
}

h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--dark);
}

/* Navigation alternative */
.nav-links {
  display: flex;
  justify-content: space-between;
  background: var(--light);
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  border: 1px solid var(--border);
}

.nav-links a {
  color: var(--dark);
  text-decoration: none;
  font-weight: 600;
}

.nav-links a:hover {
  color: var(--primary);
}

/* Formulaires */
.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
}

input[type="text"], input[type="email"], input[type="password"], input[type="file"] {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--light);
}

input:focus {
  outline: none;
  border-color: var(--primary);
  background-color: var(--white);
}

/* Boutons */
.btn {
  display: block;
  width: 100%;
  padding: 14px;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-success { background-color: var(--success); }
.btn-default { background-color: #EAEAEA; color: #333; box-shadow: none; }
.btn-danger { background-color: var(--danger); }
.btn:disabled { background-color: #CCCCCC; cursor: not-allowed; }

/* Cadres informatifs et listes de documents */
.profile-box {
  background: #FDFDFD;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 25px;
  border-left: 5px solid var(--success);
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}

.card {
  background: var(--white);
  border-left: 4px solid var(--primary);
  padding: 16px;
  margin: 12px 0;
  border-radius: 4px 8px 8px 4px;
  border: 1px solid var(--border);
  border-left-width: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card.admin-card { border-left-color: var(--success); }
.card-info h3 { font-size: 16px; color: #333; }
.card-info p { font-size: 13px; color: #666; margin-top: 2px; }

.hidden { display: none !important; }`,

  // JS SERVICES : APP.JS (Gestion globale d'état d'auth)
  'js/app.js': `export function checkAuth(forceRedirect = true) {
  const token = localStorage.getItem('userToken');
  const user = JSON.parse(localStorage.getItem('userData'));

  if (forceRedirect && (!token || !user)) {
    window.location.href = 'login.html';
    return { user: null, token: null };
  }
  return { user, token };
}`,

  // JS SERVICES : API.JS (Couche de communication Fetch API)
  'js/api.js': `const API_URL = 'http://localhost:3000';

function getHeaders(isMultipart = false) {
  const token = localStorage.getItem('userToken');
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = \`Bearer \${token}\`;
  }
  return headers;
}

export const authAPI = {
  async register(nom, prenom, email, password) {
    const res = await fetch(\`\${API_URL}/register\`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nom, prenom, email, password })
    });
    if (!res.ok) throw new Error(await res.text() || "Erreur d'inscription");
    return res.text();
  },

  async login(email, password) {
    const res = await fetch(\`\${API_URL}/login\`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: "Identifiants invalides" }));
      throw new Error(errData.message || "Identifiants invalides");
    }
    return res.json();
  }
};

export const documentAPI = {
  async getDocuments(userUuid) {
    const res = await fetch(\`\${API_URL}/getDocuments/\${userUuid}\`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Impossible de récupérer vos documents.");
    return res.json();
  },

  async uploadDocument(userUuid, file) {
    const formData = new FormData();
    formData.append('monFichier', file); // 'monFichier' mappe le multer du backend

    const res = await fetch(\`\${API_URL}/documents/\${userUuid}\`, {
      method: 'POST',
      headers: getHeaders(true), 
      body: formData
    });
    if (!res.ok) throw new Error("Échec du téléversement du document.");
    return res.text();
  },

  async deleteDocument(userUuid, filename) {
    const res = await fetch(\`\${API_URL}/deleteDocuments/\${userUuid}\`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ filename })
    });
    if (!res.ok) throw new Error("Impossible de supprimer ce fichier.");
    return res.text();
  },

  async verifyQR(qrCodeData) {
    const res = await fetch(\`\${API_URL}/documents/verify\`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code: qrCodeData })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ message: "QR Code non valide ou introuvable." }));
      throw new Error(errData.message || "QR Code non valide.");
    }
    return res.json();
  }
};`,

  // INDEX.HTML (Page d'accueil citoyenne)
  'index.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zéro Papier CI - Accueil</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>ZÉRO PAPIER CÔTE D'IVOIRE</h1>
      <p class="subtitle">Votre portefeuille documentaire numérique sécurisé</p>
    </header>

    <nav class="nav-links" id="navLinks"></nav>

    <main>
      <div class="profile-box">
        <h2 id="welcomeTitle">Akwaba !</h2>
        <p id="welcomeText">Chargement de votre session...</p>
      </div>

      <div id="menuServices" class="hidden">
        <h2>Services disponibles</h2>
        <a href="dashboard.html" class="btn">📸 Gérer et scanner mes documents</a>
        <a href="admin.html" id="adminBtn" class="btn btn-success hidden">🔒 Espace Administration (Vérifier QR)</a>
      </div>
    </main>
  </div>

  <script type="module">
    import { checkAuth } from './js/app.js';
    const { user, token } = checkAuth(false);

    const navLinks = document.getElementById('navLinks');
    const welcomeTitle = document.getElementById('welcomeTitle');
    const welcomeText = document.getElementById('welcomeText');
    const menuServices = document.getElementById('menuServices');
    const adminBtn = document.getElementById('adminBtn');

    if (token && user) {
      welcomeTitle.textContent = \`Akwaba, \${user.prenom} \${user.nom} !\`;
      welcomeText.textContent = \`Rôle : Citoyen enregistré numérique. Bienvenue dans votre coffre-fort sécurisé.\`;
      menuServices.classList.remove('hidden');

      navLinks.innerHTML = \`
        <a href="index.html">Accueil</a>
        <a href="dashboard.html">Mon Coffre-fort</a>
        <a href="#" id="logoutBtn">Se déconnecter</a>
      \`;

      if (user.role === 'admin') {
        adminBtn.classList.remove('hidden');
      }

      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.reload();
      });
    } else {
      welcomeTitle.textContent = "Akwaba !";
      welcomeText.textContent = "Connectez-vous pour numériser, enregistrer et gérer vos documents administratifs officiels d'État.";
      
      navLinks.innerHTML = \`
        <a href="index.html">Accueil</a>
        <a href="login.html">Connexion</a>
        <a href="register.html">Inscription</a>
      \`;

      menuServices.innerHTML = \`
        <p style="text-align: center; margin: 20px 0; color: #666;">Veuillez vous authentifier pour accéder à vos services.</p>
        <a href="login.html" class="btn">Se connecter maintenant</a>
      \`;
      menuServices.classList.remove('hidden');
    }
  </script>
</body>
</html>`,

  // LOGIN.HTML (Page de Connexion)
  'login.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zéro Papier CI - Connexion</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>ZÉRO PAPIER CÔTE D'IVOIRE</h1>
      <p class="subtitle">Espace de connexion citoyen</p>
    </header>

    <nav class="nav-links">
      <a href="index.html">Accueil</a>
      <a href="register.html">Inscription</a>
    </nav>

    <main>
      <h2>Connexion</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="email">Adresse Email</label>
          <input type="email" id="email" required placeholder="exemple@domain.ci">
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" required placeholder="******">
        </div>
        <button type="submit" class="btn" id="submitBtn">Se connecter</button>
      </form>
      <p style="margin-top: 20px; text-align: center; font-size: 14px;">
        Nouveau sur la plateforme ? <a href="register.html" style="color: var(--primary); font-weight: bold;">Créez un compte</a>
      </p>
    </main>
  </div>

  <script type="module">
    import { authAPI } from './js/api.js';

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const btn = document.getElementById('submitBtn');

      btn.disabled = true;
      btn.textContent = "Vérification en cours...";

      try {
        const data = await authAPI.login(email, password);
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        alert("Connexion réussie !");
        window.location.href = 'index.html';
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = "Se connecter";
      }
    });
  </script>
</body>
</html>`,

  // REGISTER.HTML (Page d'Inscription)
  'register.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zéro Papier CI - Créer un compte</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>ZÉRO PAPIER CÔTE D'IVOIRE</h1>
      <p class="subtitle">Enregistrement au registre citoyen e-Gov</p>
    </header>

    <nav class="nav-links">
      <a href="index.html">Accueil</a>
      <a href="login.html">Connexion</a>
    </nav>

    <main>
      <h2>Inscription</h2>
      <form id="registerForm">
        <div class="form-group">
          <label for="nom">Nom de famille</label>
          <input type="text" id="nom" required placeholder="Koffi">
        </div>
        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input type="text" id="prenom" required placeholder="Jean-Marie">
        </div>
        <div class="form-group">
          <label for="email">Adresse Email officielle</label>
          <input type="email" id="email" required placeholder="jean.koffi@egov.ci">
        </div>
        <div class="form-group">
          <label for="password">Mot de passe sécurisé</label>
          <input type="password" id="password" required placeholder="******">
        </div>
        <button type="submit" class="btn btn-success" id="submitBtn">Créer mon espace numérique</button>
      </form>
    </main>
  </div>

  <script type="module">
    import { authAPI } from './js/api.js';

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nom = document.getElementById('nom').value;
      const prenom = document.getElementById('prenom').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const btn = document.getElementById('submitBtn');

      btn.disabled = true;
      btn.textContent = "Traitement de l'inscription...";

      try {
        await authAPI.register(nom, prenom, email, password);
        alert("Félicitations, votre espace citoyen a été initialisé. Connectez-vous !");
        window.location.href = 'login.html';
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = "Créer mon espace numérique";
      }
    });
  </script>
</body>
</html>`,

  // DASHBOARD.HTML (Tableau de bord : liste et capture de fichiers de l'utilisateur)
  'dashboard.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zéro Papier CI - Mon Espace Documentaire</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>ZÉRO PAPIER CÔTE D'IVOIRE</h1>
      <p class="subtitle">Espace Privé de Gestion Documentaire Cloud</p>
    </header>

    <nav class="nav-links">
      <a href="index.html">Accueil</a>
      <a href="#" id="logoutLink">Se déconnecter</a>
    </nav>

    <main>
      <section style="background: #FFF9F5; padding: 20px; border-radius: 8px; border: 1px dashed var(--primary); margin-bottom: 30px;">
        <h2>📸 Numériser / Téléverser un document</h2>
        <form id="uploadForm">
          <div class="form-group">
            <label for="monFichier">Sélectionnez une image de capture ou un document PDF</label>
            <input type="file" id="monFichier" required accept="image/*,application/pdf">
          </div>
          <button type="submit" class="btn" id="uploadBtn">Envoyer vers le coffre-fort d'État</button>
        </form>
      </section>

      <section>
        <h2>📂 Mes Documents Cloud Enregistrés</h2>
        <div id="loading" style="text-align: center; color: #666; padding: 10px;">Récupération de vos données sécurisées...</div>
        <div id="documentList"></div>
      </section>
    </main>
  </div>

  <script type="module">
    import { checkAuth } from './js/app.js';
    import { documentAPI } from './js/api.js';

    // Redirige automatiquement vers le login si la session n'est pas ouverte
    const { user } = checkAuth(true);

    document.getElementById('logoutLink').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = 'index.html';
    });

    const docListDiv = document.getElementById('documentList');
    const loadingDiv = document.getElementById('loading');

    // Charger les documents de la bdd
    async function loadDocuments() {
      loadingDiv.classList.remove('hidden');
      docListDiv.innerHTML = '';
      try {
        const docs = await documentAPI.getDocuments(user.uuid);
        if (docs.length === 0) {
          docListDiv.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Aucune pièce sauvegardée pour le moment.</p>';
          return;
        }

        docs.forEach(doc => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = \`
            <div class="card-info">
              <h3>\${doc.nom_document}</h3>
              <p style="color: var(--success); font-weight: 600;">\${doc.type_document || 'Document Administratif'}</p>
              <p>Type Mime : \&nbsp;\${doc.mime_type}</p>
            </div>
            <button class="btn btn-danger delete-btn" data-filename="\${doc.nom_document}" style="width: auto; padding: 6px 12px; font-size: 13px; margin: 0;">
              Supprimer
            </button>
          \`;
          docListDiv.appendChild(card);
        });

        // Gérer les écouteurs sur les boutons Supprimer
        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', async (e) => {
            const filename = e.target.getAttribute('data-filename');
            if (confirm(\`Voulez-vous supprimer définitivement le document "\${filename}" ?\`)) {
              try {
                await documentAPI.deleteDocument(user.uuid, filename);
                alert("Document supprimé avec succès !");
                loadDocuments();
              } catch (err) {
                alert(err.message);
              }
            }
          });
        });

      } catch (err) {
        docListDiv.innerHTML = \`<p style="text-align:center; color: var(--danger);">\${err.message}</p>\`;
      } finally {
        loadingDiv.classList.add('hidden');
      }
    }

    // Gérer l'envoi de fichier
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('monFichier');
      const btn = document.getElementById('uploadBtn');

      if (fileInput.files.length === 0) return;

      btn.disabled = true;
      btn.textContent = "Télétransmission chiffrée en cours...";

      try {
        await documentAPI.uploadDocument(user.uuid, fileInput.files[0]);
        alert("Enregistrement validé dans votre espace cloud !");
        fileInput.value = '';
        loadDocuments();
      } catch (err) {
        alert(err.message);
      } finally {
        btn.disabled = false;
        btn.textContent = "Envoyer vers le coffre-fort d'État";
      }
    });

    // Chargement initial
    loadDocuments();
  </script>
</body>
</html>`,

  // ADMIN.HTML (Espace Contrôle Administratif / Validation QR Code client)
  'admin.html': `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zéro Papier CI - Espace Administration</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>ZÉRO PAPIER CÔTE D'IVOIRE</h1>
      <p class="subtitle">🔒 Portail d'Authentification et de Contrôle Républicain</p>
    </header>

    <nav class="nav-links">
      <a href="index.html">Accueil</a>
      <a href="dashboard.html">Mon Espace</a>
    </nav>

    <main>
      <h2>Contrôle de validité des pièces</h2>
      <p style="font-size:14px; color:#555; margin-bottom: 15px;">
        Interrogez instantanément la signature électronique ou le code d'un document pour valider son intégrité auprès des ministères.
      </p>

      <form id="verifyForm">
        <div class="form-group">
          <label for="qrData">Entrez la clé de hachage du QR Code</label>
          <input type="text" id="qrData" required placeholder="Ex: QR-98765-XYZ-CI">
        </div>
        <button type="submit" class="btn btn-success" id="verifyBtn">Vérifier l'authenticité</button>
      </form>

      <div id="resultBox" class="hidden" style="margin-top: 25px;"></div>
    </main>
  </div>

  <script type="module">
    import { checkAuth } from './js/app.js';
    import { documentAPI } from './js/api.js';

    const { user } = checkAuth(true);

    // Blocage strict de sécurité côté client
    if (!user || user.role !== 'admin') {
      alert("Accès refusé : Zone réservée aux agents de l'administration.");
      window.location.href = 'index.html';
    }

    const resultBox = document.getElementById('resultBox');

    document.getElementById('verifyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const qrData = document.getElementById('qrData').value;
      const btn = document.getElementById('verifyBtn');

      btn.disabled = true;
      btn.textContent = "Interrogation du registre central d'État...";
      resultBox.classList.add('hidden');

      try {
        const res = await documentAPI.verifyQR(qrData);
        resultBox.className = "card admin-card";
        resultBox.innerHTML = \`
          <div class="card-info">
            <h3 style="color: var(--success);">✅ CERTIFICAT VALIDE</h3>
            <p style="margin-top: 5px;"><strong>Réponse de l'infrastructure :</strong> \${res.message || 'Le document présenté est authentique.'}</p>
          </div>
        \`;
      } catch (err) {
        resultBox.className = "card";
        resultBox.style.borderLeftColor = "var(--danger)";
        resultBox.innerHTML = \`
          <div class="card-info">
            <h3 style="color: var(--danger);">❌ ALERTE CONTRÔLE : DOCUMENT NON RECONNU</h3>
            <p style="margin-top: 5px;"><strong>Motif du rejet :</strong> \${err.message}</p>
          </div>
        \`;
      } finally {
        resultBox.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = "Vérifier l'authenticité";
      }
    });
  </script>
</body>
</html>`
};

// Logique d'écriture récursive
console.log("🚀 [HTML/CSS/JS] Lancement du script de déploiement d'architecture web...");

Object.keys(files).forEach((filePath) => {
  const fullPath = path.join(__dirname, filePath);
  const dirPath = path.dirname(fullPath);

  // Création dynamique des répertoires parents (css/, js/, etc.)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Écriture du fichier source
  fs.writeFileSync(fullPath, files[filePath], 'utf8');
  console.log(`  -> Fichier déployé : ${filePath}`);
});

console.log("\n✨ Succès complet ! Votre frontend Zéro Papier en HTML/CSS/JS natif est prêt.");
console.log("👉 Option 1 : Ouvrez directement 'index.html' dans votre navigateur.");
console.log("👉 Option 2 : Lancez 'npm install && npm start' pour lancer un serveur local.");
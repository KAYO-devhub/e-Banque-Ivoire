export const API_URL = 'http://192.168.1.29:3000';

function getHeaders(isMultipart = false) {
  const token = localStorage.getItem('userToken');
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const authAPI = {
  async register(nom, prenom, email, password) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nom, prenom, email, password })
    });
    if (!res.ok) throw new Error(await res.text() || "Erreur d'inscription");
    return res.text();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
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
    const res = await fetch(`${API_URL}/getDocuments/${userUuid}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("Impossible de récupérer vos documents.");
    return res.json();
  },

  async uploadDocument(userUuid, file) {
    const formData = new FormData();
    formData.append('monFichier', file); // 'monFichier' mappe le multer du backend

    const res = await fetch(`${API_URL}/documents/${userUuid}`, {
      method: 'POST',
      headers: getHeaders(true), 
      body: formData
    });
    if (!res.ok) throw new Error("Échec du téléversement du document.");
    return res.text();
  },

  async deleteDocument(userUuid, filename) {
    const res = await fetch(`${API_URL}/deleteDocuments/${userUuid}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ filename })
    });
    if (!res.ok) throw new Error("Impossible de supprimer ce fichier.");
    return res.text();
  },

  async verifyQR(qrCodeData) {
    const res = await fetch(`${API_URL}/documents/verify`, {
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
};
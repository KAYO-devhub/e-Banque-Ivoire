# Zéro Papiers - Application Digitale de Gestion des Documents

Plateforme moderne et sécurisée pour la gestion numérique des documents administratifs.

## 📂 Structure du Projet

```
projetu_zero_papiers/
├── backend/              ✅ API Node.js Express (existant)
├── frontend/             ✅ React Native App (NOUVEAU - Production Ready)
├── node_modules/         📦 Shared dependencies
└── PROJECT_SUMMARY.md    📋 Vue d'ensemble complète
```

---

## 🚀 Démarrage Rapide

### Prerequisites
- Node.js 16+ avec npm
- MySQL running avec base "zero_papiers"
- Expo CLI: `npm install -g expo-cli`

### Installation & Lancement

```bash
# 1. Terminal 1 - Backend API
cd backend
npm install
npm run dev
# Doit afficher: "Server running on http://localhost:3000"

# 2. Terminal 2 - Frontend App
cd frontend
npm install
npm start
# Scannez le QR code ou choisissez une plateforme (i/a/w)
```

Voir **frontend/SETUP.md** pour des instructions détaillées.

---

## 📊 Composants du Projet

### Backend (Existant)
- ✅ Express.js API
- ✅ MySQL Database
- ✅ JWT Authentication
- ✅ File Upload (Multer)
- ✅ User & Document Management

### Frontend (Nouveau - Production Ready)
- ✅ React Native + TypeScript
- ✅ 7 Écrans complets
- ✅ Authentification JWT
- ✅ Gestion documents
- ✅ QR Scanner (Admin)
- ✅ Design system moderne
- ✅ Error handling
- ✅ Form validation

---

## 📱 Fonctionnalités

### Pour les Utilisateurs
- ✅ Inscription & Connexion
- ✅ Scanner/Uploader documents
- ✅ Lister ses documents
- ✅ Supprimer documents
- ✅ Consulter son profil
- ✅ Déconnexion

### Pour les Administrateurs
- ✅ Tous les droits utilisateurs +
- ✅ Scanner QR codes
- ✅ Valider documents
- ✅ Gestion admin

---

## 📚 Documentation

| Document | Contenu | Localisation |
|----------|---------|--------------|
| **PROJECT_SUMMARY.md** | Vue d'ensemble du projet | `/` |
| **frontend/README.md** | Tech stack & features | `/frontend` |
| **frontend/SETUP.md** | Instructions lancement | `/frontend` |
| **frontend/ARCHITECTURE.md** | Architecture détaillée | `/frontend` |
| **frontend/COMPLETE.md** | Résumé de création | `/frontend` |
| **frontend/FILES_CREATED.md** | Liste des fichiers | `/frontend` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     React Native Mobile App         │
├─────────────────────────────────────┤
│  ├─ Screens (7 écrans)              │
│  ├─ Services (API integration)      │
│  ├─ Components (Reusable)           │
│  ├─ Hooks (Custom logic)            │
│  └─ Store (Zustand state)           │
├─────────────────────────────────────┤
│     Axios + React Query             │
├─────────────────────────────────────┤
│  Express.js API (localhost:3000)    │
├─────────────────────────────────────┤
│     MySQL Database                  │
└─────────────────────────────────────┘
```

---

## 🔐 Sécurité

✅ JWT Authentication avec expiration  
✅ Tokens stockés sécurisé (Expo SecureStore)  
✅ Auto-logout on 401 errors  
✅ Role-based access control  
✅ Form validation (Zod)  
✅ Encrypted password storage (Bcrypt)  

---

## 📦 Stack Technologique

### Backend
- Node.js + Express.js
- MySQL 8+
- JWT + Bcrypt
- Multer (file upload)

### Frontend
- React Native 0.73
- TypeScript (strict)
- React Navigation v6
- Zustand + React Query
- Expo (Camera, SecureStore, etc.)

---

## 🧪 Test Complet

### Écran Login
```
Email: test@example.com
Password: password123
```

### Écran Register (1ère fois)
```
Nom: Dupont
Prénom: Jean
Email: test@example.com
Password: password123
```

### Fonctionnalités à Tester
1. ✅ Login/Register
2. ✅ Upload document
3. ✅ Voir documents
4. ✅ Supprimer document
5. ✅ Voir profil
6. ✅ Déconnexion

---

## 📋 Fichiers Clés

| Fichier | Rôle |
|---------|------|
| `frontend/src/screens/` | 7 écrans complets |
| `frontend/src/services/` | API integration |
| `frontend/src/store/authStore.ts` | Auth state |
| `frontend/src/api/axiosInstance.ts` | HTTP setup |
| `frontend/src/theme/index.ts` | Design system |
| `App.tsx` | Entry point |

---

## 🚢 Déploiement

### Build & Deploy

```bash
# iOS
eas build --platform ios
eas submit -p ios

# Android
eas build --platform android
eas submit -p android
```

Voir **frontend/README.md** pour les détails.

---

## 🐛 Troubleshooting

### Backend pas accessible
```bash
curl http://localhost:3000
# Devrait afficher une réponse
```

### npm install échoue
```bash
rm -rf node_modules package-lock.json
npm install
```

### App ne reload pas
- Appuyez `r` dans le terminal Expo

### Permissions refusées
- Check device settings

Voir **frontend/SETUP.md** pour plus de solutions.

---

## 📞 Support

- 📖 Lisez **frontend/SETUP.md** pour les instructions
- 🏗️ Lisez **frontend/ARCHITECTURE.md** pour l'architecture
- 📋 Lisez **frontend/FILES_CREATED.md** pour les fichiers
- 🎉 Lisez **frontend/COMPLETE.md** pour le résumé

---

## ✅ Statut du Projet

| Composant | Status |
|-----------|--------|
| Backend API | ✅ Ready |
| Frontend App | ✅ **NEW - Complete** |
| Database | ✅ Ready |
| Authentication | ✅ Complete |
| Documentation | ✅ Complete |
| **Overall** | **✅ PRODUCTION READY** |

---

## 🎉 Prêt à Démarrer?

```bash
# 1. Backend
cd backend && npm run dev

# 2. Frontend
cd frontend && npm install && npm start

# 3. Enjoy! 🚀
```

---

**Date**: 2026-06-07  
**Version**: 1.0.0  
**Status**: ✅ PRODUCTION READY

Pour plus d'informations, voir **PROJECT_SUMMARY.md**

# PDLHI Rapport - Guide de déploiement PWA

## 📱 Vue d'ensemble

PDLHI Rapport est maintenant une **Progressive Web App (PWA)** complètement fonctionnelle qui:

- ✅ S'installe sur Android comme une app native
- ✅ Fonctionne entièrement hors ligne après installation
- ✅ Offre toutes les fonctionnalités métier sans Internet
- ✅ Se met à jour automatiquement
- ✅ Affiche un indicateur de connexion discret
- ✅ Propose un menu "À propos" avec les informations système

---

## 🛠 Installation du projet

### Prérequis
- Node.js 16+
- npm 8+
- Un navigateur supportant les PWA (Chrome, Edge, Firefox, etc.)

### Setup
```bash
cd c:\Projets\PDLHI-Rapport
npm install
```

---

## 🚀 Démarrage du projet

### Mode développement
```bash
npm run dev
# Accès: http://localhost:5173
```

### Build production
```bash
npm run build
# Génère: dist/
```

### Preview de la build
```bash
npm run preview
# Accès: http://localhost:4173
```

### Lint
```bash
npm run lint
```

---

## 📦 Build production pour PWA

La build est optimisée pour PWA:

```bash
npm run build
```

**Résultat:**
- `dist/` - Dossier de production
- `dist/sw.js` - Service Worker (généré par Workbox)
- `dist/manifest.webmanifest` - Manifest PWA
- `dist/index.html` - Page d'accueil
- `dist/assets/` - Ressources compilées

**Pré-cachés automatiquement (14 fichiers):**
- Fichiers HTML, CSS, JS
- Icônes et favicons
- Logos de l'application
- Manifest

---

## 🌐 Déploiement

### Prérequis pour PWA
La PWA **DOIT** être servie en **HTTPS** pour fonctionner!

### Options de déploiement

#### Option 1: Firebase Hosting
```bash
npm install -g firebase-tools
firebase init
firebase deploy
```

#### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option 3: Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Option 4: Serveur Apache/Nginx
Copier le contenu de `dist/` sur le serveur web avec HTTPS.

**Headers recommandés pour Nginx:**
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /path/to/dist;
        try_files $uri /index.html;
        
        # Cache busting pour sw.js
        location = /sw.js {
            add_header Cache-Control "max-age=0, no-cache, must-revalidate";
        }
        
        # Cache permanent pour assets
        location /assets/ {
            add_header Cache-Control "max-age=31536000, immutable";
        }
    }
}
```

---

## 📱 Installation sur Android

### Depuis Chrome

1. **Ouvrir l'application dans Chrome**
   - Aller à: `https://votre-domaine.com/`

2. **Menu "Ajouter à l'écran d'accueil"**
   - Appuyer sur ⋮ (menu)
   - Sélectionner "Ajouter à l'écran d'accueil"
   - Confirmer et attendre l'installation

3. **Utilisation**
   - L'application s'ouvre en plein écran
   - Aucune barre d'adresse
   - Icône personnalisée sur l'écran d'accueil
   - Fonctionne hors ligne

### Depuis Firefox

1. **Ouvrir dans Firefox**
   - Aller à: `https://votre-domaine.com/`

2. **Menu et installation**
   - Appuyer sur ⋮ (menu)
   - Sélectionner "Installer l'application"
   - Confirmer

3. **Utilisation**
   - Apparaît dans la liste des applications
   - Peut être lancée depuis l'app drawer

---

## 🔒 Fonctionnalités hors ligne

### Après une première ouverture avec Internet

Toutes les fonctionnalités de l'application sont disponibles sans connexion:

#### Création de rapport
- Saisir les informations générales
- Ajouter des désordres
- Accéder au référentiel complet
- Prendre des photographies

#### Gestion des photographies
- Capturer via la caméra de l'appareil
- Stocker jusqu'à 3 photos par désordre
- Supprimer les photos

#### Enregistrement et export
- Enregistrer le rapport en `.pdlhi`
- Générer un PDF complet
- Télécharger les fichiers

#### Navigation
- Accès complet au menu
- Dialogue "À propos" avec infos système
- Indicateur de connexion (🟢 / ⚪)

### Données persistantes
- Rapports actifs: SessionStorage (temporaire)
- Archives téléchargées: Stockage local de l'appareil
- Photos: Mémoire application
- Référentiel: Pré-cachés par le Service Worker

---

## 🔄 Mises à jour

### Détection automatique
Le Service Worker vérifie les mises à jour:
- Automatiquement au démarrage
- Toutes les heures
- Ne jamais pendant un rapport en cours

### Notification de mise à jour
- Message discret au bas de l'écran
- Boutons: "Mettre à jour" / "Plus tard"
- Mise à jour: Recharge la page avec la nouvelle version
- Plus tard: Rejette la notification temporairement

### Après mise à jour
L'application est rechargée avec la dernière version sans perdre l'état.

---

## 🟢 Indicateur de connexion

### Affichage
- **Position:** Barre d'application
- **🟢 En ligne:** Connecté à Internet
- **⚪ Hors ligne:** Sans connexion

### Détection
- Automatique via événements `online` / `offline`
- Mis à jour en temps réel
- Peut être utilisé pour adapter le comportement

---

## ℹ️ Dialogue "À propos"

### Accès
- Appuyer sur ⋮ (menu) dans la barre d'application
- Sélectionner "À propos"

### Informations affichées

**Versions:**
- Version Application: 0.0.1
- Version Format .pdlhi: 1.0

**Système:**
- Date du build
- État du Service Worker (Actif/Inactif)
- Mode (PWA installée/Navigateur)

---

## 📊 Architecture PWA

### Fichiers clés

```
dist/
├── sw.js                      # Service Worker (Workbox)
├── manifest.webmanifest       # Manifest PWA
├── index.html                 # HTML d'entrée
├── pwa-192x192.png           # Icône 192x192
├── pwa-512x512.png           # Icône 512x512
├── favicon.svg               # Favicon
└── assets/                    # Ressources compilées
    ├── index-*.js
    ├── index-*.css
    └── logos/
```

### Stratégies de cache

**Précache (14 fichiers):**
- HTML, CSS, JavaScript
- Icônes et favicon
- Logos et images statiques
- Manifest

**Cache-First (CacheFirst):**
- Polices Google Fonts
- Polices Google Static

**Not Cached:**
- Données utilisateur (sessionStorage)
- Archives utilisateur (Blob direct)
- Photos (mémoire application)

---

## 🧪 Tester localement

### Sans HTTPS (développement)
```bash
npm run dev
# http://localhost:5173 (PWA désactivée, service worker fonctionnel)
```

### Avec HTTPS (production-like)
```bash
npm run build
npm run preview
# http://localhost:4173 (PWA fonctionnelle)
# Note: HTTPS requis en production
```

### Simulation mode offline

1. Ouvrir DevTools (F12)
2. Aller dans "Application" → "Service Workers"
3. Cocher "Offline"
4. L'application fonctionne en mode hors ligne

---

## 🐛 Dépannage

### Le Service Worker ne s'installe pas
**Cause:** Pas en HTTPS  
**Solution:** Déployer en HTTPS

### "Ajouter à l'écran d'accueil" n'apparaît pas
**Cause 1:** Service Worker non actif  
**Solution 1:** Vérifier DevTools → Application → Service Workers

**Cause 2:** Manifest invalide  
**Solution 2:** Vérifier DevTools → Application → Manifest (Green checkmark)

### Les photos ne sont pas sauvegardées
**Cause:** Pas de permission caméra  
**Solution:** Vérifier les permissions du navigateur sur l'appareil

### La mise à jour ne s'installe pas
**Cause:** Un rapport est en cours  
**Solution:** Clore le rapport avant de mettre à jour

---

## 📝 Logs et débogage

### Console du navigateur
```javascript
// Vérifier l'état du Service Worker
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations))

// Écouter les événements online/offline
window.addEventListener('online', () => console.log('En ligne'))
window.addEventListener('offline', () => console.log('Hors ligne'))
```

### DevTools
1. **Application → Service Workers:** État du SW
2. **Application → Cache Storage:** Contenu du cache
3. **Application → Manifest:** Manifest PWA
4. **Storage → SessionStorage:** Données temporaires
5. **Network → Service Worker:** Interception requêtes

---

## ✅ Checklist de déploiement

- [ ] Build production: `npm run build`
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Vérifier `dist/sw.js` et `dist/manifest.webmanifest`
- [ ] Déployer en HTTPS
- [ ] Vérifier les headers Cache-Control
- [ ] Tester sur Android Chrome
- [ ] Vérifier "Ajouter à l'écran d'accueil"
- [ ] Tester hors ligne
- [ ] Vérifier l'indicateur de connexion
- [ ] Vérifier le menu "À propos"
- [ ] Vérifier les mises à jour

---

## 📞 Support et documentation

### Documentation PWA
- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google - Web App Manifest](https://web.dev/add-manifest/)
- [Google - Service Workers](https://web.dev/service-workers-cache-storage/)

### Outils de test
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web Vitals](https://web.dev/vitals/)

---

## 📄 Versions

- **Application:** 0.0.1
- **Format .pdlhi:** 1.0
- **Date de build:** 15 août 2026
- **Build:** Production PWA Ready

---

**L'application PDLHI Rapport est maintenant une PWA complète, prête pour le déploiement en production.**

🚀 Bon déploiement !

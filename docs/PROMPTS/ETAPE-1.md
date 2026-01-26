# PROMPT CODEX — FC Manager Pro — ÉTAPE 1
## Sujet
Remplacer l’initialisation Supabase par Firebase (Firestore + Auth), configurer les variables d’environnement, et nettoyer les références Supabase pour que le projet compile et démarre.

## Contexte projet
Repo: https://github.com/MMD34/fc-manager-pro.git (branche main)
Stack: React + TypeScript + Vite + Tailwind + Zustand + React Router.
Actuellement, le projet mentionne Supabase (docs + folder supabase/ + probable client supabase dans src/lib).

Décisions validées:
- Cloud Firestore
- Firebase Auth (email/password)
- Images repoussées (pas Storage maintenant)
- Budget côté client (pas Cloud Functions)

## Objectifs de l’étape (DoD)
1) Ajouter Firebase SDK dans les dépendances.
2) Créer un module d’initialisation Firebase TypeScript strict:
   - `src/lib/firebase.ts`
   - exporte: `firebaseApp`, `auth`, `db`
3) Ajouter un système d'env Vite propre:
   - `.env.example` avec `VITE_FIREBASE_*`
   - Vérification runtime: si une variable manque → throw avec message clair.
4) Retirer/neutraliser toute dépendance *runtime* Supabase:
   - le build doit passer
   - l’app doit démarrer (`npm run dev`) même si les features Supabase ne fonctionnent plus (on les rebranchera à l’étape Auth/CRUD).
5) Mettre à jour la documentation de setup:
   - remplacer les instructions Supabase par Firebase (au minimum README + guide/setup existant)
   - supprimer ou déprécier clairement `SUPABASE_SETUP_GUIDE.md` (le remplacer par `FIREBASE_SETUP_GUIDE.md`).

## Contraintes techniques
- TypeScript strict: pas de `any`.
- Vite: utiliser `import.meta.env`.
- Aucune intégration UI Auth dans cette étape.
- Ne pas ajouter Firebase Storage maintenant.
- Garder le code compilable et lint-friendly.
- Ne pas casser l’architecture du projet.

## Étapes détaillées à exécuter

### A) Analyse rapide du code existant
1) Chercher dans tout le repo:
   - imports `@supabase/supabase-js`
   - fichiers `supabase.ts`, `supabaseClient`, `createClient`, etc.
   - usage de `supabase.auth`, `.from()`, `.storage`, `.rpc`, etc.
2) Identifier le point d’entrée et l’endroit où le client supabase est importé/utilisé.

### B) Dépendances
1) Ajouter la dépendance `firebase` dans `package.json`.
2) Lancer/assurer compatibilité Vite/TS.

### C) Env vars
1) Créer `.env.example` à la racine avec:
   - `VITE_FIREBASE_API_KEY=`
   - `VITE_FIREBASE_AUTH_DOMAIN=`
   - `VITE_FIREBASE_PROJECT_ID=`
   - `VITE_FIREBASE_STORAGE_BUCKET=`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID=`
   - `VITE_FIREBASE_APP_ID=`
   (Même si Storage n’est pas utilisé, on garde la config standard Firebase.)
2) Ne pas committer de `.env.local`. Juste `.env.example`.

### D) Implémenter `src/lib/firebase.ts`
Créer `src/lib/firebase.ts` qui:
1) Lit et valide les variables d’environnement via une fonction:
   - `function getFirebaseEnv(): { apiKey: string; authDomain: string; projectId: string; storageBucket: string; messagingSenderId: string; appId: string }`
   - Si une variable est absente → `throw new Error("Missing VITE_FIREBASE_API_KEY ...")`
2) Initialise Firebase:
   - `initializeApp(firebaseConfig)`
3) Initialise:
   - `getAuth(firebaseApp)`
   - `getFirestore(firebaseApp)`
4) Exporte:
   - `export const firebaseApp = ...`
   - `export const auth = ...`
   - `export const db = ...`

### E) Neutraliser Supabase côté runtime
BUT: on ne refactor pas toute l’app maintenant, on veut juste que ça compile.
1) Si `src/lib/supabase.ts` existe:
   - Option 1 (préférée): le garder mais s’assurer qu’il n’est plus importé nulle part (remplacer les imports par `firebase.ts` si nécessaire).
   - Option 2: supprimer le fichier + corriger tous les imports.
2) Remplacer toute importation “centrale” utilisée par le reste du code:
   - ex: si des services importent `supabase` depuis `src/lib/supabase.ts`, alors créer des stubs temporaires qui évitent le crash OU refactor minimal pour que rien n’exécute des appels supabase au démarrage.
3) L’objectif: `npm run dev` démarre sans crash.

### F) Docs
1) Mettre à jour `README.md`:
   - Remplacer “Supabase” par “Firebase (Auth + Firestore)” dans la section Tech Stack.
2) Créer `FIREBASE_SETUP_GUIDE.md` (ou mettre à jour le guide principal existant) avec:
   - création projet Firebase
   - activer Auth Email/Password
   - créer Firestore
   - récupérer config Web
   - remplir `.env.local` (exemple basé sur `.env.example`)
3) Marquer `SUPABASE_SETUP_GUIDE.md` comme deprecated:
   - ajouter un bandeau en haut: “DEPRECATED — le projet utilise Firebase désormais”.

### G) Nettoyage
- Laisser le dossier `supabase/migrations` pour l’historique, mais s’assurer qu’il n’est plus mentionné comme requis dans le setup.

## Tests manuels (obligatoires avant commit)
1) `npm install`
2) `npm run dev` (pas d’erreur runtime à l’initialisation)
3) `npm run build` (build OK)
4) Vérifier qu’aucune clé secrète n’est committée.

## Sortie attendue
- Un commit qui contient:
  - ajout firebase dependency
  - `src/lib/firebase.ts`
  - `.env.example`
  - docs mises à jour (README + FIREBASE_SETUP_GUIDE + dépréciation supabase guide)
  - suppression/neutralisation supabase imports pour compilation OK

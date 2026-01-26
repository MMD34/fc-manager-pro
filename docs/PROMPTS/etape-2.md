# PROMPT CODEX — FC Manager Pro — ÉTAPE 2 (Auth Firebase complète)

## Objectif
Finaliser l’auth Firebase (email/password) de bout en bout :
- Sign up (création compte)
- Sign in (connexion)
- Sign out (déconnexion)
- persistance de session (onAuthStateChanged)
- routes protégées + redirections
- UI Login/Register propre (corriger le rendu "non stylé" observé)

## Contexte
Repo: https://github.com/MMD34/fc-manager-pro.git
Firebase est déjà initialisé (src/lib/firebase.ts) et le projet démarre sur une page Login.
Il existe probablement:
- un store Zustand authStore (déjà basculé Firebase au moins partiellement)
- des pages Login / Register
- un router (React Router v6)

## Definition of Done (DoD)
1) Je peux créer un compte avec email/password (Firebase Auth) depuis l’UI.
2) Je peux me connecter avec un compte existant.
3) Les erreurs sont affichées clairement (email invalide, mauvais mot de passe, email déjà utilisé, etc.).
4) La session est persistée (refresh page → reste connecté).
5) Routes protégées:
   - Si non connecté → accès dashboard/careers/etc redirige vers /login
   - Si connecté → /login et /register redirigent vers /dashboard (ou page d’accueil interne)
6) Bouton Logout visible quand connecté (dans navbar/header ou settings)
7) UI Login/Register propre (centrée, responsive, Tailwind/Components OK).
8) Tests: `npm run dev` OK, `npm run build` OK.

## Contraintes
- TypeScript strict, pas de `any`.
- Pas de Firestore CRUD dans cette étape (ça sera étape 3).
- On reste sur email/password uniquement.
- Ne pas introduire de dépendances lourdes inutiles.

## Travail demandé (pas à pas)

### A) Audit rapide
1) Localiser:
- src/lib/firebase.ts
- src/store/authStore.ts (ou équivalent)
- src/pages/Login.tsx et Register.tsx (ou routes)
- Router principal (src/App.tsx ou src/router/*)
- un composant layout/header/nav si présent

2) Repérer pourquoi l’UI Login est "non stylée":
- vérifier que Tailwind est bien importé (src/index.css ou src/main.tsx)
- vérifier que les classes Tailwind existent dans le JSX
- vérifier que le layout n’écrase pas le style (ex: CSS global)

### B) Auth store (Zustand) robuste
Mettre en place un store auth propre:
- state:
  - user: FirebaseUser | null
  - isLoading: boolean (initialisation session)
  - authError: string | null
- actions:
  - initAuthListener(): unsubscribe fn (appelée une seule fois au bootstrap)
  - signUp(email, password)
  - signIn(email, password)
  - signOut()

Règles:
- initAuthListener() utilise `onAuthStateChanged(auth, ...)`
- isLoading = true au départ, false quand le listener a déterminé l’état
- signIn/signUp set authError à null au départ, puis message humain si erreur
- mapper les erreurs Firebase (auth/invalid-email, auth/user-not-found, auth/wrong-password, auth/email-already-in-use, auth/weak-password, etc.)
- ne pas faire de console.log inutiles

### C) Routes protégées
1) Créer un composant `ProtectedRoute` (ex: src/components/auth/ProtectedRoute.tsx):
- Si authStore.isLoading → afficher un écran Loading simple
- Si user == null → Navigate to /login (avec state.from optionnel)
- Sinon → render children

2) Créer un `PublicOnlyRoute` (optionnel mais recommandé):
- Si user != null → Navigate to /dashboard
- Sinon → render children

3) Appliquer ces guards dans le router:
- /login, /register => PublicOnlyRoute
- /dashboard, /careers, etc => ProtectedRoute

### D) UI Login/Register (fix du style)
1) Réparer le layout:
- formulaire centré (max-w-md)
- Card / panel avec padding, border, shadow
- labels + inputs correctement espacés
- bouton principal stylé
- lien vers register/login

2) Gestion UX:
- disable bouton pendant submit
- afficher erreur sous le formulaire
- option “show password” (facultatif)
- après succès: redirect vers /dashboard (ou route principale protégée)

### E) Logout
Ajouter un bouton Logout visible quand connecté.
- Au minimum dans un header.
- Appelle authStore.signOut()
- Redirige vers /login après logout (ou laisser route guard s’en charger)

### F) Vérifications finales
- `npm run dev` : créer compte + login + refresh OK
- `npm run build` OK
- Aucun secret committé

## Fichiers attendus (indicatifs)
- src/store/authStore.ts (modifié)
- src/components/auth/ProtectedRoute.tsx (nouveau)
- src/components/auth/PublicOnlyRoute.tsx (nouveau, optionnel)
- src/pages/Login.tsx (modifié)
- src/pages/Register.tsx (modifié)
- Router (src/App.tsx / src/router/*) (modifié)
- Header/Nav (si existant) (modifié)

## Notes importantes
- Si l’app a déjà une structure de composants UI (Button/Input/Card), l’utiliser.
- Sinon, faire simple en Tailwind (pas besoin d’ajouter une lib).

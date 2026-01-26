# PROMPT CODEX — FC Manager Pro — ÉTAPE 4.3 (Fix build: supprimer Supabase des stores)

## Problème
`npm run build` échoue avec ~37 erreurs car plusieurs stores utilisent encore `supabase.from('...')`.
Le client supabase est désormais un stub => TS errors (Expected 0 arguments, unknown types).

## Objectif
Faire passer `npm run build` et préparer la migration Firestore.
- Migrer `careerStore` vers Firestore (minimal, mais fonctionnel).
- Désactiver proprement (stub) les autres stores encore Supabase: budgetStore, playerStore, transferStore, journalStore.
On les migrera ensuite étape par étape.

## DoD
1) `npm run build` passe.
2) `careerStore` utilise Firestore (db) et Auth (uid) pour CRUD minimal:
   - list careers de l’utilisateur
   - create career
   - delete career
   - setActiveCareer (au moins côté client)
3) Les autres stores n’ont plus d’appels supabase et compilent (même si fonctionnalités temporairement indisponibles).
4) Pas de `any`. Pas de `unknown` non maîtrisé. Les retours sont typés.

## Contraintes
- Structure Firestore: `users/{uid}/careers/{careerId}`
- Champs minimum pour Career:
  - id (string)
  - name (string)
  - club_name (string) ou clubName selon types existants (respecter le type Career déjà défini dans le projet)
  - created_at (timestamp/date)
  - updated_at (timestamp/date)
  - user_id (uid) si le type l’exige (sinon ignorer)
- Utiliser `serverTimestamp()` pour created/updated si possible.

## Étapes

### A) Inspecter les types existants
1) Localiser les types/interfaces: `Career`, `CreateCareerInput`, etc.
2) Ne pas casser les signatures utilisées par les pages.

### B) Implémenter `careerStore` Firestore
Dans `src/store/careerStore.ts`:
1) Importer:
- `db` depuis `src/lib/firebase`
- Firestore helpers: `collection`, `doc`, `getDocs`, `addDoc`, `deleteDoc`, `updateDoc`, `query`, `orderBy`, `serverTimestamp`
2) Récupérer `uid` depuis authStore (ou directement `auth.currentUser`, mais préférer authStore).
3) Fonctions:
- `loadCareers()`: getDocs sur `collection(db, "users", uid, "careers")`
- `createCareer(input)`: addDoc + retourner Career typé (avec id doc.id)
- `deleteCareer(id)`: deleteDoc
- `setActiveCareer(id)`: set state + optionnel localStorage
4) Gestion state:
- `loading`, `error` string | null
- `careers: Career[]`
- `activeCareer: Career | null`
5) Trier par createdAt desc (si possible) sinon ordre doc.

### C) Stub propres des autres stores (temporaire)
Pour `budgetStore.ts`, `playerStore.ts`, `transferStore.ts`, `journalStore.ts`:
1) Supprimer les appels supabase.
2) Garder les mêmes fonctions exportées mais:
- elles retournent des valeurs vides ou lèvent une erreur contrôlée:
  - ex: `throw new Error("Not implemented yet: migrated from Supabase to Firestore in next step")`
3) Les states doivent rester typés (tableaux vides, loading false).
4) IMPORTANT: ne pas casser l’import des pages existantes.

### D) Supprimer les imports supabase de ces stores
- plus aucun `import { supabase } ...`
- plus aucun `supabase.from(...)`

### E) Tests
1) `npm run build` doit passer.
2) `npm run dev`: login -> dashboard doit fonctionner.
- La liste de careers peut être vide.
- Le bouton "Create Career" peut ouvrir un modal/form existant: s’assurer que createCareer appelle le nouveau store Firestore.

## Notes
- Si le formulaire Create Career n’existe pas encore ou n’est pas branché, créer un flux minimal (prompt, modal simple) uniquement si nécessaire pour valider createCareer.
- On garde la logique UI existante le plus possible.

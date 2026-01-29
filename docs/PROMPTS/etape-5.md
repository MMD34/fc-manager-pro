# PROMPT CODEX — FC Manager Pro — ÉTAPE 5 (Careers CRUD Firestore complet)

## Objectif
Implémenter le CRUD complet des careers avec Firestore + gestion de carrière active persistée.

## Contexte
- Firebase Auth OK
- Firestore utilisé au moins minimalement
- UI components existants (Button/Input/Card/PageHeader/EmptyState/AppShell)
- Thème dark OK

## DoD (Definition of Done)
1) La page Careers affiche la liste des careers Firestore de l’utilisateur (uid).
2) Bouton "Create Career" ouvre un modal/form :
   - validation basique (nom requis, club requis si champ)
   - à la création, la career apparaît dans la liste
3) Chaque career a des actions:
   - "Open" / "Select" (devient active)
   - "Edit" (modal)
   - "Delete" (confirm)
4) Carrière active:
   - stockée dans le store + persistée dans localStorage
   - au refresh, elle est restaurée si elle existe toujours
   - si elle est supprimée, activeCareer devient null
5) Loading + erreurs UX:
   - skeleton simple ou loader
   - erreurs Firestore affichées (toast ou message)
6) `npm run build` passe.

## Contraintes
- Firestore path: `users/{uid}/careers/{careerId}`
- Sécurité: supposer que rules limiteront à request.auth.uid (pas à écrire ici)
- TypeScript strict, pas de any.

## Étapes

### A) Vérifier/adapter les types
1) Localiser les types Career/CreateCareerInput/UpdateCareerInput.
2) Harmoniser la convention de champs:
- Si le type utilise `club_name`, rester cohérent partout.
- Sinon préférer camelCase `clubName`.
3) Écrire des helpers de mapping Firestore -> Career (inclure id doc.id).

### B) Services Firestore (recommandé)
Créer `src/services/firestore/careers.ts` (ou équivalent) avec fonctions:
- `listCareers(uid): Promise<Career[]>`
- `createCareer(uid, input): Promise<Career>`
- `updateCareer(uid, id, patch): Promise<Career>`
- `deleteCareer(uid, id): Promise<void>`

Utiliser:
- `collection(db, "users", uid, "careers")`
- `doc(db, "users", uid, "careers", id)`
- `getDocs(query(...))`
- `addDoc`
- `updateDoc`
- `deleteDoc`
- `serverTimestamp`

### C) careerStore (Zustand)
Mettre à jour `src/store/careerStore.ts`:
State:
- careers: Career[]
- activeCareerId: string | null
- activeCareer: Career | null (dérivé ou stocké)
- loading: boolean
- error: string | null

Actions:
- `loadCareers()`
- `createCareer(input)`
- `updateCareer(id, patch)`
- `deleteCareer(id)`
- `setActiveCareer(id | null)`:
  - sauver dans localStorage key: `fc_active_career_id`
- `hydrateActiveCareer()` au chargement:
  - lire localStorage
  - une fois careers chargées, set activeCareer si match

Comportement:
- après createCareer: ajouter au début + setActiveCareer(newId)
- après deleteCareer:
  - retirer de la liste
  - si id == activeCareerId => setActiveCareer(null)

### D) UI Page Careers/Dashboard
Modifier la page careers (Dashboard.tsx ou Careers.tsx) :
1) Appeler `loadCareers()` au mount (si user présent)
2) Afficher:
- Si loading -> loader
- Si 0 -> EmptyState + bouton create
- Sinon -> grid de cards

3) Chaque Card:
- titre: career.name
- sous-titre: club
- badge "Active" si activeCareerId == id
- actions:
  - Primary: "Open"/"Select"
  - Secondary: "Edit"
  - Danger: "Delete"

4) Modals:
- `CreateCareerModal` (nouveau fichier dans `src/components/careers/`)
- `EditCareerModal`
- `ConfirmDialog` simple (ou window.confirm si pas de composant, mais idéalement composant)

Validation:
- utiliser `react-hook-form` + `zod` si déjà présent; sinon validation simple.

### E) Routing après sélection
Si l’app a une route "career details" (ex: /career/:id), alors:
- au click "Open": naviguer vers cette route
Sinon:
- rester sur dashboard et afficher un message "Active career set".

### F) Tests
1) `npm run dev`:
- Créer 2 careers -> elles apparaissent
- Sélectionner une -> badge Active
- Refresh -> active conservée
- Edit -> champ mis à jour
- Delete -> disparaît, active reset si supprimée
2) `npm run build` passe

## Livrables attendus
- Services Firestore careers (nouveau)
- careerStore complet
- UI modals + page careers
- Persistance activeCareer localStorage
- Build OK

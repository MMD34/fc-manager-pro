# PROMPT CODEX — FC Manager Pro — ÉTAPE 3 (Base UI / Styling Tailwind + Lucide)

## Objectif
Mettre en place une base de style solide (Tailwind + composants UI réutilisables) et corriger le problème de rendu "HTML brut" (styles non appliqués). Ensuite, appliquer ces styles à Login/Register et à la page Careers (My Careers).

## Contexte
Repo: https://github.com/MMD34/fc-manager-pro.git
Auth Firebase fonctionne.
Problème: les pages (Login/Careers) apparaissent non stylisées (typo style navigateur, layout brut).

## Definition of Done (DoD)
1) Tailwind est correctement configuré et chargé dans l’app :
   - les classes `bg-*`, `text-*`, `flex`, `p-*` ont un effet visible.
2) Un mini design system existe avec composants réutilisables :
   - `Button`
   - `Input`
   - `Card`
   - `Container`
   - `PageHeader`
   - `EmptyState`
3) Les pages Login, Register, Careers utilisent ces composants et sont visuellement propres.
4) `lucide-react` est installé et utilisé pour les icônes (ex: Plus, LogOut, User, Mail).
5) `npm run dev` OK et `npm run build` OK.

## Contraintes
- TypeScript strict, pas de `any`.
- Pas d’ajout de librairie UI lourde (pas de shadcn, pas de MUI).
- Utiliser Tailwind existant (ou le réparer si incomplet).
- Utiliser Lucide React pour les icônes.
- Garder la structure du projet cohérente.

## Plan de travail

### A) Diagnostiquer et réparer Tailwind
1) Vérifier qu’un fichier CSS global existe (ex: `src/index.css` ou `src/styles/globals.css`).
2) Vérifier qu’il contient bien les directives Tailwind :
   - `@tailwind base;`
   - `@tailwind components;`
   - `@tailwind utilities;`
3) Vérifier que ce CSS global est importé au point d’entrée (ex: `src/main.tsx`).
4) Vérifier `tailwind.config.*` :
   - `content: ["./index.html", "./src/**/*.{ts,tsx}"]`
5) Vérifier `postcss.config.*` si nécessaire (Vite + Tailwind standard).
6) Ajouter un test visuel simple dans App (ex: un `div` avec `bg-gray-900 text-white p-4`) puis le retirer après validation.

### B) Ajouter Lucide React
1) Installer `lucide-react` si absent.
2) Créer une convention d’utilisation des icônes (taille 18/20, className tailwind).

### C) Créer une base de styles (tokens)
1) Dans le CSS global, définir des styles généraux (optionnel mais recommandé) :
   - `body` : `bg-slate-50 text-slate-900` via Tailwind classes appliquées dans le layout root (pas en CSS brut)
2) Ajouter une petite config Tailwind (facultatif) :
   - couleurs de marque simples (primary)
   - border radius standard
   - shadow standard
Si le projet préfère rester minimal, ne pas sur-configurer.

### D) Créer des composants UI réutilisables
Créer un dossier du type `src/components/ui/` et y mettre :

1) `Button.tsx`
- variantes : `primary`, `secondary`, `ghost`
- tailles : `sm`, `md`
- support `isLoading` (spinner simple) + disabled
- className merge propre (utiliser une util `cn()` si déjà présente, sinon la créer).

2) `Input.tsx`
- label optionnel
- message d’erreur optionnel
- support `type`, `placeholder`, `autoComplete`

3) `Card.tsx`
- wrapper avec `bg-white border rounded-xl shadow-sm p-6`

4) `Container.tsx`
- `max-w-6xl mx-auto px-4`

5) `PageHeader.tsx`
- titre + sous-titre + actions (boutons à droite)

6) `EmptyState.tsx`
- icône + titre + description + action principale

### E) Layout global
1) Créer `src/components/layout/AppShell.tsx` :
- header simple (nom app à gauche)
- zone content
- bouton logout visible seulement si connecté (si déjà existant, réutiliser)
- utiliser `Container`
2) S’assurer que toutes les pages “internes” (après login) sont rendues dans ce layout.

### F) Appliquer le design system à 3 pages minimum
1) Login
- centré, carte, champs propres, bouton, lien register
- icône Mail/Lock facultatif

2) Register
- même style que Login

3) Careers (My Careers)
- utiliser `PageHeader` avec action “Create Career” + icône Plus
- zone centrale avec `EmptyState` si pas de carrière
- s’il y a une liste de carrières, afficher en cards (même simple)

### G) Tests
- `npm run dev` : vérifier visuellement que Tailwind s’applique partout.
- `npm run build` : doit passer.

## Livrables attendus
- Fix Tailwind (si import/config manquant)
- `lucide-react` installé
- `src/components/ui/*` ajoutés
- `src/components/layout/AppShell.tsx` (ou équivalent)
- Login/Register/Careers stylisés via les composants UI
- Build OK

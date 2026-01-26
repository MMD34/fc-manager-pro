# PROMPT CODEX — FC Manager Pro — ÉTAPE 4 (THEME v1 Dark/Glass/Gradient)

## Objectif
Mettre en place un thème global "dark / glass / gradient + glow" (style proche du 3e screenshot fourni par l’utilisateur), puis l’appliquer automatiquement aux pages existantes (Login/Register/Dashboard) via AppShell et les composants UI.

## Contexte
- Tailwind fonctionne et des composants UI existent déjà (Button/Input/Card/Container/PageHeader/EmptyState).
- AppShell est en place.
- Problème: l’UI reste trop "fond blanc/texte noir". Il faut un thème global cohérent.

## Definition of Done (DoD)
1) L’app a un fond global dark + gradient + glow visible (pas fond blanc).
2) Le texte global est clair (text-slate-100/200).
3) Les composants Card/Button/Input adoptent un style glass/dark.
4) Login/Register/Dashboard sont beaux sans changer leur structure.
5) `npm run dev` et `npm run build` OK.

## Contraintes
- Pas de librairie UI externe.
- Utiliser Tailwind.
- Garder TypeScript strict.
- Ne pas casser l’existant (routes/auth).

## Plan d’implémentation

### A) Ajouter un composant de Background global
1) Créer `src/components/layout/AppBackground.tsx` :
- wrapper qui rend un background:
  - `min-h-screen`
  - fond base: `bg-slate-950`
  - gradient: `bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950`
  - effets glow: 2-3 div absolute avec blur + opacity (ex: indigo/blue/emerald) en `pointer-events-none`
- Le composant doit accepter `children`.

Exemple de structure (à adapter):
- parent: `relative min-h-screen text-slate-100`
- background layer: `absolute inset-0 ...`
- content layer: `relative z-10`

2) Utiliser `AppBackground` au plus haut niveau:
- idéalement dans `AppShell` (et aussi pour Login/Register si elles ne passent pas par AppShell).
- Résultat: toutes les pages ont le même fond dark.

### B) Ajuster la typographie globale (sans CSS lourd)
1) Dans le layout root (AppBackground ou AppShell), appliquer:
- `text-slate-100`
- `antialiased`
- `selection:bg-indigo-500/30 selection:text-slate-100`

2) Si le body reste blanc, vérifier que rien ne force `bg-white` au root.
- Corriger en appliquant `className="bg-slate-950"` au container root.

### C) Thématiser les composants UI (réutilisables)
Mettre à jour les composants existants:

#### Card
- style glass:
  - `bg-white/5` ou `bg-slate-900/40`
  - `border border-white/10`
  - `backdrop-blur-xl`
  - `rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]`
- hover léger optionnel: `hover:border-white/15`

#### Button
- Primary:
  - fond accent: `bg-indigo-500/90 hover:bg-indigo-500`
  - texte: `text-white`
  - border léger: `border border-indigo-300/20`
  - shadow doux
- Secondary:
  - glass: `bg-white/5 hover:bg-white/10 border border-white/10`
- Ghost:
  - `hover:bg-white/5`

#### Input
- `bg-white/5 border border-white/10`
- focus:
  - `focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/40`
- placeholder: `placeholder:text-slate-400`

> IMPORTANT: garder l’API des composants identique pour ne pas casser les pages.

### D) AppShell (Header) style "glass"
1) Header:
- conteneur: `sticky top-0 z-20`
- barre: `bg-slate-950/40 backdrop-blur-xl border-b border-white/10`
- contenu: `Container` + alignements propres
- bouton logout "ghost" avec icône Lucide

2) Corriger le titre si besoin (ex: “FCFC Manager Pro” -> “FC Manager Pro” si c’est une erreur).

### E) Pages existantes: micro-ajustements
Sans refactor complet:
- Login/Register:
  - wrapper center: ok
  - vérifier que le parent n’a pas `bg-white`
  - Card doit maintenant être glass => rendu directement meilleur
- Dashboard/Careers:
  - PageHeader: titre en `text-slate-100`, sous-titre `text-slate-300`
  - EmptyState: icône en `text-slate-300`

### F) Vérifs
1) Lancer:
- `npm run dev` => le fond doit être dark + glow visible.
2) `npm run build` => OK.

## Livrables attendus
- Nouveau: `src/components/layout/AppBackground.tsx`
- Modifs: Card/Button/Input/AppShell (styles)
- Modifs minimales: Login/Register/Dashboard si nécessaire
- Build OK

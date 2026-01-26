# PROMPT CODEX — FC Manager Pro — ÉTAPE 4.2 (AppBackground visible mais fond toujours blanc)

## Problème
AppBackground est monté (banner THEME ACTIVE visible), mais le fond reste blanc à l’écran.
Donc le background n’est pas appliqué correctement (layer pas couvrant / z-index / un bg-white recouvre / wrapper pas full height).

## Objectif (DoD)
1) Fond dark/gradient visible sur TOUT l’écran (aucun blanc).
2) Le contenu est au-dessus du background (lisible).
3) Identifier et éliminer toute source de `bg-white`/texte noir au root.
4) Garder le banner temporairement jusqu’à confirmation visuelle, puis le retirer.

## Actions obligatoires

### A) Rendre le background impossible à rater (technique infaillible)
Modifier `AppBackground.tsx` :

1) Structure recommandée:
- wrapper: `className="min-h-screen bg-slate-950 text-slate-100 antialiased relative"`
- background layer: un div avec `className="fixed inset-0 -z-10"` (IMPORTANT: fixed + couvre tout)
  - dedans:
    - base: `bg-slate-950`
    - gradient: `bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950`
    - glows: 2-3 div `absolute` avec `blur-3xl opacity-20` (indigo/blue/emerald)
- content: `className="relative z-10 min-h-screen"` (IMPORTANT)

Exemple de glows (adapter):
- `absolute -top-24 left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl`
- `absolute top-40 right-10 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl`
- `absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl`

2) Le banner THEME ACTIVE doit rester pour l’instant (mais positionné en fixed avec style fuchsia comme demandé).

### B) Trouver qui force encore le blanc
1) Faire une recherche globale:
- `bg-white`
- `text-black`
- `background: white`
- `color: black`
- `prose`
2) Vérifier en priorité:
- AppShell / Layout / Sidebar / Topbar
- les pages Login/Register/Dashboard
- les wrappers root dans App.tsx et main.tsx

3) Corriger les wrappers root suspects:
- Remplacer `bg-white` par `bg-transparent` ou rien, et laisser AppBackground gérer le fond.
- Assurer que les containers principaux n’appliquent pas un fond opaque blanc.

### C) Correction du contenu (surfaces "glass")
Si nécessaire (sans tout refaire):
- AppShell main area: `bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl`
- éviter les grands conteneurs blancs.

### D) Validation locale
1) Lancer `npm run dev` :
- Vérifier: fond dark + gradient visible sur tout l’écran.
- Login doit être sur fond dark, pas blanc.
2) Quand c’est OK, supprimer le banner (Étape 4.3 ensuite).

## Livrables
- AppBackground corrigé avec background `fixed inset-0 -z-10`
- suppression/correction des `bg-white` qui recouvrent le fond
- thème visible sur Login/Register/Dashboard
- banner encore présent (on le retire après confirmation)

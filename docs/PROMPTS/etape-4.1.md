# PROMPT CODEX — FC Manager Pro — ÉTAPE 4.1 (Debug Theme non visible)

## Problème
Le thème dark/glass/gradient est censé être appliqué (AppBackground + composants), mais à l’écran l’app reste fond blanc / texte noir (aucun effet visible).

## Objectif
Trouver et corriger la raison POURQUOI le thème n’apparaît pas.
Je veux une preuve visuelle immédiate en dev, puis une correction durable.

## DoD (Definition of Done)
1) En lançant `npm run dev`, on voit clairement un fond dark/gradient (impossible de le rater).
2) Login/Register/Dashboard héritent du fond dark (pas blanc).
3) Aucun style global ne force `body { background: white; color: black; }`.
4) `npm run build` passe.

## Étapes obligatoires

### A) Ajouter un "Theme Debug Banner" (preuve)
1) Dans le composant racine qui est censé envelopper l’app (AppBackground OU AppShell OU App.tsx),
ajouter temporairement un bandeau très visible en haut à gauche :

- texte : "THEME ACTIVE"
- style tailwind très agressif : `fixed top-2 left-2 z-[9999] bg-fuchsia-600 text-white px-3 py-2 rounded-xl shadow-lg`

2) Relancer dev et vérifier qu’il apparaît.
- Si le banner n’apparaît pas, alors le fichier modifié n’est pas réellement utilisé par l’app (mauvais composant branché / mauvais import / route différente).

### B) Vérifier le montage réel de AppBackground
1) Rechercher dans le repo :
- où AppBackground est importé
- où AppShell est utilisé
- comment les routes sont organisées (Layout.tsx, App.tsx, router)

2) Corriger pour garantir que TOUTES les pages passent par AppBackground :
- Option recommandée : envelopper le Router entier dans AppBackground au plus haut niveau (souvent `App.tsx`).
  Exemple (adapter à ton code) :
  <AppBackground>
    <RouterProvider ... />
  </AppBackground>

- et non seulement dans AppShell, car Login/Register peuvent être hors shell.

3) Vérifier aussi que les pages internes passent bien dans AppShell (si prévu).

### C) Trouver l’override fond blanc / texte noir
1) Vérifier `src/index.css` (ou fichier global):
- chercher `body { background: ... }` ou `color: ...`
- chercher classes type `.App { background: white }`
- chercher un reset CSS qui remet fond blanc

2) Vérifier `src/main.tsx` :
- que le CSS global est bien importé UNE fois
- qu’on n’importe pas un autre CSS qui écrase

3) Vérifier les composants layout/pages :
- rechercher `bg-white`, `text-black`, `prose` etc.
- s’assurer que le root container a `className="min-h-screen bg-slate-950 text-slate-100"`

### D) Correction durable (appliquer le thème au root)
Une fois le problème trouvé :
1) Assurer que le root wrapper impose :
- `min-h-screen bg-slate-950 text-slate-100 antialiased`
2) Assurer que le background layer est présent :
- `absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950`
- 2-3 "glow blobs" en `absolute blur-3xl opacity-25` (indigo/blue/emerald)
3) S’assurer que le contenu est au-dessus :
- `relative z-10`

### E) Retirer le Debug Banner (important)
Après validation, supprimer le "THEME ACTIVE" banner.

### F) Tests
1) `npm run dev` : confirmer fond dark visible + pages OK
2) `npm run build` : doit passer

## Livrables
- Fix du montage AppBackground au niveau root (App.tsx ou équivalent)
- Suppression des overrides fond blanc si présents
- Theme visible sur Login/Register/Dashboard
- Debug banner supprimé après confirmation visuelle

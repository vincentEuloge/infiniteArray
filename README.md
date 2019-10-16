# infiniteArray
L'application montre comment afficher un tableau de dimension (presque) infinie tout en conservant de bonne performance de rafraîchissement.

Et accessoirement permet aussi de tester la performance des librairies de construction d'interface.

Cette app est accessible ici : https://infinite-array.herokuapp.com/

## Stratégie utilisée

Source d'inspiration [SlickGrid](https://github.com/mleibman/SlickGrid) :
  - Un élément du DOM aux dimensions réels du tableau de données afin de profiter du comportement natif des scrollbars, mais seules les LIGNES visibles sont construites et placées a des coordonnée Y calculées à partir de l'index de la ligne et la hauteur d'une cellule.

J'ai reproduit cette technique, mais je l'ai étendu aux colonnes, ainsi seules les cellules visibles sont construites dans le DOM. Elles sont placées à des coordonnées X Y selon les index ligne/colonne et hauteur/largeur d'une cellule.

L'utilisation du scroll de la part de l'utilisateur, ou le redimensionnement de la fenêtre, déclencheront une requête de la vue (front) vers le "model" (back) afin d'obtenir une nouvelle portion de tableau.

L'application est concentrée dans deux fichiers :
 - src/App.svelte => la vue
 - src/main.js => le fournisseur de données

## Probléme de la stratégie utilisée

Un élément du dom ne peut avoir une taille infinie (cf [stackoverflow](https://stackoverflow.com/questions/16637530/whats-the-maximum-pixel-value-of-css-width-and-height-properties)).
Par conséquent, on ne pourra pas afficher un tableau réellement infinie, ici il est de 1 000 000 de lignes par 200 000 colonnes)

Idéalement il faudrait envoyer entre le back et le front uniquement les cellules qui ne sont pas déjà visibles, pas soucis de simplicité, ici, je renvois toute la portion de tableau visible (mais ça me permet de tester les performances de la librairie de construction de l'interface (svelte))

## Autres Techniques envisagées

  - Développer ces propres scrollbar permettrait d'avoir un élément du dom au même dimension que ce qui est visible, cela permettra de jouer avec un tableau de dimension réellement infinie. Dans ce cas il faudra déplacé chaque cellule en cohérence, il faudra aussi détruire les cellules qui ne sont plus visible à l'écran.
  - Dessiner l'ensemble en canvas/webGL, les performances seraient surement meilleur mais on perdrait tout l'avantage des éléments HTML existant (input, checkbox, ...)
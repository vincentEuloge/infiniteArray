<script>
    import { createEventDispatcher, onMount  } from "svelte";
    import { throttle } from "lodash-es"

    // le tableau qu'on désire afficher
    export let showedTable;
    // le nombre réel de ligne du tableau, permet de générer un conteneur à la taille adéquat
    export let maxRows;
    // le nombre réel de colonne du tableau, permet de générer un conteneur à la taille adéquat
    export let maxColumns;

    const request = createEventDispatcher();

    const WANTED_FPS = 30;

    // pour ne pas surcharger le process on throttle la mise à jour du tableau
    const throttleRequestOfNewArray = throttle(requestNewArray, 1000/WANTED_FPS);

    // variable qui pointera vers une cellule (la dernière ajouté au dom)
    // ceci permettra d'obtenir programmatiquement les dimension de la cellule
    let cellDomElement;

    // la largeur et la hauteur d'une cellule, sera utile pour calculer la portion de tableau nécessaire
    // sera initialisé au même moment que le composant (onMount)
    let cellHeight;
    let cellWidth;

    // on stock les valeurs de scroll, elles seront nécessaire lors du resize du browser
    // pour calculer la nouvelle portion de tableau que l'on désire
    let scrollTop = 0;
    let scrollLeft = 0;

    onMount(() => {
        cellWidth = cellDomElement.offsetWidth;
        cellHeight = cellDomElement.offsetHeight;
        setTimeout(() => throttleRequestOfNewArray(), 100);
    })
    // si l'utilisateur fait varier la taille de son browser on désire que la portion de tableau affiché reste correct
    window.addEventListener("resize", throttleRequestOfNewArray);

    function onScroll(){
        scrollTop = this.scrollTop;
        scrollLeft = this.scrollLeft;
        throttleRequestOfNewArray();
    }

    // sur un resize du browser, ou un scroll de l'utilisateur, on veut afficher la partie visible du tableau et uniquement celle ci
    // via un simple calcul faisant intervenir la position de la scrollbar et la taille total de la fenêtre on est
    // capable de demander la portion du tableau qui est censé être visible
    function requestNewArray(){
        request(
            "updateArray",
            {
                startRow:Math.floor(scrollTop/cellHeight),
                nbRow: Math.ceil(window.innerHeight / cellHeight),
                startColumn: Math.floor(scrollLeft/cellWidth),
                nbColumn: Math.ceil(window.innerWidth / cellWidth)
            }
        );
    }
</script>

<style>
    div {
        overflow: scroll;
        background-color: gold;
        position: relative;
        height: 100%;
        width: 100%;
    }
    table{
        border-collapse: collapse;
    }
    .tenth {
        background-color: gainsboro;
    }
    td {
        position: absolute;
        max-width: 150px;
        min-width: 150px;
        max-height: 21px;
        min-height: 21px;
        border: 1px solid black;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>

<div on:scroll={onScroll}>
    <!-- le tableau DOM aura les dimension réel du tableau de donnée
         et ceci afin de profiter de la fonctionnalité native de la scrollbar -->
    <table style="height: {maxRows*cellHeight}px; width: {maxColumns*cellWidth}px">
        {#each showedTable as  {realRowIndex, rowContent}, rowIndex (realRowIndex)}
            <tr>
                {#each rowContent as {realColumnIndex, cellContent}, cellIndex (realColumnIndex)}
                    <td 
                        bind:this={cellDomElement}
                        style="top: {realRowIndex*cellHeight}px; left: {realColumnIndex*cellWidth}px"
                        class:tenth={realColumnIndex % 10 === 0 || realRowIndex % 10 === 0}
                        title={cellContent}>
                        {cellContent}
                    </td>
                {/each}
            </tr>
        {/each}
    </table>
</div>

import App from './App.svelte';

// Inutile d'utiliser des valeurs pharaoniques, car on va être limité par les dimensions maximal d'un élément html
// https://stackoverflow.com/questions/16637530/whats-the-maximum-pixel-value-of-css-width-and-height-properties
const MAX_ROWS = 1000000;
const MAX_COLUMNS = 200000;

// init de notre composant, on le fait avec un tableau d'un élément, cela permettra à ce dernier de calculer la taille d'une cellule
const app = new App({
    target: document.body,
    props: {
        maxRows: MAX_ROWS,
        maxColumns: MAX_COLUMNS,
        showedTable: generateArray(0, 1, 0, 1)
    }
});

export default app;

// le composant déclenchera un événement lors de l'init, d'un resize de la fenêtre ou d'un scroll
app.$on("updateArray", ({detail: {startRow, nbRow, startColumn, nbColumn}}) => {
    app.$set({ 
        showedTable: generateArray(startRow, nbRow, startColumn, nbColumn)
    });
});

// Pour avoir un impact mémoire minimal on génère un tableau à la volé
// Cela donnera l'illusion d'avoir un tableau aux dimensions MAX_ROWS/MAX_COLUMNS
function generateArray(startRow = 0, nbRow = 0, startColumn = 0, nbColumn = 0){
    startRow = Math.min(startRow, MAX_ROWS - nbRow);
    startColumn = Math.min(startColumn, MAX_COLUMNS - nbColumn);

    const arrayToGenerate = [];

    for (let rowNumber = 0; rowNumber < nbRow; rowNumber++){
        const realRowIndex = startRow + rowNumber

        const aRow = {
            realRowIndex,
            rowContent: []
        };

        for (let columnIndex = 0; columnIndex < nbColumn; columnIndex++){
            const realColumnIndex = startColumn + columnIndex;

            aRow.rowContent[columnIndex] = {
                realColumnIndex,
                cellContent: `row-${realRowIndex}:column-${realColumnIndex}`
            }
        }

        arrayToGenerate[rowNumber] = aRow
    }

    return arrayToGenerate;
}
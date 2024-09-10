let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
]

let currentPlayer = 'circle';

function init(){
    render();
}

function render() {
    // Starte mit dem Aufbau des Tabellen-HTMLs
    let tableHTML = '<table>';

    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            let fieldIndex = i * 3 + j; // Berechnet den Index im Array
            let field = fields[fieldIndex]; // Erhalte den Wert aus dem Array
            let content = '';

            if (field === 'circle') {
                content = generateSvgCircle();
            } else if (field === 'cross') {
                content = generateSvgCross();
            }

            // Füge das td-Element mit dem onclick-Attribut hinzu
            tableHTML += `<td onclick="handleClick(${fieldIndex}, this)">${content}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    // Setze das generierte HTML in das div mit der id="content"
    document.getElementById('content').innerHTML = tableHTML;
}

// Funktion, die bei einem Klick auf ein Feld ausgeführt wird
function handleClick(index, element) {
    // Überprüfen, ob das Feld schon belegt ist
    if (fields[index] !== null) {
        return; // Falls das Feld belegt ist, nichts tun
    }

    // Setze den aktuellen Spieler in das Array fields
    fields[index] = currentPlayer;

    // Füge das SVG entsprechend dem aktuellen Spieler in das td ein
    if (currentPlayer === 'circle') {
        element.innerHTML = generateSvgCircle();
        currentPlayer = 'cross'; // Wechsle zum nächsten Spieler
    } else {
        element.innerHTML = generateSvgCross();
        currentPlayer = 'circle'; // Wechsle zum nächsten Spieler
    }

    // Entferne das onclick-Attribut, um weitere Klicks zu verhindern
    element.onclick = null;
}

function generateSvgCircle() {
    // Erzeuge das SVG mit einem animierten Kreis
    return `
        <svg width="70" height="70" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="30" stroke="#00B0EF" stroke-width="5" fill="none"
                stroke-dasharray="188.4" stroke-dashoffset="188.4">
                <animate attributeName="stroke-dashoffset" from="188.4" to="0" dur="500ms" fill="freeze" />
            </circle>
        </svg>
    `;
}

function generateSvgCross() {
    return `
    <svg width="70" height="70" viewBox="0 0 70 70">
        
        <line x1="10" y1="10" x2="10" y2="10" stroke="#FFC000" stroke-width="5" stroke-linecap="round">
            <animate attributeName="x2" from="10" to="60" dur="250ms" fill="freeze" />
            <animate attributeName="y2" from="10" to="60" dur="250ms" fill="freeze" />
        </line>

        
        <line x1="60" y1="10" x2="60" y2="10" stroke="#FFC000" stroke-width="5" stroke-linecap="round">
            <animate attributeName="x2" from="60" to="10" begin="250ms" dur="250ms" fill="freeze" />
            <animate attributeName="y2" from="10" to="60" begin="250ms" dur="250ms" fill="freeze" />
        </line>
    </svg>
`;
}

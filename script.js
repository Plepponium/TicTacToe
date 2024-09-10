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
    } else {
        element.innerHTML = generateSvgCross();
    }

    // Entferne das onclick-Attribut, um weitere Klicks zu verhindern
    element.onclick = null;

     // Speichere den aktuellen Spieler, bevor der Wechsel erfolgt
     const winningPlayer = currentPlayer;

     // Wechsle zum nächsten Spieler
     currentPlayer = (currentPlayer === 'circle') ? 'cross' : 'circle';
 
     let result = checkGameStatus();
     if (result) {
         drawWinningLine(result, winningPlayer);
     }
}

function checkGameStatus() {
    const winningCombos = [
        [0, 1, 2], // Erste Reihe
        [3, 4, 5], // Zweite Reihe
        [6, 7, 8], // Dritte Reihe
        [0, 3, 6], // Erste Spalte
        [1, 4, 7], // Zweite Spalte
        [2, 5, 8], // Dritte Spalte
        [0, 4, 8], // Erste Diagonale
        [2, 4, 6]  // Zweite Diagonale
    ];

    for (const [a, b, c] of winningCombos) {
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return [a, b, c]; // Rückgabe der gewonnenen Felder
        }
    }

    return null; // Kein Ergebnis
}

function drawWinningLine(winningCombo, winner) {
    if (winningCombo) {
        // Um das gewonnene Tabellenfeld zu markieren
        const cells = document.querySelectorAll('#content table td');
        winningCombo.forEach(index => {
            cells[index].style.backgroundColor = '#FFFFFF';
            cells[index].style.borderRadius = '0'; // Setze die Hintergrundfarbe auf Weiß
        });

        // Erstelle ein Container für das Gewinnerbild und die Krone
        const container = document.createElement('div');
        container.classList.add('winner-container');
        container.style.position = 'absolute';
        container.style.top = '250px'; // Abstand von oben, um die Tabelle nicht zu verschieben
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.textAlign = 'center';
        container.style.zIndex = '1000'; // Damit die Krone über anderen Inhalten liegt
        
         // Erstelle das SVG für den Gewinner
         let winnerSvg;
         if (winner === 'circle') {
             winnerSvg = generateSvgCircle();
         } else if (winner === 'cross') {
             winnerSvg = generateSvgCross();
         }
        
          // Füge das Gewinner-SVG und die Krone in den Container ein
          container.innerHTML = `
          <div style="position: relative; display: inline-block;">
              ${winnerSvg}
              <img src="./img/krone.png" alt="Krone" style="position: absolute; top: -48px; left: 3px; width: 64px; height: 64px;">
          </div>
      `;

        // Füge den Container nach der h1 und vor dem #content div hinzu
        const h1 = document.querySelector('h1');
        const contentDiv = document.getElementById('content');
        document.body.insertBefore(container, contentDiv);

        // Verhindere weitere Klicks
        const allCells = document.querySelectorAll('#content table td');
        allCells.forEach(cell => {
            cell.onclick = null;
        });
    }
}

function restartGame(){
    const winnerContainer = document.querySelector('.winner-container');
    if (winnerContainer) {
        winnerContainer.remove();
    }

    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    currentPlayer = 'circle';

    render();
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

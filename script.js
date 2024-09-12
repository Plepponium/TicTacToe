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
    updatePlayerInfoBackground()
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
 
     updatePlayerInfoBackground();

     let result = checkGameStatus();
     if (result) {
         drawWinningLine(result, winningPlayer);
     } else {
        checkForDraw(); // Unentschieden überprüfen, falls es keinen Gewinner gibt
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

        // Verhindere weitere Klicks
        const allCells = document.querySelectorAll('#content table td');
        allCells.forEach(cell => {
            cell.onclick = null;
        });
        updateScore(winner);
    }
}

function checkForDraw() {
    // Prüfen, ob alle Felder ausgefüllt sind
    const allFilled = fields.every(field => field !== null);

    // Wenn alle Felder belegt sind und keine Gewinner-Kombination, dann ist es ein Unentschieden
    if (allFilled) {
        setTimeout(() => {
            alert("Unentschieden! Das Spiel wird neu gestartet.");
            restartGame(); // Spiel neustarten
        }, 500); // Kurze Verzögerung für die Benutzererfahrung
    }
}

function updateScore(winner) {
    let scoreElement;
    let svgContainer;
    let crown;

    if (winner === 'circle') {
        scoreElement = document.getElementById('circle-score');
        svgContainer = document.querySelector('#playerinfo .player svg'); // SVG für Circle
    } else if (winner === 'cross') {
        scoreElement = document.getElementById('cross-score');
        svgContainer = document.querySelector('#playerinfo .player:nth-of-type(2) svg'); // SVG für Cross
    }

    // Erhöhe den Score und aktualisiere den Inhalt
    let score = parseInt(scoreElement.innerHTML);
    scoreElement.innerHTML = score + 1;

    // Erstelle das "+1"-Element
    const plusOne = document.createElement('span');
    plusOne.innerHTML = '+1';
    plusOne.classList.add('plus-one-animation');
    
    // Füge das Element neben dem Score ein
    scoreElement.parentElement.appendChild(plusOne);

    // Entferne das "+1"-Element nach der Animation
    setTimeout(() => {
        plusOne.remove();
    }, 1000);

    // Füge die Krone hinzu, wenn der Spieler 3 Punkte erreicht
    if (score + 1 === 3) {
        crown = document.createElement('img');
        crown.src = './img/krone.png';
        crown.alt = 'Krone';
        crown.style.position = 'absolute';
        crown.style.top = '-50px'; // Position der Krone über dem Punktestand
        crown.style.width = '64px';
        crown.style.height = '64px';

        // Füge die Krone relativ zum entsprechenden SVG hinzu
        svgContainer.style.position = 'relative'; // Stelle sicher, dass das SVG relativ positioniert ist
        svgContainer.parentElement.style.position = 'relative'; // Stelle sicher, dass der Container relativ positioniert ist
        svgContainer.parentElement.appendChild(crown);

        // Spiele den Gewinner-Sound ab
        const winnerAudio = new Audio('./audio/winner.mp3');
        winnerAudio.play();

        // Deaktiviere weitere Klicks
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

function updatePlayerInfoBackground() {
    const playerInfo = document.getElementById('playerinfo');
    const circlePlayer = playerInfo.querySelector('.player:first-of-type svg');
    const crossPlayer = playerInfo.querySelector('.player:nth-of-type(2) svg');
    
    // Füge die Hintergrundfarbe basierend auf dem aktuellen Spieler hinzu
    if (currentPlayer === 'circle') {
        circlePlayer.classList.add('player-circle');
        crossPlayer.classList.remove('player-cross');
        
    } else {
        crossPlayer.classList.add('player-cross');
        circlePlayer.classList.remove('player-circle');
    }
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

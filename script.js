let secretCode = generateSecretCode();
let currentRow = 0;

function generateSecretCode() {
    const colors = {
        0:'red', 
        1:'blue', 
        2:'green', 
        3:'yellow'
    };
    
    const colorsSelected=[];
    
    for (let i = 0; i < Object.keys(colors).length; i++) {
        colorsSelected.push(colors[Math.floor(Math.random() * Object.keys(colors).length)]);
    }
    console.log(colorsSelected);

    return colorsSelected;
}


function createBoard() {

    const board = document.querySelector('.board');
    board.innerHTML = '';

    for (let i = 0; i < 10; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.dataset.row = i;

        for (let j = 0; j < 4; j++) {
            const ball = document.createElement('div');
            ball.classList.add('ball');
            ball.dataset.row = i;
            ball.dataset.col = j;
            row.appendChild(ball);
        }

        const feedback = document.createElement('div');
        feedback.classList.add('feedback');
        for (let k = 0; k < 4; k++) {
            const feedbackBall = document.createElement('div');
            feedbackBall.classList.add('feedback-ball');
            feedback.appendChild(feedbackBall);
        }

        row.appendChild(feedback);
        board.appendChild(row);
    }
}


function checkGuess() {

    const colorReference = {
        'rgb(255, 0, 0)':'red',
        'rgb(0, 0, 255)':'blue',
        'rgb(0, 128, 0)':'green',
        'rgb(255, 255, 0)':'yellow'
    }

    //array.from transforma o nodelist em um array
    const currentBalls = Array.from(document.querySelectorAll(`.ball[data-row="${currentRow}"]`));
    const guess = currentBalls.map(ball => ball.style.backgroundColor);

    let exactMatches = 0;
    let colorMatches = 0;

    const secretCodeCopy = [...secretCode];
    const guessCopy = [...guess];

    for (let i = 0; i < 4; i++) {
        if (colorReference[guessCopy[i]] === secretCodeCopy[i]) {
            exactMatches++;
            secretCodeCopy[i] = null;
            guessCopy[i] = null;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (guessCopy[i] !== null) {
            const color = colorReference[guessCopy[i]];
            if (secretCodeCopy.includes(color)) {
                colorMatches++;
                secretCodeCopy[secretCodeCopy.indexOf(color)] = null;
            }
        }
    }

    const feedbackBalls = document.querySelectorAll(`.row[data-row="${currentRow}"] .feedback-ball`);
    let ballIndex = 0;

    for (let i = 0; i < exactMatches; i++) {
        feedbackBalls[ballIndex++].style.backgroundColor = 'black';
    }

    for (let i = 0; i < colorMatches; i++) {
        feedbackBalls[ballIndex++].style.backgroundColor = 'yellow';
    }

    currentRow++;
    checkRowComplete();

    const message = document.querySelector('.message');
    if (exactMatches === 4) {
        
        message.textContent = 'Parabéns! Você venceu!';
        message.style.color = 'green';
        document.getElementById('checkButton').disabled = true;
        document.getElementById('restartButton').style.display = 'block';
        
    }else if(currentRow >= 10 && exactMatches!==4){
        message.textContent = 'Fim de jogo! A combinação correta era: ' + secretCode;
        message.style.color = 'red';
        document.getElementById('restartButton').style.display = 'block';
    }
}


function checkRowComplete() {
    //ao capturar elementos com document.querySelectorAll, ele retorna um nodelist não um array
    //nodelist é uma coleção de elementos html que não possui métodos de array
    const currentBalls = document.querySelectorAll(`.ball[data-row="${currentRow}"]`);
    
    //array.from transforma o nodelist em um array
    const isComplete = Array.from(currentBalls).every(ball => ball.style.backgroundColor);
    document.getElementById('checkButton').disabled = !isComplete;
}

function restartGame() {
    secretCode = generateSecretCode();
    currentRow = 0;
    createBoard();
    document.querySelector('.message').textContent = '';
    document.getElementById('checkButton').disabled = true;
    document.getElementById('restartButton').style.display = 'none';
}


document.querySelector('.color-picker').addEventListener('click', (e) => {

    if (e.target.classList.contains('color-option')) {
        const selectedColor = getComputedStyle(e.target).backgroundColor;

        const currentBalls = document.querySelectorAll(`.ball[data-row="${currentRow}"]`);

        for (const ball of currentBalls) {
            if (!ball.style.backgroundColor) {
                ball.style.backgroundColor = selectedColor;
                break;
            }
        }
        checkRowComplete();
    }
});

document.getElementById('checkButton').addEventListener('click', checkGuess);
document.getElementById('restartButton').addEventListener('click', restartGame);

createBoard();

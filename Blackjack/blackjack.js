let deck = [];
let playerHand = [];
let dealerHand = [];
let money = 500;

function deal() {
    let bet = getBet();
    if (bet == null) {
        return;
    }

    money -= bet;

    deck = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K',
            'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K',
            'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K',
            'A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

    playerHand = [];
    dealerHand = [];

    playerHand.push(getRandomCard());
    playerHand.push(getRandomCard());
    dealerHand.push(getRandomCard());

    document.getElementById('player-hand').textContent = playerHand.join(' ');
    document.getElementById('dealer-hand').textContent = dealerHand.join(' ');
    document.getElementById('messages').textContent = '';
    document.getElementById('money').textContent = "Money: $" + money;
}

function getBet() {
    let bet = parseInt(document.getElementById('bet').value, 10);
    if (bet > money) {
        showAlert("You can't bet more money than you have!");
        return null;
    } else {
        return bet;
    }
}

function showAlert(message) {
    document.getElementById('alert-text').textContent = message;
    let alertBox = document.getElementById('alert');
    alertBox.classList.remove('hidden');
    alertBox.classList.add('active');

    setTimeout(() => {
        alertBox.classList.remove('active');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 300);
    }, 3000);
}



function getRandomCard() {
    let randomIndex = Math.floor(Math.random() * deck.length);
    return deck.splice(randomIndex, 1)[0];
}

function hit() {
    playerHand.push(getRandomCard());
    document.getElementById('player-hand').textContent = playerHand.join(' ');
    checkForEndOfGame();
}

function stand() {
    while (handValue(dealerHand) < 17) {
        dealerHand.push(getRandomCard());
    }
    document.getElementById('dealer-hand').textContent = dealerHand.join(' ');
    checkForEndOfGame();
}

function checkForEndOfGame() {
    let playerValue = handValue(playerHand);
    let dealerValue = handValue(dealerHand);
    let bet = getBet();

    if (playerValue > 21) {
        document.getElementById('messages').textContent = 'Player Busted!';
    } else if (dealerValue > 21) {
        document.getElementById('messages').textContent = 'Dealer Busted!';
        money += 2 * bet;
    } else if (dealerValue >= 17 && playerValue <= 21 && playerValue > dealerValue) {
        document.getElementById('messages').textContent = 'Player Wins!';
        money += 2 * bet;
    } else if (dealerValue >= 17 && playerValue <= 21 && playerValue == dealerValue) {
        document.getElementById('messages').textContent = 'Push!';
        money += bet;
    } else if (dealerValue >= 17 && playerValue < dealerValue) {
        document.getElementById('messages').textContent = 'Dealer Wins!';
    }

    document.getElementById('money').textContent = "Money: $" + money;
}

function handValue(hand) {
    let value = 0;
    let aces = 0;
    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];
        if (card == 'A') {
            value += 11;
            aces += 1;
        } else if (card == 'K' || card == 'Q' || card == 'J') {
            value += 10;
        } else {
            value += card;
        }
    }

    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }

    return value;
}

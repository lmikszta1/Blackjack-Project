/*----- constants -----*/

const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const originalDeck = buildOriginalDeck();

/*----- state variables -----*/

let shuffledDeck;
let numOfChips;
let playerHand;
let playerValue;
let dealerHand;
let dealerValue;
let betAmount;
let dealtCard;
let stand;
let dealerAceCount;
let playerAceCount;
let blackjack;

/*----- cached elements  -----*/

const deckContainer = document.getElementById('deck-container')
const chipDisplayArea = document.getElementById('chips')
const playerHandContainer = document.getElementById('player-container')
const dealerHandContainer = document.getElementById('dealer-container')
const messageContainer = document.getElementById('message-area')

/*----- event listeners -----*/

document.querySelector('#bet-button').addEventListener('click', handleBet)
document.querySelector('#hit-button').addEventListener('click', function(){
    handleHit(playerHand)
})
document.querySelector('#stand-button').addEventListener('click', function(){
    handleStand(dealerHand)
})

/*----- functions -----*/

// initializer
function init(){
    numOfChips = 5000;
    playerHand = [];
    dealerHand = [];
    stand = false;
    playerAceCount = 0;
    dealerAceCount = 0;
    dealerValue = 0;
    playerValue = 0;
    blackjack = false;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
    document.getElementById('hit-button').hidden = true;
    document.getElementById('stand-button').hidden = true;
    render()
}
// run init function
init()

// render function
function render() {
    renderShuffledDeck()
    renderChips()
}

// function to build an unshuffled deck of cards
function buildOriginalDeck() {
    const deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
        ranks.forEach(function(rank) {
            deck.push({
                // The 'face' property maps to the library's CSS classes for cards
                face: `${suit}${rank}`,
                // Setting the 'value' property for game of blackjack, not war
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}

// function to render the shuffled deck
function renderShuffledDeck(){
    shuffledDeck = getNewShuffledDeck();
    renderDeckInContainer(shuffledDeck, deckContainer);
}

// function for rendering chips remaining
function renderChips(){
    chipDisplayArea.innerHTML = `${numOfChips} Chips Remaining`;
}

// function to shuffle the deck
function getNewShuffledDeck() {
    // Create a copy of the originalDeck (leave originalDeck untouched!)
    const tempDeck = [...originalDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        // Get a random index for a card still in the tempDeck
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}

// function to render a deck
function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    // Let's build the top card as a string of HTML
    let cardHtml = `<div class="card back-red xlarge ${deck[0].face}"></div>`;

    container.innerHTML = cardHtml;
}

// function to deal a card
function dealCard(hand){
    dealtCard = shuffledDeck.splice(0, 1)[0];
    hand.push(dealtCard);
    if(dealtCard.value === 11){
        if(hand === playerHand){
            playerAceCount++;
        } else{
            dealerAceCount++;
        }
    }
}

// function to render a hand
function renderHandInContainer(hand, container){
    container.innerHTML = '';
    let cardsHtml = '';
    if(hand === dealerHand){
        for(let i = 0; i < hand.length; i++){
            if(i === 0){
                cardsHtml += `<div class="card large back-red ${hand[i].face}"></div>`;
            } else{
                cardsHtml += `<div class="card large ${hand[i].face}"></div>`;
            }
        }
    } else{
        hand.forEach(function(card) {
            cardsHtml += `<div class="card large ${card.face}"></div>`;
        })
    }
    container.innerHTML = cardsHtml;
}

// bet button handler
function handleBet(){
    betAmount = Number(document.getElementById('bet').value);
    if(numOfChips - betAmount < 0){
        messageContainer.innerHTML = 'Not enough chips!';
        return
    } else if(betAmount <= 0){
        messageContainer.innerHTML = 'Bet must be greater than 0!';
        return
    }
    numOfChips -= betAmount;
    renderChips();
    resetHands();
    let count = 0
    if(shuffledDeck.length <= 11){
        shuffledDeck = getNewShuffledDeck();
    }
    while(count <= 3){
        if(count % 2 === 0){
            dealCard(playerHand);
        }else{
            dealCard(dealerHand);
        }
        count++
    }
    for(card of playerHand) {
        playerValue += card.value
    }
    for(card of dealerHand) {
        dealerValue += card.value
    }
    if(dealerAceCount === 2){
        dealerValue = 12;
        dealerAceCount = 0;
    } else if(playerAceCount === 2){
        playerValue = 12;
        playerAceCount = 0;
    }
    if( playerValue !== 21){
        messageContainer.innerHTML = `Hit or stand? Your card value is: ${playerValue}.`;
    }
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('hit-button').hidden = false;
    document.getElementById('stand-button').hidden = false;
    
    checkBlackjack();
    if(!blackjack){
        checkWinner();
    }
    
    renderHandInContainer(playerHand, playerHandContainer);
    renderHandInContainer(dealerHand, dealerHandContainer);
}

// function to reset the hands and associated variables
function resetHands(){
    playerHand = [];
    dealerHand = [];
    stand = false;
    playerAceCount = 0;
    dealerAceCount = 0;
    dealerValue = 0;
    playerValue = 0;
    blackjack = false;
}

// function to check for blackjack
function checkBlackjack(){
    if(playerValue === 21){
        messageContainer.innerHTML = `BLACKJACK!! You win ${betAmount * 1.5} chips!`
        numOfChips += betAmount * 2.5;
        renderChips();
        document.getElementById('stand-button').disabled = true;
        document.getElementById('hit-button').disabled = true;
        blackjack = true;
    }
}

// function to check for a win
function checkWinner() {
    if(playerValue === 21){
        messageContainer.innerHTML = `21! You win ${betAmount} chips! Dealer had: ${dealerValue}.`
        numOfChips += betAmount * 2;
        renderChips();
        document.getElementById('stand-button').disabled = true;
        document.getElementById('hit-button').disabled = true;
        flipDealerCard()
    } else if(playerValue > 21 && playerAceCount === 0){
        messageContainer.innerHTML = `BUST!! You lose ${betAmount} chips!`
        document.getElementById('stand-button').disabled = true;
        document.getElementById('hit-button').disabled = true;
        flipDealerCard();
    } else if(dealerValue > 21){
        messageContainer.innerHTML = `You win ${betAmount} chips! Dealer bust!`
        numOfChips += betAmount * 2;
        renderChips();
        document.getElementById('stand-button').disabled = true;
        flipDealerCard()
    } else if((21 - playerValue) > (21 - dealerValue) && stand){
        messageContainer.innerHTML = `You lose ${betAmount} chips! Dealer had: ${dealerValue}.`
        document.getElementById('stand-button').disabled = true;
        flipDealerCard();
    } else if((21 - playerValue) < (21 - dealerValue) && stand){
        messageContainer.innerHTML = `You win ${betAmount} chips! Dealer had: ${dealerValue}.`
        document.getElementById('stand-button').disabled = true;
        numOfChips += betAmount * 2;
        renderChips();
        flipDealerCard()
    } else if(playerValue === dealerValue && stand){
        messageContainer.innerHTML = `PUSH! The dealer and player have the same value. Chips returned.`
        numOfChips += betAmount;
        renderChips();
        document.getElementById('stand-button').disabled = true;
        flipDealerCard()
    }
}

// hit button handler
function handleHit(hand){
    dealCard(hand);
    playerValue += dealtCard.value;
    renderHandInContainer(hand, playerHandContainer);
    if( playerValue < 21){
        messageContainer.innerHTML = `Hit or stand? Your card value is: ${playerValue}.`;
    } else if(playerValue > 21 && playerAceCount !== 0){
        playerValue -= 10;
        playerAceCount--;
        messageContainer.innerHTML = `Hit or stand? Your card value is: ${playerValue}.`
    }
    checkWinner();
}

// stand button handler
function handleStand(hand){
    stand = true;
    while(dealerValue < 17){
        dealCard(hand);
        dealerValue += dealtCard.value;
        if(dealerAceCount !== 0){
            dealerValue -= 10;
            dealerAceCount--;
        }
        renderHandInContainer(hand, dealerHandContainer);
    }
    checkWinner();
    document.getElementById('hit-button').disabled = true;
}

// function to flip the dealer's first card
function flipDealerCard(){
    let flippedCardHtml = ''
    dealerHandContainer.innerHTML = ''
    dealerHand.forEach(function(card) {
        flippedCardHtml += `<div class="card large ${card.face}"></div>`
    })
    dealerHandContainer.innerHTML = flippedCardHtml;
}
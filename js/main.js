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

/*----- cached elements  -----*/
const deckContainer = document.getElementById('deck-container');
const chipDisplayArea = document.getElementById('chips');
const playerHandContainer = document.getElementById('player-container')
const dealerHandContainer = document.getElementById('dealer-container')
const messageContainer = document.getElementById('message-area')

/*----- event listeners -----*/

document.querySelector('#bet-button').addEventListener('click', handleBet)

/*----- functions -----*/
function init(){
    numOfChips = 5000;
    playerHand = [];
    dealerHand = [];

    render()
}
init()

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

function dealCard(hand){
    dealtCard = shuffledDeck.splice(0, 1)[0];
    hand.push(dealtCard);

}

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

function handleBet(){
    betAmount = Number(document.getElementById('bet').value);
    numOfChips -= betAmount;
    renderChips();
    let count = 0
    while(count <= 3){
        if(count % 2 === 0){
            dealCard(playerHand);
        }else{
            dealCard(dealerHand);
        }
        count++
        for(card of playerHand) {
            playerValue += card.value
        }
        for(card of dealerHand) {
            dealerValue += card.value
        }
    }
    
    checkWinner();

    renderHandInContainer(playerHand, playerHandContainer);
    renderHandInContainer(dealerHand, dealerHandContainer);
}

function checkWinner() {
    if(playerValue === 21){
        messageContainer.innerHTML = `You win ${betAmount} chips!`
        numOfChips += betAmount * 2;
    } else if((21 - playerValue) > (21 - dealerValue)){
        messageContainer.innerHTML = `You lose ${betAmount} chips!`
    } else if(playerValue > 21){
        messageContainer.innerHTML = `BUST!! You lose ${betAmount} chips!`
    } else if((21 - playerValue) < (21 - dealerValue)){
        messageContainer.innerHTML = `You win ${betAmount} chips!`
        numOfChips += betAmount * 2;
    }
}

function handleHit(hand){
    dealCard(hand);
}


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
const deckContainer = document.getElementById('deck-container');
const chipDisplayArea = document.getElementById('chips');
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
    console.log(dealtCard.value)
    if(dealtCard.value === 11){
        if(hand === playerHand){
            playerAceCount++;
        } else{
            dealerAceCount++;
        }
    }
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
    resetHands();
    let count = 0
    if(shuffledDeck.length <= 5){
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
    } else if(playerAceCount === 2){
        playerValue = 12;
    }

    if( playerValue !== 21){
        messageContainer.innerHTML = `Hit or stand? Your card value is: ${playerValue}.`;
    }

    checkBlackjack();
    if(!blackjack){
        checkWinner();
    }
    // checkWinner();

    renderHandInContainer(playerHand, playerHandContainer);
    renderHandInContainer(dealerHand, dealerHandContainer);
}

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

function checkBlackjack(){
    if(playerValue === 21){
        messageContainer.innerHTML = `BLACKJACK!! You win ${betAmount * 1.5} chips!`
        numOfChips += betAmount * 2.5;
        renderChips();
        blackjack = true;
    }
}

function checkWinner() {
    if(playerValue === 21){
        messageContainer.innerHTML = `You win ${betAmount} chips! Dealer had ${dealerValue}.`
        numOfChips += betAmount * 2;
        renderChips();
    } else if(playerValue > 21 && playerAceCount === 0){
        messageContainer.innerHTML = `BUST!! You lose ${betAmount} chips!`
    } else if(dealerValue > 21){
        messageContainer.innerHTML = `You win ${betAmount} chips! Dealer bust!`
        numOfChips += betAmount * 2;
        renderChips();
    } else if((21 - playerValue) > (21 - dealerValue) && stand){
        messageContainer.innerHTML = `You lose ${betAmount} chips! Dealer had: ${dealerValue}.`
    } else if((21 - playerValue) < (21 - dealerValue) && stand){
        messageContainer.innerHTML = `You win ${betAmount} chips! Dealer had: ${dealerValue}.`
        numOfChips += betAmount * 2;
        renderChips();
    } else if(playerValue === dealerValue && stand){
        messageContainer.innerHTML = `PUSH! The dealer and player have the same value. Chips returned.`
        numOfChips += betAmount;
        renderChips();
    }
    
}

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
}
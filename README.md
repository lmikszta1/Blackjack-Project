# ♤ ♡ BLACKJACK ♢ ♧

Blackjack is a casino banking game. It is the most widely played casino banking game in the world. It uses decks of 52 cards and descends from a global family of casino banking games known as Twenty-One. (via Wikipedia) The player and the dealer are dealt 2 cards each initially. The dealer has one card face-up and the other face-down. Both of the player cards will be face up. Each card has a numerical value assigned to it. The goal of the game is to reach a sum of those numerical card values that is as close to or equal to 21 without going over 21. You have the option to hit or stand every turn. A hit will add another card from the deck to your hand. Standing will keep the current hand the same. Once all players have chosen to stand, the full hands are revealed and winners are decided. Winners are decided based on 2 things: (1) The hand is equal to 21 in numerical value, or (2) The hand is closer to 21 in numerical value than that of the dealers hand, without going over 21. Going over 21 at any point in the game results in a bust and the hand is lost. 

## User Stories:
- As a user I want to be able to be dealt a hand of 2 cards, adding 1 additional card for every hit.
- I want to be able to hit or stand.
- I want to be able to place bets on a hand before being dealt cards.
- I want to be able to win if the sum of my card values is equal to 21. (Blackjack)
- I want to be able to win if the sum of my cards is closer to 21 than the sum of the dealer's cards.
- I want to be able to lose a hand if the sum of my cards is greater than 21, regardless of the dealer's hand.
- I want to be able to lose a hand if the sum of my cards is less than 21 but the dealer is closer to 21 than me.
- I want the dealer to **ALWAYS** hit if the sum of their cards is less than 17.
- I want to win 2x the chips I bet on every win. (Ex: initial bet is 500, recieve 1000 total chips back after win so +500 chips overall)
- I want to return the chips bet to the player if the player and the dealer have the same card values. (Ex: dealer has 19 and player also has 19) **This is called a push**

## Icebox items:
- Feature to win 1.5x bet amount if blackjack is hit. (Ex: initial bet is 500, recieve 1250 total chips back after blackjack so +750 chips overall)
- Feature for splitting cards. (If both cards dealt are the same, the player can split the 2 cards into separate hands essentially giving them 2 chances to win. This will take whatever the amount bet is and put the same bet on the new hand as well, essentially doubling the bet amount)
- Change theme feature
- If a hand has already been played, when the deal button is clicked, bet the same amount as the last hand on the new hand automatically

## Overall design and feel:
- minimal design
- display cards using the css card library
- Green site background to give illusion of a real blackjack table
- Font Inconsolata
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap" rel="stylesheet">
```
```css
font-family: 'Inconsolata', monospace;
```
## Wireframe:
- <img src="https://i.imgur.com/BchliSZ.jpg" alt="Wireframe"/>
    
## Pseudocode
1. Define required constants
    1. numerical values for each card (ranks)
    2. card suit
2. Define required variables used to track the state of the game
    1. playerHand - sum of the numerical values of the player's hand
    2. dealerHand - sum of the numerical values of the dealer's hand
    3. betAmount - amount the player is betting on a specific hand
    4. numOfChips - amount of chips the player has available to bet (5000 on init)
    5. deck - array of cards
    6. shuffledDeck - shuffled array of cards
3. Cached DOM elements
    1. playerCards and dealerCards
    2. bet button (acts as a deal button as well)
    3. bet input field
    4. hit button
    5. stand button
    6. deal button (optional add, bet button will do this for now)
    6. win/loss/push message place
    7. number of chips remaining display area
4. Upon loading the app should:
    - Initialize the state variables
    - playerHand and dealerHand are undefined until bet/deal button is clicked
    - betAmount is undefined
    - numOfChips set to 5000
    - deck array initialized to be full of ordered cards
    - shuffledDeck array is a copy of deck that has been shuffled
    - Render the shuffledDeck face down (only back of top card will be displayed)
    - Render the deal button (optional at first bet will do this, add if time)
    - Render the number of chips remaining
    - Render the bet amount field and bet/deal button
    - Wait for user interaction
5. Handle the player making a bet
    - Read in the value the player inputs into the bet amount field
    - Update the chips remaining to reflect the bet amount
    - Deal 2 cards to the player face up
    - Deal 2 cards to the dealer, one face up and one face down
    - Check if the player has blackjack(21)
    - If no blackjack, wait for user to choose whether to hit or stand
6. Handle the player choosing to hit
    - Deal the player one more card
    - Add the value of the new card to the total value
    - Check for a bust (player card value is greater than 21)
    - If there is a bust, do not return bet chips and display loss message
    - If the total value of the player hand after the hit is less than 21, wait for user interaction
7. Handle the player choosing to stand
    - Execute the dealer functionality(hit until they reach 17)
    - If dealer busts player automatically wins
        - display winning message
        - distribute winnings
    - If the dealer is closer to 21 than they player, display the loss message and do not return chips(Ex: total player card value is 17 and total dealer card value is 19)
    - If the dealer and the player total card values are the same, return chips bet to player and display push message
    - If the player is closer to 21 than the dealer, display the win message and distribute winnings
8. Determine win/loss/push
    - check for 21(blackjack)
    - check if player card total is closer to 21 than the dealer
    - after win/loss/push and chips have been distributed accordingly, reset both hands and shuffle the deck

## State variables
- players hand
```javascript
let playerHand
```
- dealers hand
```javascript
let dealerHand
```
- bet amount
```javascript
let betAmount
```
- number of remaining chips available to the player
```javascript
let chipsRemaining
```
- deck of unshuffled cards
```javascript
let deck
```
- deck of shuffled cards
```javascript
let shuffledDeck
```
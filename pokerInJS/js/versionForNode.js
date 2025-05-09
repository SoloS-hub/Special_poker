const suits = ["hearts", "spades", "diamonds", "clubs"]

// "hearts", "spades", "diamonds", "clubs"

const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"]

// "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"

let maxHandSize = 5

// Class to create playing cards
class Card {
	constructor(rank, suit) {
		this.rank = rank
		this.suit = suit
	}
	toString() {
		return `${this.rank} of ${this.suit}`
	}
}

// Class for deck
class Deck {
	constructor() {
		this.stack = []
	}

	// Add a card to the top of the deck
	addCard(item) {
		this.stack.push(item)
	}
	// Draw a card from the top of the deck
	drawCard() {
		let drawnCard = this.stack.pop()
		console.log(`You draw a ${drawnCard}`)
		return drawnCard
	}

	// Show the cards in the deck (in order)
	showDeck() {
		this.stack.forEach((card) => {
			console.log(card.suit, card.rank)
		})
	}

	// Show how many cards are in the deck
	showLength() {
		console.log(`The deck has ${this.stack.length} cards`)
	}

	// Shuffle the deck
	shuffle() {
		for (let i = this.stack.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			const temp = this.stack[i]
			this.stack[i] = this.stack[j]
			this.stack[j] = temp
		}
	}
}

// Here a deck object is created from the Deck class
let deck = new Deck()

// ******* Example Code *******
// Here are four lines of example code showing how to add cards to the deck
// let card = new Card(ranks[0], suits[0]) // Adds a card to the deck

// deck.addCard(card)
// deck.addCard(new Card(ranks[1], suits[0])) // Adds another card to the deck.
// deck.showDeck() // All cards in the deck are displayed in the console.

// ******* End Example Code *******

// ******* Your Tasks *******

// 1. Create 52 cards and add them to your deck object.
//   a) Create a for-loop that iterates through all suits with the variable i.
//   b) Inside the first for-loop, create another for-loop that iterates through all ranks with the variable j.
//   c) Now, in the nested for-loop, create a new card and then add it to the deck object.
//   d) After the nested for-loop, test printing all cards using the showDeck() method.

for (let i = 0; i < ranks.length; i++) {
	for (let j = 0; j < suits.length; j++) {
		deck.addCard(new Card(ranks[i], suits[j]))
	}
}

deck.showDeck()

// 2. Test shuffling the deck with shuffle() and show the deck again.

deck.shuffle()
// deck.showDeck()

// 3. Draw five cards from the deck. Put them in the array hand and evaluate them according to poker rules.
//    Print if there is anything of value in the hand.
//
// Easy: Evaluate hand should go through the five cards and notify if the user has a pair.
// Medium: Evaluate hand should also detect if the user has three of a kind or a full house.
// Hard: Evaluate hand should notify if the user has any valid poker hand.
// Here are different poker hands: https://en.wikipedia.org/wiki/List_of_poker_hands

function returnHandAsArrayOfRanks(hand) {
	let arrayWithRankOfCardsInHand = []
	for (let i = 0; i < hand.length; i++) {
		const rankOfCard = hand[i].rank
		arrayWithRankOfCardsInHand.push(rankOfCard)
	}
	arrayWithRankOfCardsInHand.reverse()
	return arrayWithRankOfCardsInHand
}

function checkNumberOfPairs(hand) {
	const arrayWithRankOfCardsInHand = returnHandAsArrayOfRanks(hand)
	let numberOfPairs = 0
	for (let i = 0; i < ranks.length; i++) {
		if (Number(arrayWithRankOfCardsInHand.lastIndexOf(ranks[i])) - Number(arrayWithRankOfCardsInHand.indexOf(ranks[i])) === 1) {
			numberOfPairs += 1
		}
	}
	return numberOfPairs
}

function checkIfFourOfAKind(hand) {
	const arrayWithRankOfCardsInHand = returnHandAsArrayOfRanks(hand)
	for (let i = 0; i < ranks.length; i++) {
		if (Number(arrayWithRankOfCardsInHand.lastIndexOf(ranks[i])) - Number(arrayWithRankOfCardsInHand.indexOf(ranks[i])) === 3) {
			return true
		}
	}
	return false
}

function checkIfThreeOfAKind(hand) {
	const arrayWithRankOfCardsInHand = returnHandAsArrayOfRanks(hand)
	for (let i = 0; i < ranks.length; i++) {
		if (Number(arrayWithRankOfCardsInHand.lastIndexOf(ranks[i])) - Number(arrayWithRankOfCardsInHand.indexOf(ranks[i])) === 2) {
			return true
		}
	}
	return false
}

function checkIfTwoPair(hand) {
	if (checkNumberOfPairs(hand) === 2) {
		return true
	}
	return false
}

function checkIfPair(hand) {
	if (checkNumberOfPairs(hand) === 1) {
		return true
	}
	return false
}

function checkIfStraight(hand) {
	const arrayWithRankOfCardsInHand = returnHandAsArrayOfRanks(hand)
	let arrayOfCardsForStraight = []
	arrayOfCardsForStraight.push(ranks[ranks.length - 1])
	arrayOfCardsForStraight = arrayOfCardsForStraight.concat(ranks.slice())
	let straightCount = 0
	for (let i = 0; i < arrayOfCardsForStraight.length - 4; i++) {
		const exampleOfStraight = []
		for (let k = 0; k < 5; k++) {
			exampleOfStraight.push(arrayOfCardsForStraight[i + k])
		}
		if (exampleOfStraight.every((j) => arrayWithRankOfCardsInHand.includes(j)) === true) {
			straightCount += 1
		}
	}
	if (straightCount > 0) {
		return true
	}

	return false
}

function checkIfFlush(hand) {
	if (hand.every((card) => card.suit === hand[0].suit)) {
		return true
	}
	return false
}

export class playerHand {
	constructor() {
		this.cardsInHand = []
	}

	// Draws cards for this hand
	drawCard(amount = maxHandSize) {
		let handSize = this.cardsInHand.length
		for (let i = 0; i < amount - handSize; i++) {
			this.cardsInHand.push(deck.drawCard())
		}
	}

	sortHandRank() {
		const sortedHandRank = []
		for (let i = 0; i < ranks.length; i++) {
			for (let j = 0; j < this.cardsInHand.length; j++) {
				if (ranks[i] === this.cardsInHand[j].rank) {
					sortedHandRank.splice(0, 0, this.cardsInHand[j])
				}
			}
		}
		this.cardsInHand = sortedHandRank
	}

	sortHandSuit() {
		const sortedHandSuit = []
		for (let i = 0; i < suits.length; i++) {
			for (let j = 0; j < this.cardsInHand.length; j++) {
				if (suits[i] === this.cardsInHand[j].suit) {
					sortedHandSuit.splice(0, 0, this.cardsInHand[j])
				}
			}
		}
		this.cardsInHand = sortedHandSuit
	}

	printHand() {
		for (let i = 0; i < this.cardsInHand.length; i++) {
			console.log(`${this.cardsInHand[i].rank} of ${this.cardsInHand[i].suit}`)
		}
	}

	checkHand() {
		this.sortHandRank()
		let handtype = 0
		if (checkIfStraight(this.cardsInHand) && checkIfFlush(this.cardsInHand)) {
			return "straight flush"
		} else if (checkIfFourOfAKind(this.cardsInHand)) {
			return "four of a kind"
		} else if (checkIfThreeOfAKind(this.cardsInHand) && checkIfPair(this.cardsInHand)) {
			return "full house"
		} else if (checkIfFlush(this.cardsInHand)) {
			return "flush"
		} else if (checkIfStraight(this.cardsInHand)) {
			return "straight"
		} else if (checkIfThreeOfAKind(this.cardsInHand)) {
			return "three of a kind"
		} else if (checkIfTwoPair(this.cardsInHand)) {
			return "two pair"
		} else if (checkIfPair(this.cardsInHand)) {
			return "pair"
		} else {
			return "high card"
		}
	}
}

let player1Hand = new playerHand()
player1Hand.drawCard()
player1Hand.sortHandSuit()
player1Hand.sortHandRank()
console.log()
player1Hand.printHand()
console.log(player1Hand.checkHand())

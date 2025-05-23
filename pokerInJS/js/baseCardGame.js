const suits = ["hearts", "spades", "diamonds", "clubs"]

// "hearts", "spades", "diamonds", "clubs"

const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"]

// "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"

document.body.innerHTML += `<div id="preloadedCards" style="display: none;"></div>`

// Class to create playing cards
class Card {
	constructor(rank, suit) {
		this.rank = rank
		this.suit = suit
		this.selected = false
	}
	toString() {
		return `${this.rank} of ${this.suit}`
	}
	toArray() {
		return rankValues[this.rank]
	}
}

// Class for deck
export class Deck {
	constructor() {
		this.stack = []
		this.discard = []
	}

	// Add a card to the top of the deck
	addCard(card) {
		this.stack.push(card)
		let preloadCard = new Image()
		preloadCard.src = `../images/cards/${card.rank}_of_${card.suit}.png`
		preloadCard.alt = `${card.rank} of ${card.suit}`
		preloadCard.id = `${card.rank}_of_${card.suit}`
		preloadCard.className = "card"
		document.getElementById("preloadedCards").innerHTML += preloadCard.outerHTML
		// document.getElementById("preloadedCards").innerHTML += `<img src="../images/cards/${card.rank}_of_${card.suit}.png" alt="${card.rank} of ${card.suit}" id="${card.rank}_of_${card.suit}" class="card" />`
	}

	addDiscarded(card) {
		if (Array.isArray(card)) {
			this.discard.push(...card)
		} else {
			this.discard.push(card)
		}
	}

	// Add a full deck of cards
	addFullDeck() {
		for (let i = 0; i < ranks.length; i++) {
			for (let j = 0; j < suits.length; j++) {
				this.addCard(new Card(ranks[i], suits[j]))
			}
		}
		// console.log(this.stack)
	}
	// Draw a card from the top of the deck
	drawCard() {
		if (this.stack.length === 0) {
			this.addDiscardedCards()
		}

		let drawnCard = this.stack.pop()
		return drawnCard
	}

	// Show the cards in the deck (in order)
	showDeck() {
		this.stack.forEach((card) => {
			console.log(String(card))
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
	// Add discarded cards back to the deck if deck is empty
	addDiscardedCards() {
		for (let i = 0; i < this.discard.length; i++) {
			const element = this.discard[i]
			this.addCard(element)
		}
		this.shuffle()
		this.discard = []
	}
}

export class Hand {
	constructor() {
		this.cardsInHand = []
		this.balance = 100
		this.bet = 0
	}

	// Draws cards for this hand
	drawCard(amount = 1) {
		for (let i = 0; i < amount; i++) {
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
}

export let deck = new Deck()

deck.addFullDeck()
deck.shuffle()

// deck.showDeck()

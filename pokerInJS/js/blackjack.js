import { deck } from "./baseCardGame.js"
import { Hand } from "./baseCardGame.js"

let dealer = new Hand()
dealer.drawCards(1)
dealer.sortHandSuit()
dealer.sortHandRank()
dealer.printHand()

let playerHand = new Hand()
playerHand.drawCards(2)
playerHand.sortHandSuit()
playerHand.sortHandRank()
playerHand.printHand()

Hand.prototype.handValue = function () {
	let handValue = 0
	let aceCount = 0
	for (let i = 0; i < this.cardsInHand.length; i++) {
		if (this.cardsInHand[i].rank === "ace") {
			aceCount++
			handValue += 11
		} else if (["jack", "queen", "king"].includes(this.cardsInHand[i].rank)) {
			handValue += 10
		} else {
			handValue += parseInt(this.cardsInHand[i].rank)
		}
	}
	while (handValue > 21 && aceCount > 0) {
		handValue -= 10
		aceCount--
	}
	return handValue
}

Hand.prototype.showCardsAndVal = async function (elementId) {
	const handElement = document.getElementById(`${elementId}Hand`)
	const currentCards = Array.from(handElement.children).map((child) => child.id)

	document.getElementById(`${elementId}Value`).innerHTML = this.handValue()

	for (let i = 0; i < this.cardsInHand.length; i++) {
		const cardId = `${this.cardsInHand[i].rank}_of_${this.cardsInHand[i].suit}`
		if (!currentCards.includes(cardId)) {
			// Only append cards not already in the hand
			const cardElement = document.getElementById(cardId)
			handElement.appendChild(cardElement)
			// console.log(cardElement)

			// Wait for the DOM to update after appending the card
			await new Promise((resolve) => setTimeout(resolve, 100))
		}
	}

	// Update the hand value
}

addEventListener("DOMContentLoaded", function () {
	playerHand.showCardsAndVal("player")
	dealer.showCardsAndVal("dealer")
	document.getElementById("playerBalance").innerText = `${playerHand.balance}$`
})

var hit = document.getElementById("hit")

hit.onclick = function () {
	playerHand.drawCards()
	playerHand.showCardsAndVal("player")
}

var stand = document.getElementById("stand")

stand.onclick = async function () {
	hit.disabled = true
	stand.disabled = true
	double.disabled = true

	while (dealer.handValue() < 17) {
		dealer.drawCards()
	}
	await dealer.showCardsAndVal("dealer") // Wait for cards to load

	endGame() // Call endGame after all cards are loaded
}

function resetGame() {
	hit.disabled = false
	stand.disabled = false
	double.disabled = false

	document.getElementById("playerHand").innerHTML = ""
	document.getElementById("dealerHand").innerHTML = ""

	deck.addDiscarded(playerHand.cardsInHand)
	deck.addDiscarded(dealer.cardsInHand)

	// deck.discard = deck.discard.concat(playerHand.cardsInHand)
	// deck.discard = deck.discard.concat(dealer.cardsInHand)

	playerHand.cardsInHand = []
	playerHand.drawCards(2)
	playerHand.showCardsAndVal("player")

	dealer.cardsInHand = []
	dealer.drawCards(1)
	dealer.showCardsAndVal("dealer")
}

var reset = document.getElementById("reset")

reset.onclick = function () {
	resetGame()
}

var double = document.getElementById("double")

double.onclick = function () {
	if (playerHand.balance >= playerHand.bet) {
		playerHand.balance -= playerHand.bet
		playerHand.bet *= 2
		hit.disabled = true
		stand.disabled = true
		double.disabled = true
		playerHand.drawCards()
		playerHand.showCardsAndVal("player")
	} else {
		alert("You do not have enough balance to double your bet.")
	}
	showBetAndBalance()
}

var bet = document.getElementsByClassName("betButton")

for (let button of bet) {
	button.onclick = function () {
		if (Number(button.id) <= playerHand.balance) {
			playerHand.bet += Number(button.id)
			playerHand.balance -= Number(button.id)
		} else if (button.id === "max") {
			playerHand.bet += playerHand.balance
			playerHand.balance = 0
		} else {
			alert("You do not have enough balance")
		}
		showBetAndBalance()
	}
}

function showBetAndBalance() {
	document.getElementById("playerBet").innerText = `${playerHand.bet}$`
	document.getElementById("playerBalance").innerText = `${playerHand.balance}$`
}

function endGame() {
	if (playerHand.handValue() > 21) {
		alert("Player busted! Dealer wins!")
		playerHand.bet = 0
	} else if (dealer.handValue() > 21) {
		alert("Dealer busted! Player wins!")
		playerHand.balance += playerHand.bet * 2
		playerHand.bet = 0
	} else if (playerHand.handValue() > dealer.handValue()) {
		alert("Player wins!")
		playerHand.balance += playerHand.bet * 2
		playerHand.bet = 0
	} else if (playerHand.handValue() < dealer.handValue()) {
		alert("Dealer wins!")
		playerHand.bet = 0
	} else {
		alert("It's a tie!")
	}
	showBetAndBalance()
	resetGame()
}
// console.log(document.getElementById("preloadedCards").innerHTML)

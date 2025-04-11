import { deck } from "./baseCardGame.js"
import { Hand } from "./baseCardGame.js"

let dealer = new Hand()
dealer.drawCards(1)
dealer.sortHandSuit()
dealer.sortHandRank()
dealer.printHand()

let player1Hand = new Hand()
player1Hand.drawCards(2)
player1Hand.sortHandSuit()
player1Hand.sortHandRank()
player1Hand.printHand()

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
			console.log(cardElement)

			// Wait for the DOM to update after appending the card
			await new Promise((resolve) => setTimeout(resolve, 100))
		}
	}

	// Update the hand value
}

addEventListener("DOMContentLoaded", function () {
	player1Hand.showCardsAndVal("player")
	dealer.showCardsAndVal("dealer")
	document.getElementById("playerBalance").innerText = `${player1Hand.balance}$`
})

var hit = document.getElementById("hit")

hit.onclick = function () {
	player1Hand.drawCards()
	player1Hand.showCardsAndVal("player")
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

	deck.discard = deck.discard.concat(player1Hand.cardsInHand)
	deck.discard = deck.discard.concat(dealer.cardsInHand)

	player1Hand.cardsInHand = []
	player1Hand.drawCards(2)
	player1Hand.showCardsAndVal("player")

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
	if (player1Hand.balance >= player1Hand.bet) {
		player1Hand.balance -= player1Hand.bet
		player1Hand.bet *= 2
		hit.disabled = true
		stand.disabled = true
		double.disabled = true
		player1Hand.drawCards()
		player1Hand.showCardsAndVal("player")
	} else {
		alert("You do not have enough balance to double your bet.")
	}
	showBetAndBalance()
}

var bet = document.getElementsByClassName("betButton")

for (let button of bet) {
	button.onclick = function () {
		if (Number(button.id) <= player1Hand.balance) {
			player1Hand.bet += Number(button.id)
			player1Hand.balance -= Number(button.id)
		} else if (button.id === "max") {
			player1Hand.bet += player1Hand.balance
			player1Hand.balance = 0
		} else {
			alert("You do not have enough balance")
		}
		showBetAndBalance()
	}
}

function showBetAndBalance() {
	document.getElementById("playerBet").innerText = `${player1Hand.bet}$`
	document.getElementById("playerBalance").innerText = `${player1Hand.balance}$`
}

function endGame() {
	if (player1Hand.handValue() > 21) {
		alert("Player busted! Dealer wins!")
		player1Hand.bet = 0
	} else if (dealer.handValue() > 21) {
		alert("Dealer busted! Player wins!")
		player1Hand.balance += player1Hand.bet * 2
		player1Hand.bet = 0
	} else if (player1Hand.handValue() > dealer.handValue()) {
		alert("Player wins!")
		player1Hand.balance += player1Hand.bet * 2
		player1Hand.bet = 0
	} else if (player1Hand.handValue() < dealer.handValue()) {
		alert("Dealer wins!")
		player1Hand.bet = 0
	} else {
		alert("It's a tie!")
	}
	showBetAndBalance()
	resetGame()
}
// console.log(document.getElementById("preloadedCards").innerHTML)

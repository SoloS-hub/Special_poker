import { deck } from "./baseCardGame.js"
import { Hand } from "./baseCardGame.js"

var dealer = new Hand()
var playerHand = new Hand()

// function to start the game and deal cards
function startGame() {
	for (let button of bet) {
		button.disabled = true
	}

	hit.disabled = false
	stand.disabled = false
	double.disabled = false
	start.disabled = true

	document.getElementById("playerHand").innerHTML = ""
	document.getElementById("dealerHand").innerHTML = ""

	deck.addDiscarded(dealer.cardsInHand)
	dealer.cardsInHand = []
	dealer.drawCard()
	dealer.showCardsAndVal("dealer")

	deck.addDiscarded(playerHand.cardsInHand)
	playerHand.cardsInHand = []
	playerHand.drawCard(2)
	playerHand.showCardsAndVal("player")
}

// function to return the value of the hand
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

// function to show the cards and value of the hand
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

// function to show all info when the page loads
addEventListener("DOMContentLoaded", function () {
	playerHand.showCardsAndVal("player")
	dealer.showCardsAndVal("dealer")
	document.getElementById("playerBalance").innerText = `${playerHand.balance}$`
})

// buttons

// start button
var start = document.getElementById("start")

start.onclick = function () {
	bet.disabled = true
	startGame()
}

// reset button
var reset = document.getElementById("reset")

reset.onclick = function () {
	for (let button of bet) {
		button.disabled = false
	}

	document.getElementById("dealerHand").innerHTML = ""
	deck.addDiscarded(dealer.cardsInHand)
	dealer.cardsInHand = []
	dealer.showCardsAndVal("dealer")

	document.getElementById("playerHand").innerHTML = ""
	deck.addDiscarded(playerHand.cardsInHand)
	playerHand.cardsInHand = []
	playerHand.balance = 100
	playerHand.bet = 0
	playerHand.showCardsAndVal("player")

	showBetAndBalance()

	start.disabled = false
}

// stand button
var stand = document.getElementById("stand")
stand.disabled = true

stand.onclick = async function () {
	endGame() // Call endGame after all cards are loaded
}

// hit button
var hit = document.getElementById("hit")
hit.disabled = true

hit.onclick = async function () {
	playerHand.drawCard()
	await playerHand.showCardsAndVal("player")
	if (playerHand.handValue() > 21) {
		endGame()
	}
}

// double button
var double = document.getElementById("double")
double.disabled = true

double.onclick = async function () {
	if (playerHand.balance >= playerHand.bet) {
		hit.disabled = true
		stand.disabled = true
		double.disabled = true

		playerHand.balance -= playerHand.bet
		playerHand.bet *= 2

		playerHand.drawCard()
		await playerHand.showCardsAndVal("player")
		endGame()
	} else {
		alert("You do not have enough balance to double your bet.")
	}
	showBetAndBalance()
}

// bet buttons
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

// end of buttons

// function to show the bet and balance
function showBetAndBalance() {
	document.getElementById("playerBet").innerText = `${playerHand.bet}$`
	document.getElementById("playerBalance").innerText = `${playerHand.balance}$`
}

// function to end the game
async function endGame() {
	hit.disabled = true
	stand.disabled = true
	double.disabled = true

	while (dealer.handValue() < 17) {
		dealer.drawCard()
	}

	await dealer.showCardsAndVal("dealer")

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
	start.disabled = false
	for (let button of bet) {
		button.disabled = false
	}
}
// console.log(document.getElementById("preloadedCards").innerHTML)

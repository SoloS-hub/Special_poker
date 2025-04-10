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

Hand.prototype.showCardsAndVal = function (elementId) {
	// document.getElementById(`${elementId}Hand`).innerHTML = ""
	for (let i = 0; i < this.cardsInHand.length; i++) {
		// console.log(this.cardsInHand[i])

		document.getElementById(`${elementId}Hand`).appendChild(document.getElementById(`${this.cardsInHand[i].rank}_of_${this.cardsInHand[i].suit}`))
		// `<img src="../images/cards/${this.cardsInHand[i].rank}_of_${this.cardsInHand[i].suit}.png" alt="${this.cardsInHand[i].rank} of ${this.cardsInHand[i].suit}" class="card" />`
	}
	// this.printHand()
	document.getElementById(`${elementId}Value`).innerHTML = this.handValue()
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

stand.onclick = function () {
	hit.disabled = true
	stand.disabled = true
	double.disabled = true

	while (dealer.handValue() < 17) {
		dealer.drawCards()
		dealer.showCardsAndVal("dealer")
	}
	checkWinner()
	resetGame()
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

var bet = document.getElementsByClassName("betButton")

for(let button of bet) {
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

function showBetAndBalance () {
	document.getElementById("playerBet").innerText = `${player1Hand.bet}$`
	document.getElementById("playerBalance").innerText = `${player1Hand.balance}$`
}

function checkWinner() {
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
}
console.log(document.getElementById("preloadedCards").innerHTML)

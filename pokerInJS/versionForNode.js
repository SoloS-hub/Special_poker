const färger = ["hearts", "spades", "diamonds", "clubs"]

// "hearts", "spades", "diamonds", "clubs"

const valörer = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"]

// "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"

let maxHandSize = 5

// Klass för att skapa spelkort
class Kort {
	constructor(valör, färg) {
		this.valör = valör
		this.färg = färg
	}
	toString() {
		return `${this.valör} of ${this.färg}`
	}
}

// Klass för stack
class Kortlek {
	constructor() {
		this.stack = []
	}

	// Lägg ett kort överst i leken
	laggTillKort(item) {
		this.stack.push(item)
	}
	// Ta ett kort överst från leken
	draKort() {
		let draget_kort = this.stack.pop()
		console.log(`You draw a ${draget_kort}`)
		return draget_kort
	}

	// Visa korten som finns i leken (I ordning)
	visaLek() {
		this.stack.forEach((kort) => {
			console.log(kort.färg, kort.valör)
		})
	}

	// Visa hur många kort som finns
	visaLängd() {
		console.log(`Kortleken har ${this.stack.length} kort`)
	}

	// Blanda leken
	blanda() {
		for (let i = this.stack.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			const temp = this.stack[i]
			this.stack[i] = this.stack[j]
			this.stack[j] = temp
		}
	}
}

// Här skapas ett kortleks-objekt från klassen Kortlek
let kortlek = new Kortlek()

// ******* Exempelkod *******
// Här är fyra rader exempelkod som visar hur du kan lägga in kort i kortleken
// let kort = new Kort(valörer[0], färger[0]) // Lägger in ett kort i leken

// kortlek.laggTillKort(kort)
// kortlek.laggTillKort(new Kort(valörer[1], färger[0])) // Lägger ytterligare ett kort i leken.
// kortlek.visaLek() // alla kort i leken visas i konsollen.

// ******* Slut exempelkod *******

// ******* Dina uppgifter *******

// 1. Skapa 52 kort som ni lägger till i erat kortleksobjekt.
//   a) Skapa en for-slinga som med variabeln i itererar genom alla färger.
//   b) Inuti den första for-slingan, skapa en ny for-slinga som med variabeln j itererar
//       genom alla valörer.
//   c) Nu kan ni i den nästlade for-slingan skapa ett nytt kort, och sedan lägga till  det till
//       kortleks-objektet.
//   d) Efter den nästlade for-slingan, testa att skriva ut alla kort med metoden visaLek().

for (let i = 0; i < valörer.length; i++) {
	for (let j = 0; j < färger.length; j++) {
		kortlek.laggTillKort(new Kort(valörer[i], färger[j]))
	}
}

kortlek.visaLek()

// 2. Testa att blanda kortleken med blanda() och visa kortleken igen.

kortlek.blanda()
// kortlek.visaLek()

// 3. Dra fem kort ur leken. Lägg dem i arrayen hand och värdera den enligt pokerregler.
//    Skriv ut om det finns något av värde i handen.
//
// Lätt: Värdera hand ska gå igenom de fem korten och meddela om användaren har ett par.
// Medel: Värdera hand ska även kunna märka om användaren har triss eller kåk.
// Svår: Värdera hand ska meddela om användaren har någon giltig pokerhand.
// Här finns olika pokerhänder: https://sv.wikipedia.org/wiki/Pokerhand

function returnHandAsArrayOfRanks(hand) {
	let arrayWithRankOfCardsInHand = []
	for (let i = 0; i < hand.length; i++) {
		const rankOfCard = hand[i].valör
		arrayWithRankOfCardsInHand.push(rankOfCard)
	}
	arrayWithRankOfCardsInHand.reverse()
	return arrayWithRankOfCardsInHand
}

function checkNumberOfPairs(hand) {
	const arrayWithRankOfCardsInHand = returnHandAsArrayOfRanks(hand)
	let numberOfPairs = 0
	for (let i = 0; i < valörer.length; i++) {
		if (Number(arrayWithRankOfCardsInHand.lastIndexOf(valörer[i])) - Number(arrayWithRankOfCardsInHand.indexOf(valörer[i])) === 1) {
			numberOfPairs += 1
		}
	}
	return numberOfPairs
}

function checkIfFourOfAKind(hand) {
	const arrayWithRankOfCardsInHand = returnHandAsArrayOfRanks(hand)
	for (let i = 0; i < valörer.length; i++) {
		if (Number(arrayWithRankOfCardsInHand.lastIndexOf(valörer[i])) - Number(arrayWithRankOfCardsInHand.indexOf(valörer[i])) === 3) {
			return true
		}
	}
	return false
}

function checkIfThreeOfAKind(hand) {
	const arrayWithRankOfCardsInHand = returnHandAsArrayOfRanks(hand)
	for (let i = 0; i < valörer.length; i++) {
		if (Number(arrayWithRankOfCardsInHand.lastIndexOf(valörer[i])) - Number(arrayWithRankOfCardsInHand.indexOf(valörer[i])) === 2) {
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
	arrayOfCardsForStraight.push(valörer[valörer.length - 1])
	arrayOfCardsForStraight = arrayOfCardsForStraight.concat(valörer.slice())
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
	if (hand.every((card) => card.färg === hand[0].färg)) {
		return true
	}
	return false
}

class playerHand {
	constructor() {
		this.cardsInHand = []
	}

	//draws a cards for this hand
	drawFullHand() {
		let handSize = this.cardsInHand.length
		for (let i = 0; i < (maxHandSize - handSize); i++) {
			this.cardsInHand.push(kortlek.draKort())
		}
	}

	sortHandRank() {
		const sortedHandRank = []
		for (let i = 0; i < valörer.length; i++) {
			for (let j = 0; j < this.cardsInHand.length; j++) {
				if (valörer[i] === this.cardsInHand[j].valör) {
					sortedHandRank.splice(0, 0, this.cardsInHand[j])
				}
			}
		}
		this.cardsInHand = sortedHandRank
	}

	sortHandSuit() {
		const sortedHandSuit = []
		for (let i = 0; i < färger.length; i++) {
			for (let j = 0; j < this.cardsInHand.length; j++) {
				if (färger[i] === this.cardsInHand[j].färg) {
					sortedHandSuit.splice(0, 0, this.cardsInHand[j])
				}
			}
		}
		this.cardsInHand = sortedHandSuit
	}

	printHand() {
		for (let i = 0; i < this.cardsInHand.length; i++) {
			console.log(`${this.cardsInHand[i].valör} of ${this.cardsInHand[i].färg}`)
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
player1Hand.drawFullHand()
player1Hand.sortHandSuit()
player1Hand.sortHandRank()
console.log()
player1Hand.printHand()
console.log(player1Hand.checkHand())

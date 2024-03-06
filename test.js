// ---- Test 1 ---- //

let a = false
let b = false

const recursiveFunction = () => {
    if (a === false && b === false) {
        console.log("player 1 turn")
        a = true
        recursiveFunction()
    } else if (a === true && b === false) {
        console.log("player 2 turn")
        b = true
        recursiveFunction()
    }
}

recursiveFunction()

// ---- Test 2 : class ---- //

class Hero {
    constructor(name, pv, atk) {
        this.name = name
        this.pv = pv
        this.atk = atk
        this.isAlive = true
        this.turn = true
        this.turnIsFinished = false
    }

    attack(target) {
        console.log(`${this.name} attacks ${target.name} and deals ${this.atk} damage.`)
        target.takeDamage(this.atk)
    }

    takeDamage(amount) {
        console.log(`${this.name} takes ${amount} damage.`)
        this.pv -= amount

        if (this.pv <= 0) {
            this.isAlive = false
            console.log(`${this.name} has been defeated.`)
        }
    }
}

class Boss {
    constructor(name, pv, atk) {
        this.name = name
        this.pv = pv
        this.atk = atk
        this.isAlive = true
        this.turn = false
        this.turnIsFinished = false
    }

    attack(target) {
        console.log(`${this.name} attacks ${target.name} and deals ${this.atk} damage.`)
        target.takeDamage(this.atk)
    }

    takeDamage(amount) {
        console.log(`${this.name} takes ${amount} damage.`)
        this.pv -= amount

        if (this.pv <= 0) {
            this.isAlive = false
            console.log(`${this.name} has been defeated.`)
        }
    }
}

class Battle {
    constructor(hero, boss) {
        this.hero = hero
        this.boss = boss
    }

    heroTurn() {
        console.log("heroTurn here")
        this.hero.attack(this.boss)

        if (this.boss.pv <= 0) {
            this.boss.isAlive = false
        }

        this.hero.turnIsFinished = true
    }

    bossTurn() {
        console.log("bossTurn here")
        this.boss.attack(this.hero)

        if (this.hero.pv <= 0) {
            this.hero.isAlive = false
        }

        this.boss.turnIsFinished = true
    }

    turnBasedLogic() {
        if (this.hero.turn === true && this.hero.isAlive === true) {
            this.heroTurn()
            this.hero.turn = false
            this.boss.turn = true
            this.turnBasedLogic()
        } else if (this.boss.turn === true && this.hero.turnIsFinished === true && this.boss.isAlive === true) {
            this.bossTurn()
            this.boss.turn = false
            this.hero.turn = true
            this.turnBasedLogic()
        }
    }

    startBattle() {
        this.turnBasedLogic()
    }
}

const hero = new Hero("Hero", 100, 10)
const boss = new Boss("Boss", 100, 10)
const battle = new Battle(hero, boss)

battle.startBattle()
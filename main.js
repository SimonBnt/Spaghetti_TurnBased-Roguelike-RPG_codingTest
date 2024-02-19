document.addEventListener("DOMContentLoaded", function () {
    const titleContainer = document.getElementById("titleContainer")
    const startGameTitle = document.getElementById("startGameTitle")
    const gameContainer = document.getElementById("gameContainer")
    const turnContainer = document.getElementById("turnContainer")
    const heroTurnContainer = document.getElementById("heroTurn")
    const bossTurnContainer = document.getElementById("bossTurn")
    const heroLifeBarContainer = document.getElementById("heroLifeBarContainer")
    const heroManaBarContainer = document.getElementById("heroManaBarContainer")
    const heroXpBarContainer = document.getElementById("heroXpBarContainer")
    const bossLifeBarContainer = document.getElementById("bossLifeBarContainer")
    const bossManaBarContainer = document.getElementById("bossManaBarContainer")
    const lvlUpModal = document.getElementById("lvlUpModal")
    const chest = document.getElementById("chestImg")
    const openChest = document.getElementById("openChest")
    const codex = document.getElementById("codex")
    const codexModal = document.getElementById("codexModal")
    const codexClosingBtn = document.getElementById("codexClosingBtn")
    const armor = document.getElementById("armor")
    const inventoryModal = document.getElementById("inventoryModal")
    const inventoryClosingBtn = document.getElementById("inventoryClosingBtn")
    // const lvlUpContainer = document.getElementById("lvlUpContainer")
    // const lvlUpCardsContainer = document.getElementById("lvlUpCardsContainer")
    // const lvlUpCardStat1 = document.getElementById("lvlUpCardStat1")
    // const lvlUpCardStat2 = document.getElementById("lvlUpCardStat2")
    // const lvlUpCardLoot = document.getElementById("lvlUpCardLoot")
    // const lvlUpCardItem = document.getElementById("lvlUpCardItem")
    // const lvlUpCards = document.querySelectorAll(".lvlUpCards")
    
    const gold = document.getElementById("gold")
    const soul = document.getElementById("soul")

    const heroName = document.getElementById("heroName")
    const heroLvl = document.getElementById("heroLvl")

    const bossName = document.getElementById("bossName")
    const bossLvl = document.getElementById("bossLvl")
    const bossImg = document.getElementById("bossImg")

    const gameStateContainer = document.getElementById("gameStateContainer")
    const waveContainer = document.getElementById("waveContainer")
    const itemPocket = document.getElementById("itemPocket")

    const atkBtn = document.getElementById("atkBtn")
    const itemBtn = document.getElementById("itemBtn")
    const healBtn = document.getElementById("healBtn")

    let hero = {
        name : "Hero",
        atk : 1,
        def : 1,
        hp : 20,
        maxHp : 20,
        int : 1,
        mana : 20,
        maxMana : 20,
        xp : 0,
        requiredXp : 100,
        lvl : 1,
        coinInPocket : 0,
        soulInPocket : 0,
        weight : 0,
        maxWeight : 100
    }

    let inventory = {
        equipement : {
            sword : {
                atk : 3,
                weight : 5 
            }
        },
        items : {}
    }

    let equipedEquipement = {
        head : null,
        neckless : null,
        chest : null,
        leftArm : null,
        rightArm : {
            atk : inventory.equipement.sword.atk,
            weight : inventory.equipement.sword.weight
        },
        leftRing : null,
        rightRing : null,
        greaves : null,
        boots : null,
    }

    // console.log(inventory.equipement.sword.atk)

    let boss = {
        name : "",
        atk : undefined,
        def : undefined,
        hp : undefined,
        maxHp : undefined,
        mana : 100,
        maxMana : 100,
        lvl : undefined,
        earnedGold : undefined,
        earnedSoul : undefined,
        earnedXp : undefined,
    }

    let mobImgs = {
        wolf : "img/mob/wolf.png",
        rat : "img/mob/rat.png",
        slime : "img/mob/slime.png",
        skeleton : "img/mob/skeleton.png"
    }

    let lvlUpStats = {
        atk : {
            stat : 1,
            img : "/img/loot/strength.png"
        },
        hp : {
            stat : 10,
            img : "/img/loot/health.png"
        }
    }

    let lvlUpLoots = {
        gold : {
            stat : hero.lvl * 50,
            img : "svg/coin.svg"
        },
        soul : {
            stat : hero.lvl * 100,   
            img : "svg/soul.svg"
        }
    }

    let lvlUpItems = {
        sword : {
            stat : 3,
            img : "img/loot/sword.png" 
        },
        hammer : {
            stat : 4,
            img : "img/loot/hammer.png"
        }
    }
    
    let actualWave = 1
    let isHeroTurn = true
    let isBossTurn = false

    // -- HUD -- //

    // const startGame = () => {
    //     titleContainer.style.display = "none"
    //     gameContainer.style.display = "block"
    //     turnContainer.style.display = "flex"
    // }

    const heroTurn = () => {
        turnContainer.style.display = heroTurnContainer.style.display = "block"
        setTimeout(() => turnContainer.style.display = heroTurnContainer.style.display = "none", 3000)
    }

    const bossTurn = () => {
        turnContainer.style.display = bossTurnContainer.style.display = "block"
        setTimeout(() => turnContainer.style.display = bossTurnContainer.style.display = "none", 3000)
    }

    const showWave = () => {
        waveContainer.innerHTML = `${actualWave}/10`
    }

    const showInfos = () => {
        heroName.innerHTML = hero.name
        heroLvl.innerHTML = `lvl ${hero.lvl}`
    
        bossName.innerHTML = boss.name
        bossLvl.innerHTML = `lvl ${boss.lvl}`
    }

    const showGoldAmount = (hero) => {
        gold.innerHTML = hero.coinInPocket
    }

    const showSoulAmount = (hero) => {
        soul.innerHTML = hero.soulInPocket
    }

    const createBar = (container, ratio, color) => {
        let barWidth = 100
        let bar = document.createElement("div")
        bar.style.width = `${barWidth * ratio}px`
        bar.style.background = color
        bar.classList.add("bar")
        container.appendChild(bar)
    }

    const createHeroBar = (hero) => {
        let lifeBarRatio = hero.hp / hero.maxHp
        let manaBarRatio = hero.mana / hero.maxMana
        let xpBarRatio = hero.xp / hero.requiredXp

        createBar(heroLifeBarContainer, lifeBarRatio, "green")
        createBar(heroManaBarContainer, manaBarRatio, "blue")
        createBar(heroXpBarContainer, xpBarRatio, "purple")
    }

    const createBossBar = (boss) => {
        let lifeBarRatio = boss.hp / boss.maxHp
        let manaBarRatio = boss.mana / boss.maxMana

        createBar(bossLifeBarContainer, lifeBarRatio, "green")
        createBar(bossManaBarContainer, manaBarRatio, "blue")
    }

    const updateHeroBars = () => {
        heroLifeBarContainer.innerHTML = ""
        heroManaBarContainer.innerHTML = ""
        heroXpBarContainer.innerHTML = ""

        createHeroBar(hero)
    }

    const updateBossBars = () => {
        bossLifeBarContainer.innerHTML = ""
        bossManaBarContainer.innerHTML = ""

        createBossBar(boss)
    }

    const openCodex = () => {
        codexModal.style.display = "flex"
    }

    const closeCodex = () => {
        codexModal.style.display = "none"
    }

    const openInventory = () => {
        inventoryModal.style.display = "flex"
    }

    const closeInventory = () => {
        inventoryModal.style.display = "none"
    }

    // -- FIGHT LOGIC -- //

    const heroAtk = () => {
        let damage = (hero.atk + equipedEquipement.rightArm.atk)
    
        if (boss.hp > 0) {
            boss.hp -= damage
    
            let message = `${hero.name} attacks and deals ${damage} damage to ${boss.name}!`
            gameStateContainer.innerHTML = message
    
            updateBossBars()
    
            if (boss.hp <= 0) {
                bossDeath(hero, boss)
                boss.hp = boss.maxHp
    
                if (hero.xp >= hero.requiredXp) {
                    lvlUp(hero)
                }
            }
    
            setTimeout(() => {
                generateBossAtk(hero)
            }, 1000)
        }
    }
    
    const generateBossAtk = (hero) => {
        let damage = boss.atk
    
        if (hero.hp > 0) {
            hero.hp -= damage
    
            let message = `${boss.name} attacks and deals ${damage} damage to ${hero.name}!`
            gameStateContainer.innerHTML = message
    
            updateHeroBars()
    
            if (hero.hp <= 0) {
                gameStateContainer.innerHTML = "GAME OVER"
                hero.hp = 0
            }
        }
    }

    const openItemPocket = () => {
        itemPocket.style.display = (itemPocket.style.display === "none") ? "flex" : "none"
    }

    const heroHeal = () => {
        let heal = (10 * hero.int)
        let healManaCost = (5 / hero.int)
        hero.mana -= healManaCost 

        if (hero.hp < hero.maxHp) {
            hero.hp += heal
    
            if (hero.hp > hero.maxHp) {
                hero.hp = hero.maxHp
            }
        }

        updateHeroBars()

        setTimeout(() => {
            generateBossAtk(hero)
        }, 1000)
    }

    const bossDeath = (hero, boss) => {
        createBoss(hero, boss)
        actualWave++

        hero.xp += boss.earnedXp 
        hero.coinInPocket += boss.earnedGold 
        hero.soulInPocket += boss.earnedSoul 

        showGoldAmount(hero)
        showSoulAmount(hero)
        updateHeroBars()
        showWave()

        let message = `${boss.name} is dead ! ${hero.name} earn ${boss.earnedGold} gold, ${boss.earnedSoul} soul and ${boss.earnedXp} xp.`

        if (actualWave === 10) {
            message = `${hero.name} reach wave 10, an elite boss is summoned from the deep !`

            eliteBoss(boss)
        }

        gameStateContainer.innerHTML = message
    }

    const lvlUp = (hero) => {
        hero.lvl++
        hero.xp = 0
        let message = `${hero.name} is now level ${hero.lvl}`
        gameStateContainer.innerHTML = message
        showInfos()

        lvlUpModal.style.display = "block"
        chest.src = "img/chest/closedChest.png"
        console.log(chest.src)

        let chestIsOpenned = false

        // chest.addEventListener("click", () => {
        openChest.addEventListener("click", () => {
            if (chestIsOpenned === false) {
                chestIsOpenned = true
                chest.src = "img/chest/openedChest.png"
                lvlUpCardsContainer.style.display = "flex"
    
                let selectedStatNumber1 = Math.floor(Math.random() * 2)
                let selectedStatNumber2 = Math.floor(Math.random() * 2)
                let selectedLootNumber = Math.floor(Math.random() * 2)
                let selectedItemNumber = Math.floor(Math.random() * 2)
    
                let selectedStat = undefined
                let selectedStat2 = undefined
                let selectedLoot = undefined
                let selectedItem = undefined
    
                let selectedStatImg = ""
                let selectedStatImg2 = ""
                let selectedLootImg = ""
                let selectedItemImg = ""
    
                let selectedStatP = ""
                let selectedStatP2 = ""
                let selectedLootP = ""
                let selectedItemP = ""
    
                switch (selectedStatNumber1) {
                    case 0 : 
                        selectedStat = lvlUpStats.atk.stat
                        selectedStatImg = lvlUpStats.atk.img
                        selectedStatP = "hero atk + 1"
                        break
                    case 1 :
                        selectedStat = lvlUpStats.hp.stat
                        selectedStatImg = lvlUpStats.hp.img
                        selectedStatP = "hero hp + 10"
                        break
                    default : 
                        console.log("stat1 undefined")
                }

                switch (selectedStatNumber2) {
                    case 0 : 
                        selectedStat2 = lvlUpStats.atk.stat
                        selectedStatImg2 = lvlUpStats.atk.img
                        selectedStatP2 = "hero atk + 1"
                        break
                    case 1 :
                        selectedStat2 = lvlUpStats.hp.stat
                        selectedStatImg2 = lvlUpStats.hp.img
                        selectedStatP2 = "hero hp + 10"
                        break
                    default : 
                        console.log("stat2 undefined")
                }
    
                switch (selectedLootNumber) {
                    case 0 : 
                        selectedLoot = lvlUpLoots.gold.stat
                        selectedLootImg = lvlUpLoots.gold.img
                        selectedLootP = `gold + ${lvlUpLoots.gold.stat}`
                        break
                    case 1 :
                        selectedLoot = lvlUpLoots.soul.stat
                        selectedLootImg = lvlUpLoots.soul.img
                        selectedLootP = `soul + ${lvlUpLoots.soul.stat}`
                        break
                    default : 
                        console.log("loot undefined")
                }
    
                switch (selectedItemNumber) {
                    case 0 : 
                        selectedItem = lvlUpItems.sword.stat
                        selectedItemImg = lvlUpItems.sword.img
                        selectedItemP = `hero atk + ${lvlUpItems.sword.stat}`
                        break
                    case 1 :
                        selectedItem = lvlUpItems.hammer.stat
                        selectedItemImg = lvlUpItems.hammer.img
                        selectedItemP = `hero atk + ${lvlUpItems.hammer.stat}`
                        break
                    default : 
                        console.log("item undefined")
                }
    
                // -- Stat Card 1 -- // 
                let lvlUpCardStat1Img = document.createElement("img")
                lvlUpCardStat1Img.classList.add("lvlUpCardImg")
                lvlUpCardStat1Img.src = selectedStatImg
    
                let lvlUpCardStat1P = document.createElement("p")
                lvlUpCardStat1P.classList.add("lvlUpCardP")
                lvlUpCardStat1P.innerHTML = selectedStatP

                // -- Stat Card 2 -- // 
                let lvlUpCardStat2Img = document.createElement("img")
                lvlUpCardStat2Img.classList.add("lvlUpCardImg")
                lvlUpCardStat2Img.src = selectedStatImg2
    
                let lvlUpCardStat2P = document.createElement("p")
                lvlUpCardStat2P.classList.add("lvlUpCardP")
                lvlUpCardStat2P.innerHTML = selectedStatP2

                // -- Loot Card -- // 
                let lvlUpCardLootImg = document.createElement("img")
                lvlUpCardLootImg.classList.add("lvlUpCardImg")
                lvlUpCardLootImg.src = selectedLootImg
    
                let lvlUpCardLootP = document.createElement("p")
                lvlUpCardLootP.classList.add("lvlUpCardP")
                lvlUpCardLootP.innerHTML = selectedLootP

                // -- Item Card -- // 
                let lvlUpCardItemImg = document.createElement("img")
                lvlUpCardItemImg.classList.add("lvlUpCardImg")
                lvlUpCardItemImg.src = selectedItemImg
    
                let lvlUpCardItemP = document.createElement("p")
                lvlUpCardItemP.classList.add("lvlUpCardP")
                lvlUpCardItemP.innerHTML = selectedItemP

                const lvlUpCards = document.querySelectorAll(".lvlUpCards")

                let cardsAreCreated = false

                if (!cardsAreCreated) {
                    let cardsElements = {
                        statCard1: {
                            img: lvlUpCardStat1Img,
                            p: lvlUpCardStat1P
                        },
                        statCard2: {
                            img: lvlUpCardStat2Img,
                            p: lvlUpCardStat2P
                        },
                        lootCard: {
                            img: lvlUpCardLootImg,
                            p: lvlUpCardLootP
                        },
                        itemCard: {
                            img: lvlUpCardItemImg,
                            p: lvlUpCardItemP
                        }
                    }

                    let cards = {
                        statCard1 : lvlUpCards[0],
                        statCard2 : lvlUpCards[1],
                        lootCard : lvlUpCards[2],
                        itemCard : lvlUpCards[3],
                    }

                    setTimeout(() => {
                        Object.keys(cards).forEach((card, i) => {
                            setTimeout(() => {
                                let img = cardsElements[card].img
                                let p = cardsElements[card].p
                        
                                cards[card].appendChild(img)
                                cards[card].appendChild(p)
    
                                cards[card].style.display = "flex"
                            }, i * 500)
                        })
                    }, 200) // ajust with chest openning animation time

                    // Object.keys(cards).forEach((card) => {
                    //     card.addEventListener("click", () => {
                    //         lvlUpModal.style.display = "none"
                    //     })
                    // }) 
                
                    cardsAreCreated = true
                }
            }
        })
    }

    // const createLvlUpCard = () => {

    // }

    const eliteBoss = (boss) => {
        const eliteSrc = "svg/boss.svg"
        bossImg.src = eliteSrc

        // boss.name = "Boss"
        // boss.maxHp = 200
        // boss.hp = boss.maxHp
        // boss.lvl = "??"
        // boss.earnedGold = 50
        // boss.earnedSoul = 100
        // boss.earnedXp = 100
    }

    const createBoss = (hero, boss) => {
        let selectedMobImg = mobImgs.wolf
        let selectedBossName = "Wolf"
        let selectedLvl = hero.lvl

        let selectedMobImgNumber = Math.floor(Math.random() * 4)
        let selectedStatNumber = Math.floor(Math.random() * 3)

        switch (selectedMobImgNumber) {
            case 0 : 
                selectedMobImg = mobImgs.wolf
                selectedBossName = "Wolf"
                break
            case 1 : 
                selectedMobImg = mobImgs.rat
                selectedBossName = "Rat"
                break
            case 2 : 
                selectedMobImg = mobImgs.slime
                selectedBossName = "Slime"
                break
            case 3 : 
                selectedMobImg = mobImgs.skeleton
                selectedBossName = "Skeleton"
                break
            default : 
                console.log("no img found")
        }

        switch (selectedStatNumber) {
            case 0 : 
                selectedLvl = hero.lvl
                break
            case 1 : 
                selectedLvl = (hero.lvl * 2)
                break
            case 2 : 
                selectedLvl = (hero.lvl * 3)
                break
            default : 
                console.log("null")
        }

        bossImg.src = selectedMobImg
        boss.name = selectedBossName
        boss.lvl = selectedLvl 
        boss.atk = (1 * selectedLvl)
        boss.def = (1 * selectedLvl)
        boss.maxHp = (20 * selectedLvl)
        boss.hp = boss.maxHp
        boss.earnedGold = (10 * selectedLvl)
        boss.earnedSoul = (10 * selectedLvl)
        boss.earnedXp = (10 * selectedLvl)
    }
    
    // -- GAME -- //

    const game = () => {
        heroTurn()
        // bossTurn()
        // startGameTitle.addEventListener("click", startGame)
        // lvlUp(hero)
        createBoss(hero, boss)
        showWave()
        showInfos()
        createHeroBar(hero)
        createBossBar(boss)
        showGoldAmount(hero)
        showSoulAmount(hero)
        
        

        atkBtn.addEventListener("click", heroAtk)
        itemBtn.addEventListener("click", openItemPocket)
        healBtn.addEventListener("click", heroHeal)
        codex.addEventListener("click", openCodex)
        codexClosingBtn.addEventListener("click", closeCodex)
        armor.addEventListener("click", openInventory)
        inventoryClosingBtn.addEventListener("click", closeInventory)
    } 

    game()
})
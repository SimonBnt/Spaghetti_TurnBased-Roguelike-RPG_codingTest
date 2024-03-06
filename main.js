document.addEventListener("DOMContentLoaded", function () {

    // -- DOM -- //

    const gameOver = document.getElementById("gameOver")
    const turnContainer = document.getElementById("turnContainer")
    const heroTurnContainer = document.getElementById("heroTurn")
    const bossTurnContainer = document.getElementById("bossTurn")
    const heroLifeBarContainer = document.getElementById("heroLifeBarContainer")
    const heroManaBarContainer = document.getElementById("heroManaBarContainer")
    const heroXpBarContainer = document.getElementById("heroXpBarContainer")
    const bossLifeBarContainer = document.getElementById("bossLifeBarContainer")
    const bossManaBarContainer = document.getElementById("bossManaBarContainer")
    const controllerContainer = document.getElementById("controllerContainer")

    const chestModal = document.getElementById("chestModal")
    const chest = document.getElementById("chestImg")
    const earnedGoldFromChestImg = document.getElementById("earnedGoldFromChestImg")
    const earnedGoldFromChest = document.getElementById("earnedGoldFromChest")

    const lvlUpModal = document.getElementById("lvlUpModal")
    // const openChest = document.getElementById("openChest")

    const codex = document.getElementById("codex")
    const codexModal = document.getElementById("codexModal")
    const codexClosingBtn = document.getElementById("codexClosingBtn")

    const armor = document.getElementById("armor")
    const inventoryModal = document.getElementById("inventoryModal")
    const inventoryClosingBtn = document.getElementById("inventoryClosingBtn")
    
    const goldAmount = document.getElementById("goldAmount")
    const coinImg = document.getElementById("coinImg")
    const soulAmount = document.getElementById("soulAmount")
    const soulImg = document.getElementById("soulImg")

    const heroImg = document.getElementById("heroImg")
    const heroName = document.getElementById("heroName")
    const heroLvl = document.getElementById("heroLvl")

    const bossName = document.getElementById("bossName")
    const bossLvl = document.getElementById("bossLvl")
    const bossImg = document.getElementById("bossImg")
    const bossChestImgContainer = document.getElementById("bossChestImgContainer")

    const gameStateContainer = document.getElementById("gameStateContainer")
    const waveContainer = document.getElementById("waveContainer")
    const bag = document.getElementById("bag")

    const controllBtns = document.querySelectorAll(".controllBtns");
    const atkBtn = document.getElementById("atkBtn")
    const itemBtn = document.getElementById("itemBtn")
    const healBtn = document.getElementById("healBtn")

    // -- OBJECTS -- //

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
        maxWeight : 100,

        isHeroTurn : true,
        isHeroAlive : true,
        isHeroTurnAnimationFinished : false,
        isHeroActionChoosed : false,

        heroDeath : () => {
            hero.isHeroAlive = false
            gameOver.style.display = "block"
        }
    }

    let loot = {

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

        isBossAlive : true,
        isBossTurn : false,
        isBossTurnAnimationFinished : false,
        isNewBossCanBeCreated : false,
        isBossWithChest : false,
        isBossActionChoosed : false,

        bossDeath : (hero) => {
            boss.maxHp = 0
            boss.hp = 0
            actualWave += 1
    
            hero.xp += boss.earnedXp 
            hero.coinInPocket += boss.earnedGold 
            hero.soulInPocket += boss.earnedSoul 
    
            showGoldAmount(hero)
            showSoulAmount(hero)
            updateHeroBars()
            showWave()
    
            let message = `${boss.name} is dead ! ${hero.name} earn ${boss.earnedGold} gold, ${boss.earnedSoul} soul and ${boss.earnedXp} xp.`
    
            if (boss.isBossWithChest) {
                let chanceToBeMimic = Math.floor(Math.random() * 100)

                if (chanceToBeMimic >= 1) {
                    console.log("Is a mimic")
                } else {
                    let chestIsOpen = false
                    chestModal.style.display = "block"
                    chest.src = "/img/chest/closedChest.png"
                    
                    chest.addEventListener("click", () => {
                        chest.src = "/img/chest/openedChest.png"
                        earnedGoldFromChestImg.style.display = "block"
                        
                        let earnedGold = (hero.lvl * 50) + (boss.lvl * 10)
                        
                        earnedGoldFromChest.innerHTML = earnedGold
                        chestIsOpen = true
                    })
    
                    if (chestIsOpen === true) {
                        isNewBossCanBeCreated = true
                    }
                }
            }
    
            // if (isNewBossCanBeCreated) {
            //     if (actualWave === 10) {
            //         message = `${hero.name} reach wave 10, an elite boss is summoned from the deep !`
            //         displayMessage(message, () => {
            //         })
        
            //         // eliteBoss(boss)
            //     } else {
            //         // createBoss(hero, boss)
            //         console.log("bite")
            //     }
            // }
    
            displayMessage(message, () => {})
        }
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

    // -- FLAGS VARIABLES -- //
    
    let actualWave = 1

    let isMessageHaveFinishToDisplay = false
    
    // -- HUD -- //

    const triggerGameOver = () => {
        gameOver.style.display = "block"
    }

    const openBag = () => {
        console.log("here")
        let bagIsOpen = false
        controllerContainer.style.display = "none"
        bag.style.display = "block"
        // bag.style.display = (bag.style.display === "none") ? "flex" : "none"

        if (bagIsOpen === false) {
            let messageToDisplayIsSelected = false
    
            if (messageToDisplayIsSelected === false) {
                messageToDisplayIsSelected = true
    
                let messageList = {
                    0 : "Our hero cracks open his bag and embarks on a quest of profound introspection, wondering, 'What mystical artifacts did I toss in here again?' Well, it's not just a bag; it's practically a wizard's wardrobe.",
                    1 : "Behold, the hero unzips the bag of mysteries! A moment of confusion ensues as he contemplates the cosmic puzzle inside. Who knew adventuring required advanced degrees in bag archaeology",
                    2 : "Our intrepid hero bravely unzips the bag, diving into the abyss of forgetfulness. It's not chaos; it's just his bag flexing its quantum storage capabilities. A black hole might envy this level of mystery!",
                    3 : "In the grand saga of bag exploration, our hero, armed with uncertainty and a trusty zipper, faces the eternal question: 'What's lurking in the depths of this bottomless pit?' Spoiler alert: It's more profound than a baguette.",
                    4 : "With bag in hand, our hero embarks on a daring search, contemplating the profound philosophy of 'What was I thinking?' Rumor has it that his bag is a direct descendant of Mary Poppins' enchanted luggage, minus the umbrella, of course."
                }
    
                let randomisedNumber = Math.floor(Math.random() * 5)
                let choosenMessageToDisplay = ""
    
                switch (randomisedNumber) {
                    case 0 : 
                        choosenMessageToDisplay = messageList[0]
                        break
                    case 1 : 
                        choosenMessageToDisplay = messageList[1]
                        break
                    case 2 : 
                        choosenMessageToDisplay = messageList[2]
                        break
                    case 3 : 
                        choosenMessageToDisplay = messageList[3]
                        break
                    case 4 : 
                        choosenMessageToDisplay = messageList[4]
                        break
                    default : console.log("no message found")
                }
    
                displayMessage(choosenMessageToDisplay, () => {})
            }
            bagIsOpen = true
        }
    }

    const displayMessage = async (message, callback) => {
        isMessageHaveFinishToDisplay = false
        gameStateContainer.textContent = ""
        
        let index = 0
        let delay = 20
        
        const displayNextLetter = () => {
            if (index < message.length) {
                gameStateContainer.textContent += message[index]
                index++
                setTimeout(displayNextLetter, delay)
            } else {
                if (callback) {
                    isMessageHaveFinishToDisplay = true
                    callback()
                }
            }
        }
        
        await new Promise(resolve => {
            displayNextLetter()
            setTimeout(resolve, message.length * delay)
        })
    }

    const toggleArrow = (parent, show) => {
        const arrows = parent.querySelector(".arrows")

        if (!arrows) {
            const arrow = document.createElement("img")
            arrow.src = "/img/hud/arrow.png"
            arrow.classList.add("arrows")
            arrow.alt = "arrow"

            parent.appendChild(arrow)
        } else {
            arrows.style.display = show ? "block" : "none"
        }
    }

    const heroTurnAnimation = (callback) => {
        isHeroTurnAnimationFinished = false
        let delay = 2000

        turnContainer.style.display = heroTurnContainer.style.display = "block"
        setTimeout(() => {
            turnContainer.style.display = heroTurnContainer.style.display = "none"
            isHeroTurnAnimationFinished = true
            callback()
        }, delay)
    }

    const bossTurnAnimation = (callback) => {
        isBossTurnAnimationFinished = false
        let delay = 2000

        turnContainer.style.display = bossTurnContainer.style.display = "block"
        setTimeout(() => {
            turnContainer.style.display = bossTurnContainer.style.display = "none" 
            isBossTurnAnimationFinished = true
            callback()
        }, delay)
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
        goldAmount.innerHTML = hero.coinInPocket 

        let coinImgSources = [
            "/img/coin/sprite_0.png",
            "/img/coin/sprite_1.png",
            "/img/coin/sprite_2.png",
            "/img/coin/sprite_3.png",
            "/img/coin/sprite_4.png",
            "/img/coin/sprite_5.png",
            "/img/coin/sprite_6.png",
            "/img/coin/sprite_7.png",
            "/img/coin/sprite_8.png",
        ]

        let currentIndex = 0

        function coinAnimation() {
            currentIndex = (currentIndex + 1) % coinImgSources.length
            const nextImg = coinImgSources[currentIndex]
            coinImg.src = nextImg
        }
    
        setInterval(coinAnimation, 100)
    }

    const showSoulAmount = (hero) => {
        soulAmount.innerHTML = hero.soulInPocket

        let soulImgSources = [
            "/img/soul/sprite_0.png",
            "/img/soul/sprite_1.png",
            "/img/soul/sprite_2.png",
            "/img/soul/sprite_3.png",
            "/img/soul/sprite_4.png",
            "/img/soul/sprite_5.png",
        ]

        let currentIndex = 0

        function soulAnimation() {
            currentIndex = (currentIndex + 1) % soulImgSources.length
            const nextImg = soulImgSources[currentIndex]
            soulImg.src = nextImg
        }
    
        setInterval(soulAnimation, 100)
    }

    const getColorByRatio = (ratio) => {
        if (ratio <= 0.3) {
            return "red"
        } else if (ratio <= 0.6) {
            return "orange"
        } else {
            return "green"
        }
    }

    const createBar = (container, initialRatio, color) => {
        let barWidth = 80
        let bar = document.createElement("div")
        bar.style.width = `${barWidth * initialRatio}px`
        bar.style.backgroundColor = color
        bar.classList.add("bar")
        container.appendChild(bar)
    }
    
    const createHeroBar = (hero) => {
        let lifeBarRatio = hero.hp / hero.maxHp
        let manaBarRatio = hero.mana / hero.maxMana
        let xpBarRatio = hero.xp / hero.requiredXp

        createBar(heroLifeBarContainer, lifeBarRatio, getColorByRatio(lifeBarRatio))
        createBar(heroManaBarContainer, manaBarRatio, "blue")
        createBar(heroXpBarContainer, xpBarRatio, "purple")
    }
    
    const createBossBar = (boss) => {
        let lifeBarRatio = boss.hp / boss.maxHp
        let manaBarRatio = boss.mana / boss.maxMana

        createBar(bossLifeBarContainer, lifeBarRatio, getColorByRatio(lifeBarRatio))
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

    const heroAtk = () => {
        let delay = 1000
        heroImg.classList.add("heroAtkAnimation")
        let damage = (hero.atk + equipedEquipement.rightArm.atk)
    
        if (boss.hp > 0) {
            // Simulate boss losing life unit by unit decrementally
            for (let i = 0; i < damage; i++) {
                setTimeout(() => {
                    boss.hp--
                    updateBossBars()
                }, (damage - i) * 50) // Adjust the timeout delay as needed
            }
    
            let message = `${hero.name} attacks and deals ${damage} damage to ${boss.name}!`
            displayMessage(message, () => {})
        }
    
        setTimeout(() => {
            heroImg.classList.remove("heroAtkAnimation")
        }, delay)
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

    // const heroAtk = () => {
    //     let delay = 1000
    //     heroImg.classList.add("heroAtkAnimation")
    //     let damage = (hero.atk + equipedEquipement.rightArm.atk)
    
    //     if (boss.hp > 0) {
    //         boss.hp -= damage
    
    //         let message = `${hero.name} attacks and deals ${damage} damage to ${boss.name}!`
            
    //         updateBossBars()

    //         displayMessage(message, () => {})
    //     } 
        
    //     setTimeout(() => {
    //         heroImg.classList.remove("heroAtkAnimation")
    //     }, delay)
    // }

    const heroHeal = () => {
        let heal = (10 * hero.int)
        let healManaCost = (5 / hero.int)
        hero.mana -= healManaCost 

        let message = `${hero.name} use heal and recover ${heal} health point, and use ${healManaCost} mana !`

        if (hero.hp < hero.maxHp) {
            hero.hp += heal
    
            if (hero.hp > hero.maxHp) {
                hero.hp = hero.maxHp
            }
        }

        updateHeroBars()

        displayMessage(message, () => {})
    }

    const lvlUp = (hero) => {
        hero.lvl++
        hero.xp = 0
        let message = `${hero.name} is now level ${hero.lvl}`

        displayMessage(message, () => {
        })

        showInfos()

        chest.src = "img/chest/closedChest.png"
        lvlUpModal.style.display = "block"

        let chestIsOpenned = false

        chest.addEventListener("click", () => {
        // openChest.addEventListener("click", () => {
            if (chestIsOpenned === false) {
                chestIsOpenned = true
                // openChest.style.display = "none"
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

                                cards[card].addEventListener("click", () => {
                                    switch (i) {
                                        case 0 : 
                                            console.log("1")
                                            console.log(selectedStat)
                                            break
                                        case 1 : 
                                            console.log("2")
                                            console.log(selectedStat2)
                                            break
                                        case 2 : 
                                            console.log("3")
                                            console.log(selectedLoot)
                                            console.log("selected weapon is" + selectedLoot)
                                            break
                                        case 3 : 
                                            console.log("4")
                                            console.log(selectedItem)
                                            console.log("selected item is" + selectedItem)

                                            break
                                        default :
                                            console.log("Unknown card")
                                    }
                                })

                                //   lvlUpModal.style.display = "none"

                            }, i * 500)
                        })
                    }, 200) // ajust with chest openning animation time

                    cardsAreCreated = true
                }
            }
        })
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

        createBossWithChest()
    }
    
    const createBossWithChest = () => {
        let selectedNumber = Math.floor(Math.random() * 100)    
        
        if (selectedNumber >= 80) {
            isBossWithChest = true
            bossChestImgContainer.style.display = "block"
            bossChestImgContainer.src = "/img/chest/closedChest.png"
        }
    }

    // const eliteBoss = (boss) => {
    //     const eliteSrc = "svg/boss.svg"
    //     bossImg.src = eliteSrc

    //     boss.name = "Boss"
    //     boss.maxHp = 200
    //     boss.hp = boss.maxHp
    //     boss.lvl = "??"
    //     boss.earnedGold = 50
    //     boss.earnedSoul = 100
    //     boss.earnedXp = 100
    // }

    const generateBossAtk = (hero) => {
        let delay = 1000
        bossImg.classList.add("bossAtkAnimation")
        let damage = boss.atk

        if (hero.hp > 0) {
            for (let i = 0; i < damage; i++) {
                setTimeout(() => {
                    hero.hp--
                    updateHeroBars()
                }, (damage - i) * 50) // Adjust the timeout delay as needed
            }
    
            let message = `${boss.name} attacks and deals ${damage} damage to ${hero.name}!`

            displayMessage(message, () => {})
        }

        setTimeout(() => {
            bossImg.classList.remove("bossAtkAnimation");
        }, delay);
    }

    // -- GAME -- //

    const game = () => {
        createBoss(hero, boss)
        showWave()
        showInfos()
        createHeroBar(hero)
        createBossBar(boss)
        showGoldAmount(hero)
        showSoulAmount(hero)

        const heroTurn = async () => {
            let canPerformNextTurn = false
            hero.isHeroActionChoosed = false
            
            await new Promise(resolve => {
                heroTurnAnimation(() => {
                    resolve()
                })
            })
            
            if (isHeroTurnAnimationFinished === true) {
                controllBtns.forEach(btn => btn.addEventListener("mouseover", function() {
                    toggleArrow(btn, true)
                }))
        
                controllBtns.forEach(btn => btn.addEventListener("mouseout", function() {
                    toggleArrow(btn, false)
                }))

                // const  heroHealHandler = () => {
                //     heroHeal()
                //     healBtn.removeEventListener("click", heroHealHandler)
                // }
                // healBtn.addEventListener("click", heroHealHandler)

                itemBtn.addEventListener("click", openBag)

                const atkHandlerPromise = new Promise(resolve => {
                    const atkHandler = () => {
                        heroAtk()
                        atkBtn.removeEventListener("click", atkHandler)
                        hero.isHeroActionChoosed = true
                        resolve()
                    }
                    
                    atkBtn.addEventListener("click", atkHandler)
                })

                await atkHandlerPromise
            }

            await new Promise(resolve => {
                let delay = 1000
    
                const checkFinish = () => {
                    if (isMessageHaveFinishToDisplay) {
                        resolve()
                    } else {
                        setTimeout(checkFinish, delay)
                    }
                }
    
                checkFinish()
            })

            if (boss.hp <= 0) {
                boss.isBossAlive = false
                boss.hp = 0
            }

            if (hero.isHeroActionChoosed === true && isMessageHaveFinishToDisplay === true) {
                hero.isHeroTurn = false
                boss.isBossTurn = true
                canPerformNextTurn = true
            }

            if (canPerformNextTurn === true) {
                performTurnBasedLogic()
            }
        }

        const bossTurn = async () => {
            let canPerformNextTurn = false
            boss.isBossActionChoosed = false

            await new Promise(resolve => {
                bossTurnAnimation(() => {
                    resolve()
                })
            })

            if (isBossTurnAnimationFinished === true) {
                generateBossAtk(hero)

                boss.isBossActionChoosed = true

                if (hero.hp <= 0) {
                    hero.heroDeath()
                }
            }

            await new Promise(resolve => {
                let delay = 1000
    
                const checkFinish = () => {
                    if (isMessageHaveFinishToDisplay) {
                        resolve()
                    } else {
                        setTimeout(checkFinish, delay)
                    }
                }
    
                checkFinish()
            })

            if (boss.isBossActionChoosed === true && isMessageHaveFinishToDisplay === true) {
                boss.isBossTurn = false
                hero.isHeroTurn = true
                canPerformNextTurn = true
            }

            if (canPerformNextTurn === true) {
                performTurnBasedLogic()
            }
        }

        const performTurnBasedLogic = () => {
            if (hero.isHeroTurn && hero.isHeroAlive) {
                heroTurn()
            } else  if (boss.isBossTurn === true && boss.isBossAlive) {
                bossTurn()
            } 
            
            if (hero.isHeroAlive === false) {
                console.log("hero is dead")
                triggerGameOver()
            }

            if (boss.isBossAlive === false) {
                updateBossBars(boss)
                console.log(boss.hp)
                console.log("boss is dead")
                // boss.bossDeath(hero)
                gameStateContainer.textContent = ""
                // createBoss(hero, boss)
                // performTurnBasedLogic()
            }
        }

        performTurnBasedLogic()
        
        codex.addEventListener("click", openCodex)
        codexClosingBtn.addEventListener("click", closeCodex)

        armor.addEventListener("click", openInventory)
        inventoryClosingBtn.addEventListener("click", closeInventory)
    } 

    game()
})
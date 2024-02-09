document.addEventListener("DOMContentLoaded", function () {
    const heroLifeBarContainer = document.getElementById("heroLifeBarContainer")
    const heroManaBarContainer = document.getElementById("heroManaBarContainer")
    const heroXpBarContainer = document.getElementById("heroXpBarContainer")
    const bossLifeBarContainer = document.getElementById("bossLifeBarContainer")
    const bossManaBarContainer = document.getElementById("bossManaBarContainer")
    const modal = document.getElementById("modal")
    const lvlUpContainer = document.getElementById("lvlUpContainer")
    const chest = document.getElementById("chest")

    const gold = document.getElementById("gold")
    const soul = document.getElementById("soul")

    const heroName = document.getElementById("heroName")
    const heroLvl = document.getElementById("heroLvl")

    const bossName = document.getElementById("bossName")
    const bossLvl = document.getElementById("bossLvl")
    const bossImg = document.getElementById("bossImg")

    const gameStateContainer = document.getElementById("gameStateContainer")
    const waveContainer = document.getElementById("waveContainer")

    const atkBtn = document.getElementById("atkBtn")
    // const defBtn = document.getElementById("defBtn")

    let hero = {
        name : "Simon",
        atk : 100,
        def : 2,
        hp : 100,
        maxHp : 100,
        mana : 100,
        maxMana : 100,
        xp : 0,
        requiredXp : 10,
        lvl : 1,
        coinInPocket : 0,
        soulInPocket : 0,
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
    }

    let mobImgs = {
        wolf : "img/mob/wolf.png",
        rat : "img/mob/rat.png",
        slime : "img/mob/slime.png",
        skeleton : "img/mob/skeleton.png"
    }

    // let boss = {
    //     name: "Egg",
    //     atk: 10,
    //     def: 2,
    //     hp: 100,
    //     maxHp: 100,
    //     mana: 100,
    //     maxMana: 100,
    //     lvl: 1,
    //     earnedGold: 10,
    //     earnedSoul: 10,
    //     earnedXp: 50,
    //     src : "/svg/egg.svg"
    // }
    
    let actualWave = 1

    // -- HUD LOGIC -- //

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
        bar.style.width = barWidth * ratio + "px"
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

    // -- FIGHT LOGIC -- //

    const heroAtk = () => {
        let damage = hero.atk - boss.def
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
        modal.style.display = "block"
        chest.src = "img/chest/closedChest.png"

        chest.addEventListener("click", () => {
            chest.src = "img/chest/openedChest.png"

            
        })

        hero.lvl++
        let message = `${hero.name} is now level ${hero.lvl}`
        gameStateContainer.innerHTML = message

        hero.xp = 0
        updateHeroBars()

        showInfos()
    }

    const eliteBoss = (boss) => {
        const eliteSrc = "svg/boss.svg"
        bossImg.src = eliteSrc

        boss.name = "Boss"
        boss.maxHp = 200
        boss.hp = boss.maxHp
        boss.lvl = "??"
        boss.earnedGold = 50
        boss.earnedSoul = 100
        boss.earnedXp = 100
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
        boss.atk = (2 * selectedLvl)
        boss.def = (1 * selectedLvl)
        boss.maxHp = (100 * selectedLvl)
        boss.hp = boss.maxHp
        boss.earnedGold = (10 * selectedLvl)
        boss.earnedSoul = (10 * selectedLvl)
        boss.earnedXp = (10 * selectedLvl)
    }
    
    // -- GAME -- //

    lvlUp(hero)
    createBoss(hero, boss)
    showWave()
    showInfos()
    createHeroBar(hero)
    createBossBar(boss)
    showGoldAmount(hero)
    showSoulAmount(hero)

    atkBtn.addEventListener("click", heroAtk)
})
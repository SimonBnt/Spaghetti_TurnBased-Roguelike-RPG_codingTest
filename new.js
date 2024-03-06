// Initialize hero and boss life points
let heroLife = 100
let bossLife = 100

// Function to simulate hero's attack
function heroAttack() {
    const damage = 10

    // Inflict damage to the boss
    // bossLife -= damage

    // Simulate boss losing life unit by unit decrementally
    for (let i = 0; i < damage; i++) {
        setTimeout(() => {
            bossLife--
            console.log(`Boss life: ${bossLife}`)
        }, (damage - i) * 100); // Adjust the timeout delay as needed
    }
}

// Example: Simulate hero attacking the boss
heroAttack()
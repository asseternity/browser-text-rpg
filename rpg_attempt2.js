let isPlayerExploring = false;
let moveOn = true;
// initialize spaces and buttons
let top_bar = document.querySelector('.top_bar');
let log_window = document.querySelector('.log');
let main_window = document.querySelector('.main_window');
let image_window = document.querySelector('.image_window');
let menu_window = document.querySelector('.menu');
let button_window = document.querySelector('.button_window');
let attack_button = document.querySelector('#attackButton');
let special_button = document.querySelector('#specialButton');
let inventory_button = document.querySelector('#inventoryButton');
let stats_button = document.querySelector('#statsButton');
// object constructor functions
function Character(name, attackBonus, armorClass, currentHP, maxHP, specialAttack, equippedWeapon, equippedArmor, equippedMisc, inventory) {
    this.name = name;
    this.attackBonus = attackBonus;
    this.armorClass = armorClass;
    this.currentHP = currentHP;
    this.maxHP = maxHP;
    this.specialAttack = specialAttack;
    this.equippedWeapon = '';
    this.equippedArmor = '';
    this.equippedMisc = '';
    this.inventory = [];
}

function Monster(name, monsterAttackBonus, armorClass, currentHP, maxHP, status) {
    this.name = name;
    this.monsterAttackBonus = monsterAttackBonus;
    this.armorClass = armorClass;
    this.currentHP = currentHP;
    this.maxHP = maxHP;
    this.status = status;
}
// hero.prototype attack method
Character.prototype.attack = function(selectedEnemy) {
    if (enemies.length !== 0) {
        if (selectedEnemy !== undefined) {
            enemies.forEach(enemy => {
                if (enemy.status == 'burning') {
                    enemy.currentHP = enemy.currentHP - 5;
                    isHeDead(enemy); 
                    let entry = document.createElement('p');
                    entry.textContent = `${enemy.name} is burning for 5 damage!`;
                    entry.setAttribute('style','color:yellow');
                    log_window.appendChild(entry);
                }
            });
            enemies.forEach(enemy => {
                enemy.status = '';
            });
            Array.from(log_window.children).forEach((entry) => {
                entry.setAttribute('style', 'color:white;');
            });
            if (selectedEnemy.currentHP > 0) {
                let attackRoll = Math.floor((Math.random() * 20) + 1 + this.attackBonus);
                if (char1.equippedWeapon !== '') {
                    attackRoll = attackRoll + this.equippedWeapon.itemAttack;
                }
                if (char1.equippedArmor !== '') {
                    attackRoll =+ attackRoll + this.equippedArmor.itemAttack;
                }
                if (char1.equippedMisc !== '') {
                    attackRoll =+ attackRoll + this.equippedMisc.itemAttack;
                }
                let extraComment = '';
                let extraAttack = 0;
                let extraDamage = 0;
                switch (this.specialAttack) {
                    case 'Normal Attack':
                        break;
                    case 'Bucket Splash':
                        extraComment = ' with the Bucket Splash (-2 accuracy, +2 damage if hits)';
                        extraAttack = -2;
                        extraDamage = +4;
                        break;
                    case 'Healing Twirl':
                        extraAttack = -1000;
                        break;
                    case 'Book Toss':
                        extraComment = ' with the Book Toss (-4 accuracy, but +6 damage if hits)';
                        extraAttack = -4;
                        extraDamage = +6;
                        break;
                    case 'Broom Smash':
                    case 'Capoiera Kick':
                        extraComment = ' with the Capoiera Kick (-4 accuracy, but stuns the target)';
                        extraAttack = -4;
                        if (attackRoll + extraAttack > selectedEnemy.armorClass) { selectedEnemy.status = 'stunned'; }
                        break;
                    case 'Torch Throw (to burn tax evasion evidence)':
                        extraComment = ' with the Torch Toss (usually used to burn away tax evasion evidence; -4 accuracy, but sets target on fire for one turn)';
                        extraAttack = -4;
                        if (attackRoll + extraAttack > selectedEnemy.armorClass) { selectedEnemy.status = 'burning'; }
                        break;                        
                }
                if (attackRoll + extraAttack > selectedEnemy.armorClass) {
                    selectedEnemy.currentHP -= attackRoll + extraAttack + extraDamage - selectedEnemy.armorClass;
                    let entry = document.createElement('p');
                    entry.textContent = `${this.name} attacks ${selectedEnemy.name}${extraComment}! The attack hits and deals ${attackRoll + extraAttack + extraDamage - selectedEnemy.armorClass} damage!`;
                    entry.setAttribute('style','color:yellow');
                    log_window.appendChild(entry);
                    isHeDead(selectedEnemy);
                    listEnemies();
                } else if (this.specialAttack == 'Healing Twirl') {
                    let healed;
                    let playerHPmissing = this.maxHP - this.currentHP;
                    if (playerHPmissing > 5) {
                        this.currentHP = this.currentHP + 5;
                        healed = 5;
                    } else if (playerHPmissing > 0) {
                        healed = playerHPmissing;
                        this.currentHP = this.maxHP;
                    } else {
                        healed = 0;
                    }
                    let entry = document.createElement('p');
                    entry.textContent = `${this.name} does a Healing Twirl, healing themself for ${healed} HP!`;
                    entry.setAttribute('style','color:yellow');
                    log_window.appendChild(entry);
                    menuUpdater();
                } else {
                    let entry = document.createElement('p');
                    entry.textContent = `${this.name} attacks ${selectedEnemy.name}! The attack misses!`;
                    entry.setAttribute('style','color:yellow');
                    log_window.appendChild(entry);
                }
                if (enemies.length !== 0) { 
                    enemies.forEach(enemy => {
                        if (enemy.status !== 'stunned') {
                            enemy.counterattack(); 
                        } else if (enemy.status == 'stunned') {
                            let entry = document.createElement('p');
                            entry.textContent = `${enemy.name} is stunned!`;
                            entry.setAttribute('style','color:yellow');
                            log_window.appendChild(entry);
                        }
                    }); 
                }
            }
        } else {
            let entry = document.createElement('p');
            entry.textContent = `Which monster do I attack?`;
            log_window.appendChild(entry);    
        }
    } else {
        let entry = document.createElement('p');
        entry.textContent = `No monsters around.`;
        log_window.appendChild(entry);
    }
}
// character classes
function Janitor(name, attackBonus, armorClass, currentHP, maxHP, specialAttack, equippedWeapon, equippedArmor, equippedMisc, inventory) {
    Character.call(this, name, attackBonus, armorClass, currentHP, maxHP, specialAttack, equippedWeapon, equippedArmor, equippedMisc, inventory);
}
function Accountant(name, attackBonus, armorClass, currentHP, maxHP, specialAttack, equippedWeapon, equippedArmor, equippedMisc, inventory) {
    Character.call(this, name, attackBonus, armorClass, currentHP, maxHP, specialAttack, equippedWeapon, equippedArmor, equippedMisc, inventory);
}
function Dancer(name, attackBonus, armorClass, currentHP, maxHP, specialAttack, equippedWeapon, equippedArmor, equippedMisc, inventory) {
    Character.call(this, name, attackBonus, armorClass, currentHP, maxHP, specialAttack, equippedWeapon, equippedArmor, equippedMisc, inventory);
}
// setting prototypes
Object.setPrototypeOf(Janitor.prototype, Character.prototype);
Object.setPrototypeOf(Accountant.prototype, Character.prototype); 
Object.setPrototypeOf(Dancer.prototype, Character.prototype); 
// character object
let char1 = new Character('Dude', 25, 15, 100, 100, 'Normal Attack', '', '', '', []); 
// enemies objects
let goblin_grunt = new Monster('Goblin', 0, 10, 40, 40, '');
let goblin_fighter = new Monster('Goblin Fighter', 2, 13, 25, 25, '');
let goblin_shaman = new Monster('Goblin Shaman', 3, 16, 30, 30, '');
let goblin_chieftain = new Monster('Goblin Chieftain', 5, 17, 40, 40, '');
let wizard = new Monster('Half Dead Old Guy', -1, 10, 5, 5, '');
let imp1 = new Monster('Red Imp', 0, 5, 5, 5, '');
let imp2 = new Monster('Blue Imp', 0, 5, 5, 5, '');
let enemies = [];
let enemyToAttack;
// change enemies function
function isHeDead(damagedEnemy) {
    if (damagedEnemy.currentHP <= 0) {
        let entry = document.createElement('p');
        entry.textContent = `${damagedEnemy.name} dies!`;
        entry.setAttribute('style','color:yellow');
        log_window.appendChild(entry);
        let deadMonsterID = enemies.findIndex(i => i.name == damagedEnemy.name);
        enemies.splice(deadMonsterID, 1);
        if (enemies.length == 0) {
            isBattleOver('win');
        }
    };
    if (char1.currentHP <= 0) {
        isBattleOver('lose');
    }
}

function listEnemies() {
    let board = document.querySelector('#explorationBoard');
    Array.from(image_window.children).forEach(entry => {
        if (entry !== board) {
            image_window.removeChild(entry);
        } 
    })
    enemies.forEach((thisEnemy) => {
        let enemy_entry = document.createElement('p');
        let enemy_button = document.createElement('button');
        enemy_entry.textContent = `${thisEnemy.name} stands there. It has AC of ${thisEnemy.armorClass}, attack bonus of ${thisEnemy.monsterAttackBonus} and HP of ${thisEnemy.currentHP}/${thisEnemy.maxHP}.`
        enemy_button.textContent = `Select`;
        enemy_button.setAttribute('id', thisEnemy.name);
        enemy_button.addEventListener('click', () => selectEnemy(thisEnemy));
        image_window.appendChild(enemy_entry);
        image_window.appendChild(enemy_button);
    });
}

function selectEnemy(enemy) {
    enemyToAttack = enemy;
    top_bar.textContent = `Selected enemy: ${enemy.name}.`;
}
// attack button
attack_button.addEventListener('click', () => char1.attack(enemyToAttack));
//enemy turn logic
Monster.prototype.counterattack = function() {
    let attackRoll =  Math.floor((Math.random() * 20) + 1) + this.monsterAttackBonus;
    if (attackRoll > char1.armorClass) {
        char1.currentHP -= attackRoll - char1.armorClass;
        menuUpdater();
        let entry = document.createElement('p');
        entry.textContent = `${this.name} attacks ${char1.name}! The attack hits and deals ${attackRoll - char1.armorClass} damage!`;
        entry.setAttribute('style','color:yellow');
        log_window.appendChild(entry);
    } else {
        let entry = document.createElement('p');
        entry.textContent = `${this.name} attacks ${char1.name}! The attack misses!`;
        entry.setAttribute('style','color:yellow');
        log_window.appendChild(entry);
    }
}
// special button that switches attack modes
let JanitorSpecials = ['Normal Attack', 'Bucket Splash', 'Broom Smash'];
let AccountantSpecials = ['Normal Attack', 'Book Toss', 'Torch Throw (to burn tax evasion evidence)'];
let DancerSpecials = ['Normal Attack', 'Healing Twirl', 'Capoiera Kick'];
let attackIndex = 0;
function switchAttack(char) {
    if (playerConsequences.includes('classJanitor') || playerConsequences.includes('classAccountant') || playerConsequences.includes('classDancer')) {
        if (char instanceof Janitor) {
            attackIndex = (attackIndex + 1) % JanitorSpecials.length;
            char.specialAttack = JanitorSpecials[attackIndex];
            let entry = document.createElement('p');
            entry.textContent = `${char.name} is ready to use ${char.specialAttack}.`;
            log_window.appendChild(entry);
        } else if (char instanceof Accountant) {
            attackIndex = (attackIndex + 1) % AccountantSpecials.length;
            char.specialAttack = AccountantSpecials[attackIndex];
            let entry = document.createElement('p');
            entry.textContent = `${char.name} is ready to use ${char.specialAttack}.`;
            log_window.appendChild(entry);
        } else if (char instanceof Dancer) {
            attackIndex = (attackIndex + 1) % DancerSpecials.length;
            char.specialAttack = DancerSpecials[attackIndex];
            let entry = document.createElement('p');
            entry.textContent = `${char.name} is ready to use ${char.specialAttack}.`;
            log_window.appendChild(entry);
        }
    }
}
//draw player stats
menu_window.textContent = `You are a person. Your class is unknown. Your armor class is ${char1.armorClass}. Your HP is ${char1.currentHP}/${char1.maxHP}.`;
//start battle
function startBattle(...encounterEnemies) {
    encounterEnemies.forEach((thisEnemy) => {
        thisEnemy.currentHP = thisEnemy.maxHP;
    });
    enemies = encounterEnemies;
    listEnemies();
}
// stats screen
let statsDialog = document.createElement('dialog');
statsDialog.innerHTML = `
    <button id='closeButton2'>Close</button>
    <div id='statsBox'>
    <h2>Stats</h2>
    <ul id ='statsList'>
        <li id='stats_gender'>You do not remember your gender.</li>
        <li id='stats_race'>You do not remember your race.</li>
        <li id='stats_romantic_partner'>You do not remember who your romantic partner was.</li>
        <li id='stats_cause_of_death'>You do not remember your cause of death.</li>
        <li id='stats_evil_benevolent'>
            <div class='stats_meter' id='stats_meter_evil'>
                <div class='stats_line' id='stats_line_evil'>Evil</div>
                <div class='stats_line' id='stats_line_benevolent'>Benevolent</div>
            </div>
        </li>
        <li id='stats_somber_silly'>
            <div class='stats_meter' id='stats_meter_somber'>
                <div class='stats_line' id='stats_line_somber'>Somber</div>
                <div class='stats_line' id='stats_line_silly'>Silly</div>
            </div>
        </li>
    </ul>
    </div>
`;
document.body.appendChild(statsDialog);
stats_button.addEventListener('click', () => {
    statsDialog.showModal();
    let closeButton2 = document.querySelector('#closeButton2');
    closeButton2.addEventListener('click', () => {
        statsDialog.close();
    })
})
// tracking and updating stats
let playerBenevolentBalance = 0;
let playerSillyBalance = 0;
function statsLinesUpdater() {
    let evilLine = document.querySelector('#stats_meter_evil');
    let somberLine = document.querySelector('#stats_meter_somber');
    evilLine.style.gridTemplateColumns = `${50-playerBenevolentBalance}fr ${50+playerBenevolentBalance}fr`;
    somberLine.style.gridTemplateColumns = `${50-playerSillyBalance}fr ${50+playerSillyBalance}fr`;
}
function giveStats(stat, amount) {
    switch (stat) {
        case 'evil':
            playerBenevolentBalance -= amount;
            break;
        case 'benevolent':
            playerBenevolentBalance += amount;
            break;
        case 'somber':
            playerSillyBalance -= amount;            
            break;
        case 'silly':
            playerSillyBalance += amount;
            break;
    }
    statsLinesUpdater();
    statsFlagsUpdater();
}
function statsFlagsUpdater() {
    let b15index = playerConsequences.findIndex(i => i == 'playerBenevolent15')
    playerConsequences.splice(b15index, 1);
    let b30index = playerConsequences.findIndex(i => i == 'playerBenevolent30')
    playerConsequences.splice(b30index, 1);
    let e15index = playerConsequences.findIndex(i => i == 'playerEvil15')
    playerConsequences.splice(e15index, 1);
    let e30index = playerConsequences.findIndex(i => i == 'playerEvil30')
    playerConsequences.splice(e30index, 1);
    let so15index = playerConsequences.findIndex(i => i == 'playerSomber15')
    playerConsequences.splice(so15index, 1);
    let so30index = playerConsequences.findIndex(i => i == 'playerSomber30')
    playerConsequences.splice(so30index, 1);
    let si15index = playerConsequences.findIndex(i => i == 'playerSilly15')
    playerConsequences.splice(si15index, 1);
    let si30index = playerConsequences.findIndex(i => i == 'playerSilly30')
    playerConsequences.splice(si30index, 1);
    if (playerBenevolentBalance > 14) {
        playerConsequences.push('playerBenevolent15');
        if (playerBenevolentBalance > 29) {
            playerConsequences.push('playerBenevolent30');
        }
    };
    if (playerBenevolentBalance < -14) {
        playerConsequences.push('playerEvil15');
        if (playerBenevolentBalance < -29) {
            playerConsequences.push('playerEvil30');
        }
    };
    if (playerSillyBalance > 14) {
        playerConsequences.push('playerSilly15');
        if (playerSillyBalance > 29) {
            playerConsequences.push('playerSilly30');
        }
    };
    if (playerSillyBalance < -14) {
        playerConsequences.push('playerSomber15');
        if (playerSillyBalance < -29) {
            playerConsequences.push('playerSomber15');
        }
    };
}
// ---inventory system---
// create a dialog window when we click on inventory
let inventoryDialog = document.createElement('dialog');
inventoryDialog.setAttribute('style','max-width:500px;')
inventoryDialog.innerHTML = `
    <button id='closeButton'>Close</button>
    <div id='inventoryBox'>
        <h2>Inventory</h2>
        <div id='equippedBox'>
            Equipped weapon: <span id='equippedWeaponBox'></span>
            <br>
            Equipped armor: <span id='equippedArmorBox'></span>
            <br>
            Equipped misc: <span id='equippedMiscBox'></span>
        </div>
        <br>
        <br>
        <div id='allBox'>
            Bag:
            <ul id='allList'>
            </ul>
        </div>
    </div>
`;
document.body.appendChild(inventoryDialog);
inventory_button.addEventListener('click', () => {
    inventoryDialog.showModal();
    let closeButton = document.querySelector('#closeButton');
    closeButton.addEventListener('click', () => {
        inventoryDialog.close();
    })
})
// grab elements from dialog
let equippedWeaponBox = document.querySelector('#equippedWeaponBox');
let equippedArmorBox = document.querySelector('#equippedArmorBox');
let equippedMiscBox = document.querySelector('#equippedMiscBox');
let allList = document.querySelector('#allList')
// to character, add the following keys: equippedWeapon, equippedArmor, equippedMisc, inventory = []
// let allItems = array of item objects
// the item object will have keys: type (weapon, armor or misc); itemAttack; itemArmor
function newItem(name, type, itemAttack, itemArmor, id) {
    return {
        name: name,
        type: type,
        itemAttack: itemAttack,
        itemArmor: itemArmor,
        id: id
    }
}
let magicSword = newItem('Magic Sword', 'weapon', 20, 0, 'n1');
let magicArmor = newItem('Magic Armor', 'armor', 0, 2, 'n2');
let magicRing = newItem('Magic Ring', 'misc', 1, 1, 'n3');
let ultraSword = newItem('Ultra Sword', 'weapon', 40, 0, 'n4');
let ultraArmor = newItem('Ultra Armor', 'armor', 0, 4, 'n5');
let ultraRing = newItem('Ultra Ring', 'misc', 2, 2, 'n6');
let rustySword = newItem('Rusty Sword', 'weapon', 1, 0, 'n7');
let rustyArmor = newItem('Rusty Armor', 'armor', 0, 1, 'n8');
let goldRing = newItem('Gold Ring', 'misc', 0, 1, 'n9');
let healthPotion = newItem('Health Potion', 'quest item', 0, 0, 'n10');
// when an object is grabbed, splice it from allItems and += it to char1.inventory
function grabItem(item) {
    char1.inventory.push(item);
    let itemBullet = document.createElement('li')
    itemBullet.textContent = `${item.name}, ${item.type}. Attack bonus: ${item.itemAttack}. Armor bonus: ${item.itemArmor}.`
    allList.appendChild(itemBullet);
    if (item.type !== 'quest item') {
        let equipButton = document.createElement('button');
        equipButton.addEventListener('click', () => equipItem(item));
        equipButton.textContent = 'Equip';
        equipButton.setAttribute('style', 'font-size: 70%;');
        equipButton.setAttribute('id', `${item.id}`);
        allList.appendChild(equipButton);
    }
}
// when an object is equipped, splice it from char1.inventory and make equippedWeapon = this item object
function equipItem(item) {
    if (char1.inventory.includes(item)) {
        switch (item.type) {
            case 'weapon':
                if (char1.equippedWeapon == '') {
                    char1.equippedWeapon = item;
                    char1.armorClass = char1.armorClass + char1.equippedWeapon.itemArmor;
                    equippedWeaponBox.textContent = `${item.name}`;
                    let equipButton = document.querySelector(`#${item.id}`);
                    equipButton.textContent = 'Unequip';
                    equipButton.removeEventListener('click', () => equipItem(item));
                    equipButton.addEventListener('click', () => unequipItem(item));   
                    menuUpdater();         
                } else {
                    // console.log('ERROR: please unequip your current item first')
                }
                break;
            case 'armor':
                if (char1.equippedArmor == '') {
                    char1.equippedArmor = item;
                    char1.armorClass = char1.armorClass + char1.equippedArmor.itemArmor;
                    equippedArmorBox.textContent = `${item.name}`;
                    let equipButton = document.querySelector(`#${item.id}`);
                    equipButton.textContent = 'Unequip';
                    equipButton.removeEventListener('click', () => equipItem(item));
                    equipButton.addEventListener('click', () => unequipItem(item));   
                    menuUpdater();         
                } else {
                    // console.log('ERROR: please unequip your current item first')
                }
                break;
            case 'misc':
                if (char1.equippedMisc == '') {
                    char1.equippedMisc = item;
                    char1.armorClass = char1.armorClass + char1.equippedMisc.itemArmor;
                    equippedMiscBox.textContent = `${item.name}`;
                    let equipButton = document.querySelector(`#${item.id}`);
                    equipButton.textContent = 'Unequip';
                    equipButton.removeEventListener('click', () => equipItem(item));
                    equipButton.addEventListener('click', () => unequipItem(item));   
                    menuUpdater();         
                } else {
                    // console.log('ERROR: please unequip your current item first')
                }
                break;
        }
    } else {
        // console.log('ERROR: you do not have this item in your inventory')
    }
}
// when an item is unequipped, make equippedWeapon = '' and push the item object to char1.inventory
function unequipItem(item) {
    if (char1.equippedWeapon == item || char1.equippedArmor == item || char1.equippedMisc == item) {
        if (char1.equippedWeapon == item) {
            char1.armorClass = char1.armorClass - char1.equippedWeapon.itemArmor;
            char1.equippedWeapon = '';
            equippedWeaponBox.textContent = ``;
        } else if (char1.equippedArmor == item) {
            char1.armorClass = char1.armorClass - char1.equippedArmor.itemArmor;
            char1.equippedArmor = '';
            equippedArmorBox.textContent = ``;
        } else if (char1.equippedMisc == item) {
            char1.armorClass = char1.armorClass - char1.equippedMisc.itemArmor;
            char1.equippedMisc = '';
            equippedMiscBox.textContent = ``;
        }
        menuUpdater();
        let equipButton = document.querySelector(`#${item.id}`);
        equipButton.textContent = 'Equip';
        equipButton.removeEventListener('click', () => unequipItem(item));
        equipButton.addEventListener('click', () => equipItem(item));
    } else {
        // console.log('ERROR: this item is not equipped;')
    }
}

// ---menu text updater function---
function menuUpdater() {
    if (char1 instanceof Janitor) {
        menu_window.textContent = `You are ${char1.name}. Your are a Janitor. Your armor class is ${char1.armorClass}. Your HP is ${char1.currentHP}/${char1.maxHP}.`;
    } else if (char1 instanceof Accountant) {
        menu_window.textContent = `You are ${char1.name}. Your are an Accountant. Your armor class is ${char1.armorClass}. Your HP is ${char1.currentHP}/${char1.maxHP}.`;
    } else if (char1 instanceof Dancer) {
        menu_window.textContent = `You are ${char1.name}. Your are a Dancer. Your armor class is ${char1.armorClass}. Your HP is ${char1.currentHP}/${char1.maxHP}.`;
    } else {
        menu_window.textContent = `You are ${char1.name}. Your class is unknown. Your armor class is ${char1.armorClass}. Your HP is ${char1.currentHP}/${char1.maxHP}.`;
    }
}
// --- NEW SYSTEM (CURRENTLY TESTING) ---
// initialize images
let iconTree = document.createElement('img'); iconTree.setAttribute('style','height:15px;width:15px;fill:white;'); iconTree.src = 'tree.png';
let iconTree2 = document.createElement('img'); iconTree2.setAttribute('style','height:15px;width:15px;fill:white;'); iconTree2.src = 'tree.png';
// class storyElement { type(dialogue, choice, battle, description, item); text = []; 
// modifiers(for battle: array of enemies, for choice/dialogue: choices, for item: item name);
// nextStory }
class storyElement {
    constructor(type, text, modifiers, nextStoryElement) {
        this.type = type;
        this.text = text;
        this.modifiers = modifiers;
        this.nextStoryElement = nextStoryElement;
        storyElement.instances.push(this);
    }
    static instances = [];
    static getAllInstances() {
        return storyElement.instances;
    }
}
// update storyElements
function newUpdateNames(answer) {
    let allStoryElements = storyElement.getAllInstances();
    for (let i = 0; i < allStoryElements.length; i++) {
        switch (allStoryElements[i].type) {
            case 'description':
            case 'item':
            case 'battle':
            case 'choice':
            case 'exploration':
            case 'randomEncounter':
            case 'form':
                for (let j = 0; j < allStoryElements[i].text.length; j++) {
                    allStoryElements[i].text[j] = allStoryElements[i].text[j].replaceAll('Dude', answer); 
                }
                break;
            case 'dialogue':
                for (let j = 0; j < allStoryElements[i].text.length; j++) {
                    allStoryElements[i].text[j].npcLine = allStoryElements[i].text[j].npcLine.replaceAll('Dude', answer);
                    for (let k = 0; k < allStoryElements[i].text[j].responses.length; k++) {
                        allStoryElements[i].text[j].responses[k].dialogueChoice = allStoryElements[i].text[j].responses[k].dialogueChoice.replaceAll('Dude', answer);
                    }
                }
                break;
            case 'consequence':
                for (let j = 0; j < allStoryElements[i].text.length; j++) {
                    for (let k = 0; k < allStoryElements[i].text[j].consequenceText.length; k++) {
                        allStoryElements[i].text[j].consequenceText[k] = allStoryElements[i].text[j].consequenceText[k].replaceAll('Dude', answer); 
                    }
                }
                break;
        }
    }
    menu_window.textContent = menu_window.textContent.replace('a person', answer);
}
// objects of this class will be ALL that I have to edit
let randomEvent2b = new storyElement(
    'description',
    ['Holy ballsacks, what a fight.', 'Welp, back to exploring.'],
    'explorationEvent',
    undefined
)
let randomEvent2a = new storyElement(
    'battle',
    ['Encounter 2 is pissed though.', 'Oh, it is super pissed.', 'Time to fight!'],
    [goblin_grunt],
    randomEvent2b
)
let randomEvent2 = new storyElement(
    'randomEncounter',
    ['You just found random encounter 2!'],
    {hasPlayerSeenMe: false},
    randomEvent2a
)
let randomEvent1a = new storyElement(
    'item',
    ['This event is nice! It gives you an item!'],
    magicArmor,
    undefined
)
let randomEvent1 = new storyElement(
    'randomEncounter',
    ['You just found random encounter 1!'],
    {hasPlayerSeenMe: false},
    randomEvent1a
)
let testExploration = new storyElement(
    'exploration',
    ['You set out on the road again.', 'The forest is lush and hard to walk through.', 'The stranger was right - it will be hard to find your way here.'],
    [{encounterStoryElement: randomEvent1, tileNumber: '#tile30', icon: iconTree},
    {encounterStoryElement: randomEvent2, tileNumber: '#tile100', icon: iconTree2}],
    undefined
)
let testAfterDialogue = new storyElement(
    'consequence',
    [{dependency: 'StrangerFriendly', consequenceText: [
        'You hope that person winds what they are looking for.',
        'Oh, well. You have your own needs to take care of, Dude.']},
    {dependency: 'StrangerAnnoyed', consequenceText: [
        'Well that person was a jerk. Not like Dude.',
        'What a shit-faced poopster.']}],
    undefined,
    testExploration
)
let testDialogue = new storyElement(
    'dialogue',
    [{ lineNumber: 0, npcLine: 'You see a person. They approach, and say: "Hello!".', responses: 
        [{ dialogueChoice: 'And hello to you kind person! My name is Dude.', dialogueNextLine: 1, points: 1 },
        { dialogueChoice: 'Hello, more like hyulo! Dude here.', dialogueNextLine: 2, points: -1 }]},
    { lineNumber: 1, npcLine: '"Well, hi, Dude. Nice to see a polite individual around these parts! How are you today?"', responses: 
        [{ dialogueChoice: 'I am doing well.', dialogueNextLine: 3, points: 1 },
        { dialogueChoice: 'I need help...', dialogueNextLine: 4, points: -1 }]},
    { lineNumber: 2, npcLine: '"Dude, I do not speak this foul-sounding language of yours," they say, sounding concerned. "Are you okay?".', responses: 
        [{ dialogueChoice: 'I am doing well.', dialogueNextLine: 3, points: 1 },
        { dialogueChoice: 'I need help...', dialogueNextLine: 4, points: 0 }]},
    { lineNumber: 3, npcLine: '"Glad to hear it. Well, stay safe out there."', responses: 
        [{ dialogueChoice: 'Goodbye, and good luck.', dialogueNextLine: 5, points: 1 },
        { dialogueChoice: 'Oh, piss off already.', dialogueNextLine: 5, points: -1 }]},
    { lineNumber: 4, npcLine: '"Wish I could help you, friend. God bless."', responses: 
        [{ dialogueChoice: 'It is alright. Take care of yourself, stranger.', dialogueNextLine: 5, points: 1 },
        { dialogueChoice: 'Thanks for nothing...', dialogueNextLine: 5, points: -1 }]},
    { lineNumber: 5, npcLine: 'The stranger says goodbye and leaves.', responses: []}],
    ['StrangerFriendly', 'StrangerNeutral', 'StrangerAnnoyed'],
    testAfterDialogue
) 
let testChoiceOutcome2 = new storyElement(
    'description',
    ['You chose 2.'],
    undefined,
    testDialogue
) 
let testChoiceOutcome1 = new storyElement(
    'description',
    ['You chose 1.'],
    undefined,
    testDialogue
) 
let testChoice = new storyElement(
    'choice',
    ['Hello!', 'This is the new introduction 2.', 'Fun again, is it not?', 'Certainly is.', 'Again. But now it is time to choose: 1 or 2?'],
    [{choiceText: 'I will choose 1.',
    choiceModifiers: 'testChoice1',
    choiceNextStory: testChoiceOutcome1},
    {choiceText: 'I will choose 2.',
    choiceModifiers: 'testChoice2',
    choiceNextStory: testChoiceOutcome2}],
    undefined
) 
let testItem = new storyElement(
    'item',
    ['Enemies are dead!', 'This description has more strings.', 'Like one more.', 'Thank you for your patience.', 'As a reward, here is an item.'],
    magicSword,
    testChoice
) 
let testBattle = new storyElement(
    'battle',
    ['Well now it is time to play!', 'This array has fewer strings too! Muahahaha.', 'It is a fight!'],
    [imp1, imp2, goblin_chieftain, goblin_fighter],
    testItem
) 
let testDescription = new storyElement(
    'description',
    ['Hello, Dude!', 'This is a new introduction.', 'Fun, is it not?', 'Certainly is.'],
    undefined,
    testBattle
)
let testClass = new storyElement(
    'choice',
    ['Now it is time to choose your class.', 'Choose wisely.', 'Or just clickity-clack.'],
    [{choiceText: 'Janitor.',
    choiceModifiers: 'classJanitor',
    choiceNextStory: testDescription},
    {choiceText: 'Accountant.',
    choiceModifiers: 'classAccountant',
    choiceNextStory: testDescription},
    {choiceText: 'Dancer.',
    choiceModifiers: 'classDancer',
    choiceNextStory: testDescription}],
    undefined    
)
let testNaming = new storyElement(
    'form',
    ['Hello!', 'Please enter your name.'],
    undefined,
    testClass
)
// the function is ALWAYS static
// function story(type, text, modifiers)
function storyTeller(storyElement) {
    while (main_window.firstChild) {main_window.removeChild(main_window.firstChild)};
    if (storyElement !== undefined) {
        if (storyElement.type !== 'dialogue' && storyElement.type !== 'consequence') {
            textFlipper(storyElement, 0);
        } else if (storyElement.type == 'dialogue') {
            newDialogueMaker(storyElement, 0);
        } else {
            consequenceShower(storyElement, 0);
        }
    } else {}
}
//--- supplementary functions ---
// new continue button operator
let announcement;
function textFlipper(storyElement, loop, style) {
    if (storyElement.type == 'randomEncounter' || storyElement.modifiers == 'explorationEvent') { moveOn = false; }
    let storyParagraph = document.createElement('p');
    storyParagraph.textContent = storyElement.text[loop];
    if (style == 'yellow') { storyParagraph.setAttribute('style','color:yellow;'); }
    main_window.appendChild(storyParagraph);
    if (loop < storyElement.text.length) {
        let continueButton = document.createElement('button');
        continueButton.textContent = 'Click here to continue.';
        main_window.appendChild(continueButton);
        continueButton.focus();
        continueButton.addEventListener('click', () => {
            loop++;
            textFlipper(storyElement, loop);
            main_window.removeChild(continueButton);
            if (loop == storyElement.text.length) {
                switch (storyElement.type) {
                    case 'description':
                        storyTeller(storyElement.nextStoryElement);
                        break;
                    case 'battle':
                        newBattleStarter(storyElement);
                        break;
                    case 'item':
                        grabItem(storyElement.modifiers);
                        announcement = { text: [`Acquired ${storyElement.modifiers.name}!`], type: 'itemAcquired', nextStoryElement: storyElement.nextStoryElement };
                        textFlipper(announcement, 0, 'yellow');
                        break;
                    case 'itemAcquired':
                        storyTeller(announcement.nextStoryElement);
                        break;
                    case 'choice':
                        newChoice(storyElement);
                        break;
                    case 'exploration':
                        newExploration(storyElement);
                        isPlayerExploring = true;
                        break;
                    case 'randomEncounter':
                        while (main_window.firstChild) { main_window.removeChild(main_window.firstChild) };
                        storyElement.modifiers.hasPlayerSeenMe = true;
                        moveOn = true;
                        storyTeller(storyElement.nextStoryElement);
                        break;
                    case 'form':
                        newFormMaker(storyElement);
                        break;
                }
                if (storyElement.modifiers == 'explorationEvent') {
                    moveOn = true;
                }
            }
        })
    }
}
// consequence function
function consequenceShower(storyElement, line) {
    let entry = document.createElement('p');
    let correctConsequence = null;
    for (let i = 0; i < storyElement.text.length; i++) {
        if (playerConsequences.includes(storyElement.text[i].dependency)) {
            correctConsequence = i;
        }
    }
    if (correctConsequence !== null) {
        entry.textContent = storyElement.text[correctConsequence].consequenceText[line];
        main_window.appendChild(entry);
        if (line < storyElement.text[correctConsequence].consequenceText.length) {
            let continueButton = document.createElement('button');
            continueButton.textContent = 'Click here to continue.';
            main_window.appendChild(continueButton);
            continueButton.focus();
            continueButton.addEventListener('click', () => {
                line++;
                main_window.removeChild(continueButton);
                consequenceShower(storyElement, line);
            })
        }
        if (line == storyElement.text[correctConsequence].consequenceText.length) {
            storyTeller(storyElement.nextStoryElement);
        }
    } else {
        storyTeller(storyElement.nextStoryElement);
    }
}
// new dialogue function
// each conversation is not like a dialogue tree in a videogame, but a sliding waterfall.
let relationshipMeter = 0;
function newDialogueMaker(storyElement, line) {
    let npcDialogueLine = document.createElement('p');
    npcDialogueLine.textContent = storyElement.text[line].npcLine;
    main_window.appendChild(npcDialogueLine);
    if (line !== storyElement.text.length - 1) {
        storyElement.text[line].responses.forEach((response) => {
            let responseButton = document.createElement('button');
            responseButton.textContent = response.dialogueChoice;
            main_window.appendChild(responseButton);
            responseButton.setAttribute('class', 'choiceButton');
            responseButton.addEventListener('click', () => {
                let dialogueButtons = main_window.querySelectorAll('button');
                dialogueButtons.forEach(button => {
                    button.remove();
                });
                let yourLine = document.createElement('p');
                yourLine.textContent = `"${response.dialogueChoice}"`;
                main_window.appendChild(yourLine);
                relationshipMeter = relationshipMeter + response.points;
                newDialogueMaker(storyElement, response.dialogueNextLine);
            })
        })
    } else {
        if (relationshipMeter <= -2) {
            playerConsequences.push(storyElement.modifiers[2]);
        } else if (relationshipMeter < 2) {
            playerConsequences.push(storyElement.modifiers[1]);
        } else if (relationshipMeter >= 2) {
            playerConsequences.push(storyElement.modifiers[0]);
        }
        relationshipMeter = 0;
        let continueButton = document.createElement('button');
        continueButton.textContent = 'Click here to continue.';
        main_window.appendChild(continueButton);
        continueButton.focus();
        continueButton.addEventListener('click', () => {
            storyTeller(storyElement.nextStoryElement);
        });
    }
}
// new choice function
let playerConsequences = [];
function newChoice(storyElement) {
    storyElement.modifiers.forEach((thisChoice) => {
        let choiceButton = document.createElement('button');
        choiceButton.textContent = thisChoice.choiceText;
        choiceButton.setAttribute('class','choiceButton');
        main_window.appendChild(choiceButton);
        choiceButton.addEventListener('click', () => {
            playerConsequences.push(thisChoice.choiceModifiers);
            if (thisChoice.choiceModifiers == 'classJanitor') {
                char1 = new Janitor(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
                menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are a Janitor.');
                special_button.addEventListener('click', () => { switchAttack(char1) });    
            } else if (thisChoice.choiceModifiers == 'classAccountant') {
                char1 = new Accountant(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
                menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are an Accountant.');
                special_button.addEventListener('click', () => { switchAttack(char1) });    
            } else if (thisChoice.choiceModifiers == 'classDancer') {
                char1 = new Dancer(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
                menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are a Dancer.');
                special_button.addEventListener('click', () => { switchAttack(char1) });     
            }
            storyTeller(thisChoice.choiceNextStory);
        });
    })
}
// new battle functions
let storyAfterBattle = null;
function newBattleStarter(storyElement) {
    storyElement.modifiers.forEach((currentEnemy) => { currentEnemy.currentHP = currentEnemy.maxHP });
    enemies = storyElement.modifiers;
    storyAfterBattle = storyElement;
    let board = document.querySelector('#explorationBoard');
    if (board !== null) { board.style.display = 'none'; }
    listEnemies();
}
function isBattleOver(battleResult) {
    if (battleResult == 'win') {
        if (isPlayerExploring == true) {
            let board = document.querySelector('#explorationBoard');
            board.style.display = 'grid';        
        }    
        let entry = document.createElement('p');
        entry.textContent = 'You win the battle!';
        log_window.appendChild(entry);
        while (log_window.children.length > 2) { log_window.removeChild(log_window.firstChild) };
        Array.from(log_window.children).forEach((entry) => {
            entry.setAttribute('style', 'color:white;');
        });
        top_bar.removeChild(top_bar.firstChild);
        while (main_window.firstChild) { main_window.removeChild(main_window.firstChild) };
        storyTeller(storyAfterBattle.nextStoryElement);
        storyAfterBattle = null;    
    } else {
        let entry = document.createElement('p');
        entry.textContent = 'You died!';
        entry.setAttribute('style', 'color:red;');
        log_window.appendChild(entry);
        button_window.removeChild(attack_button);
        button_window.removeChild(special_button);
        button_window.removeChild(inventory_button);
        button_window.removeChild(stats_button);
    }
}
// new exploration functions
function newExploration(storyElement) {
    while (main_window.firstChild) {main_window.removeChild(main_window.firstChild)};
    let board = document.createElement('div');
    board.setAttribute('id', 'explorationBoard');
    let boardUnder = document.createElement('div');
    boardUnder.setAttribute('style', 'border-collapse:collapse; margin:3px; display:inline-grid; grid-template-columns: repeat(6, 25px);')
    image_window.appendChild(board);
    board.appendChild(boardUnder);
    for (let i = 0; i < 126; i++) {
        let tile = document.createElement('div');
        tile.setAttribute('style','padding:5px;border:1px solid white;height:15px;width:15px;');
        tile.setAttribute('id', `tile${i}`);
        boardUnder.appendChild(tile);
    }
    drawIcons(storyElement);
    // draw buttons for mobile
    let buttonsMovement = document.createElement('div');
    buttonsMovement.setAttribute('id', 'buttonsMovement');
    board.appendChild(buttonsMovement);
    let upButton = document.createElement('button');
    upButton.setAttribute('id', 'upButton');
    upButton.textContent = 'Up';
    buttonsMovement.appendChild(upButton);
    let downButton = document.createElement('button');
    downButton.setAttribute('id', 'upButton');
    downButton.textContent = 'Down';
    buttonsMovement.appendChild(downButton);
    let leftButton = document.createElement('button');
    leftButton.setAttribute('id', 'upButton');
    leftButton.textContent = 'Left';
    buttonsMovement.appendChild(leftButton);
    let rightButton = document.createElement('button');
    rightButton.setAttribute('id', 'upButton');
    rightButton.textContent = 'Right';
    buttonsMovement.appendChild(rightButton);
    // circle inside the squares
    let circle = document.createElement('div');
    circle.setAttribute('style','position:absolute;background-color:white;border:1px solid white;border-radius:50%; z-index:10; height: 17px; width: 17px;');
    circle.setAttribute('tabindex', '0');
    let centerTile = document.querySelector('#tile50');
    centerTile.appendChild(circle);
    let circleX = 0;
    let circleY = 0;
    let step = 5;
// WASD to move the circle
    document.addEventListener('keydown', (event) => {
        let circleCollision = circle.getBoundingClientRect();
        let boardCollision = board.getBoundingClientRect();
        switch (event.key) {
            case 'w':
                if (circleCollision.top - step > boardCollision.top && moveOn == true) {
                    circleY -= step;
                    tileTriggers(whichTileIsPlayerOn(circle), storyElement);
                }
                break;
            case 'a':
                if (circleCollision.left - step > boardCollision.left && moveOn == true) {
                    circleX -= step;
                    tileTriggers(whichTileIsPlayerOn(circle), storyElement);
                }
                break;
            case 's':
                if (circleCollision.bottom + step < boardCollision.bottom && moveOn == true) {
                    circleY += step;
                    tileTriggers(whichTileIsPlayerOn(circle), storyElement);
                }
                break;
            case 'd':
                if (circleCollision.right + step < boardCollision.right && moveOn == true) {
                    circleX += step;
                    tileTriggers(whichTileIsPlayerOn(circle), storyElement);
                }
                break;
        }
        circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    })
    // buttons
    upButton.addEventListener('click', () => {
        let circleCollision = circle.getBoundingClientRect();
        let boardCollision = board.getBoundingClientRect();
        if (circleCollision.top - step > boardCollision.top && moveOn == true) {
            circleY -= step;
            tileTriggers(whichTileIsPlayerOn(circle), storyElement);
        }
        circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    });
    downButton.addEventListener('click', () => {
        let circleCollision = circle.getBoundingClientRect();
        let boardCollision = board.getBoundingClientRect();
        if (circleCollision.bottom + step < boardCollision.bottom && moveOn == true) {
            circleY += step;
            tileTriggers(whichTileIsPlayerOn(circle), storyElement);
        }
        circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
});
    leftButton.addEventListener('click', () => {
        let circleCollision = circle.getBoundingClientRect();
        let boardCollision = board.getBoundingClientRect();
        if (circleCollision.left - step > boardCollision.left && moveOn == true) {
            circleX -= step;
            tileTriggers(whichTileIsPlayerOn(circle), storyElement);
        }
        circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
});
    rightButton.addEventListener('click', () => {
        let circleCollision = circle.getBoundingClientRect();
        let boardCollision = board.getBoundingClientRect();
        if (circleCollision.right + step < boardCollision.right && moveOn == true) {
            circleX += step;
            tileTriggers(whichTileIsPlayerOn(circle), storyElement);
        }
        circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
});
}
// when a player moves, it is triggered. returns "#tile30" type number
function whichTileIsPlayerOn(circle) {
    let circleCollision = circle.getBoundingClientRect();
    let tiles = document.querySelectorAll('[id^="tile"]');
    for (let i = 0; i < tiles.length; i++) {
        let tileCollision = tiles[i].getBoundingClientRect();
        if (
            circleCollision.left < tileCollision.right &&
            circleCollision.right > tileCollision.left &&
            circleCollision.top < tileCollision.bottom &&
            circleCollision.bottom > tileCollision.top 
        ) {
            return tiles[i].id;
        }
    }
    return null;
}
// compares the tile id from above and activates a storyElement
function tileTriggers(playersTile, storyElement) {
    // clear main window
        while (main_window.firstChild) { main_window.removeChild(main_window.firstChild) };
    // activate an event
        for (let i = 0; i < storyElement.modifiers.length; i++) {
            if (`#${playersTile}` == storyElement.modifiers[i].tileNumber && !storyElement.modifiers[i].encounterStoryElement.modifiers.hasPlayerSeenMe) {
                storyTeller(storyElement.modifiers[i].encounterStoryElement);
            }
        }
    }    
// draw icons on tiles
function drawIcons(storyElement) {
    let tiles = document.querySelectorAll('[id^="tile"]');
    for (let i = 0; i < tiles.length; i++) {
        for (let j = 0; j < storyElement.modifiers.length; j++)
        {
            if (`#${tiles[i].id}` == storyElement.modifiers[j].tileNumber) {
                tiles[i].style.position = 'relative';
                storyElement.modifiers[j].icon.style.position = 'absolute';
                tiles[i].appendChild(storyElement.modifiers[j].icon);
            }
        }
    }
}
// new character creation function
function newFormMaker(storyElement) {
    let form_card = document.createElement('div');
    let form = document.createElement('form');
    let input = document.createElement('input');
    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    input.setAttribute('type', 'text');
    form.appendChild(input);
    form.appendChild(submit);
    form_card.appendChild(form);
    main_window.appendChild(form_card);
    submit.addEventListener('click', (event) => {
        event.preventDefault();
        answer = input.value;
        char1.name = answer;
        newUpdateNames(answer);
        while (main_window.firstChild) { main_window.removeChild(main_window.firstChild); }
        storyTeller(storyElement.nextStoryElement);
    })
}
// TESTER. start game
storyTeller(testExploration);

// TO DO LIST.
// story
// put exploration events into their own js files separated by the area. use webpack!
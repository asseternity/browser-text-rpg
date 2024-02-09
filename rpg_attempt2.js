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
let trade_button = document.querySelector('#tradeButton');
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

function Monster(name, armorClass, currentHP, maxHP, status) {
    this.name = name;
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
                    log_window.appendChild(entry);
                }
            });
            while (image_window.firstChild) { image_window.removeChild(image_window.firstChild) };
            listEnemies();
            enemies.forEach(enemy => {
                enemy.status = '';
            })
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
                console.log(attackRoll)
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
                    case 'Book Toss':
                        extraComment = ' with the Book Toss (-4 accuracy, but +6 damage if hits)';
                        extraAttack = -4;
                        extraDamage = +6;
                        break;
                    case 'Capoiera Kick':
                        extraComment = ' with the Capoiera Kick (-4 accuracy, but stuns the target)';
                        extraAttack = -4;
                        if (attackRoll + extraAttack > selectedEnemy.armorClass) { selectedEnemy.status = 'stunned'; }
                        break;
                    case 'Flaming Lasso':
                        extraComment = ' with the Flaming Lasso (-4 accuracy, but sets target on fire for one turn)';
                        extraAttack = -4;
                        if (attackRoll + extraAttack > selectedEnemy.armorClass) { selectedEnemy.status = 'burning'; }
                        break;                        
                }
                if (attackRoll + extraAttack > selectedEnemy.armorClass) {
                    selectedEnemy.currentHP -= attackRoll + extraAttack + extraDamage - selectedEnemy.armorClass;
                    let entry = document.createElement('p');
                    entry.textContent = `${this.name} attacks ${selectedEnemy.name}${extraComment}! The attack hits and deals ${attackRoll + extraAttack + extraDamage - selectedEnemy.armorClass} damage!`;
                    log_window.appendChild(entry);
                    isHeDead(selectedEnemy);
                    while (image_window.firstChild) { image_window.removeChild(image_window.firstChild) };
                    listEnemies();
                } else {
                    let entry = document.createElement('p');
                    entry.textContent = `${this.name} attacks ${selectedEnemy.name}! The attack misses!`;
                    log_window.appendChild(entry);
                }
                if (enemies.length !== 0) { 
                    enemies.forEach(enemy => {
                        if (enemy.status !== 'stunned') {
                            enemy.counterattack(); 
                        } else if (enemy.status == 'stunned') {
                            let entry = document.createElement('p');
                            entry.textContent = `${enemy.name} is stunned!`;
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
let goblin_grunt = new Monster('Goblin', 10, 20, 20, '');
let goblin_fighter = new Monster('Goblin Fighter', 13, 25, 25, '');
let goblin_shaman = new Monster('Goblin Shaman', 16, 30, 30, '');
let goblin_chieftain = new Monster('Goblin Chieftain', 17, 40, 40, '');
let wizard = new Monster('Half Dead Old Guy', 10, 5, 5, '');
let imp1 = new Monster('Red Imp', 5, 5, 5, '');
let imp2 = new Monster('Blue Imp', 5, 5, 5, '');
let enemies = [];
let enemyToAttack;
// change enemies function
function isHeDead(damagedEnemy) {
    if (damagedEnemy.currentHP <= 0) {
        let entry = document.createElement('p');
        entry.textContent = `${damagedEnemy.name} dies!`;
        log_window.appendChild(entry);
        let deadMonsterID = enemies.findIndex(i => i.name == damagedEnemy.name);
        enemies.splice(deadMonsterID, 1);
        if (enemies.length == 0) {
            isBattleOver('win');
        };
    };
    if (char1.currentHP <= 0) {
        isBattleOver('lose');
    }
}

function listEnemies() {
    while (image_window.firstChild) { image_window.removeChild(image_window.firstChild) };
    enemies.forEach((thisEnemy) => {
        let enemy_entry = document.createElement('p');
        let enemy_button = document.createElement('button');
        enemy_entry.textContent = `${thisEnemy.name} stands there. It has AC of ${thisEnemy.armorClass} and HP of ${thisEnemy.currentHP}/${thisEnemy.maxHP}.`
        enemy_button.textContent = `Select`;
        enemy_button.setAttribute('id', thisEnemy.name);
        enemy_button.addEventListener('click', () => selectEnemy(thisEnemy));
        image_window.appendChild(enemy_entry);
        image_window.appendChild(enemy_button);
    });
}

listEnemies();

function selectEnemy(enemy) {
    enemyToAttack = enemy;
    top_bar.textContent = `Selected enemy: ${enemy.name}.`;
}
// attack button
attack_button.addEventListener('click', () => char1.attack(enemyToAttack));
//enemy turn logic
Monster.prototype.counterattack = function() {
    let attackRoll =  Math.floor((Math.random() * 20) + 1);
    if (attackRoll > char1.armorClass) {
        char1.currentHP -= attackRoll - char1.armorClass;
        menuUpdater();
        let entry = document.createElement('p');
        entry.textContent = `${this.name} attacks ${char1.name}! The attack hits and deals ${attackRoll - char1.armorClass} damage!`;
        log_window.appendChild(entry);
    } else {
        let entry = document.createElement('p');
        entry.textContent = `${this.name} attacks ${char1.name}! The attack misses!`;
        log_window.appendChild(entry);
    }
}
// special button that switches attack modes
let JanitorSpecials = ['Normal Attack', 'Bucket Splash'];
let AccountantSpecials = ['Normal Attack', 'Book Toss'];
let DancerSpecials = ['Normal Attack', 'Capoiera Kick', 'Flaming Lasso'];
let attackIndex = 0;
function switchAttack(char) {
    if (currentStoryPoint > 0) {
        if (char instanceof Janitor) {
            attackIndex = (attackIndex + 1) % JanitorSpecials.length;
            char.specialAttack = JanitorSpecials[attackIndex];
            let entry = document.createElement('p');
            entry.textContent = `${char.name} is ready to use his ${char.specialAttack}.`;
            log_window.appendChild(entry);
        } else if (char instanceof Accountant) {
            attackIndex = (attackIndex + 1) % AccountantSpecials.length;
            char.specialAttack = AccountantSpecials[attackIndex];
            let entry = document.createElement('p');
            entry.textContent = `${char.name} is ready to use his ${char.specialAttack}.`;
            log_window.appendChild(entry);
        } else if (char instanceof Dancer) {
            attackIndex = (attackIndex + 1) % DancerSpecials.length;
            char.specialAttack = DancerSpecials[attackIndex];
            let entry = document.createElement('p');
            entry.textContent = `${char.name} is ready to use his ${char.specialAttack}.`;
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
// //finish battle
// function isBattleOver(battleResult) {
//     if (battleResult == 'win') {
//         while (log_window.children.length > 1) { log_window.removeChild(log_window.firstChild) };
//         enemyToAttack == undefined;
//         top_bar.removeChild(top_bar.firstChild);
//         while (main_window.firstChild) { main_window.removeChild(main_window.firstChild) };
//         currentStoryPoint++;
//         story[currentStoryPoint](0);
//     } else {   
//         let entry = document.createElement('p');
//         entry.textContent = `You died!`;
//         log_window.appendChild(entry);
//         button_window.removeChild(attack_button);
//         button_window.removeChild(move_button);
//         button_window.removeChild(talk_button);
//         button_window.removeChild(trade_button);
//     }
// }
// ---inventory system---
// create a dialog window when we click on inventory
let inventoryDialog = document.createElement('dialog');
inventoryDialog.setAttribute('style','max-width:600px;')
inventoryDialog.innerHTML = `
    <button id='closeButton' style='margin-left:500px;font-size:80%;'>Close</button>
    <div id='inventoryBox'>
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
            Inventory:
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
// finally, in the attack method, add references to this.equippedWeapon.itemAttack
// when an item is equipped, recalculate this.armorClass and redraw the menu screen
// add DOM manipulation interface

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
// ---map system--
// draw a bunch of squares in the map_area in a square
// it should activate in free roam mode, and be able to alternate between 'story' and 'exploration'
// so it should be a function: explorationModeActivator(tileset)
// tileset is an object with the info on how many squares to generate
// what's on the squares, what events and icons, etc
// for now, a function explorationModeActivator that: 
let moveOn = true;
function explorationModeActivator(tileset) {
// (1) clears the screen entirely
    while (image_window.firstChild) {image_window.removeChild(image_window.firstChild)};
// (2) asks you: READY TO FREE ROAM?
    let entry = document.createElement('p');
    entry.textContent = 'Time to explore the surroundings. Am I ready? [Use WASD to move]'
    main_window.appendChild(entry);
    let button = document.createElement('button');
    button.textContent = 'I am ready!'
    main_window.appendChild(button);
    button.addEventListener('click', () => {
        explorationGo(tileset);
    })
}
// (3) once you click yes, draws squares in the map_area
function explorationGo(tileset) {
    while (main_window.firstChild) {main_window.removeChild(main_window.firstChild)};
    let board = document.createElement('div');
    board.setAttribute('style', 'border-collapse:collapse; margin:3px; display:inline-grid; grid-template-columns: repeat(6, 25px);')
    image_window.appendChild(board);
    for (let i = 0; i < 126; i++) {
        let tile = document.createElement('div');
        tile.setAttribute('style','padding:5px;border:1px solid white;height:15px;width:15px;');
        tile.setAttribute('id', `tile${i}`);
        board.appendChild(tile);
    }
// (4) circle inside the squares
    let circle = document.createElement('div');
    circle.setAttribute('style','position:absolute;background-color:white;border:1px solid white;border-radius:50%; z-index:10; height: 17px; width: 17px;');
    circle.setAttribute('tabindex', '0');
    let centerTile = document.querySelector('#tile50');
    centerTile.appendChild(circle);
    let circleX = 0;
    let circleY = 0;
    let step = 5;
// (5) WASD to move the circle
    document.addEventListener('keydown', (event) => {
        let circleCollision = circle.getBoundingClientRect();
        let boardCollision = board.getBoundingClientRect();
        switch (event.key) {
            case 'w':
                if (circleCollision.top - step > boardCollision.top && moveOn == true) {
                    circleY -= step;
                    tileTriggers(whichTileIsPlayerOn(circle), tileset);

                }
                break;
            case 'a':
                if (circleCollision.left - step > boardCollision.left && moveOn == true) {
                    circleX -= step;
                    tileTriggers(whichTileIsPlayerOn(circle), tileset);
                }
                break;
            case 's':
                if (circleCollision.bottom + step < boardCollision.bottom && moveOn == true) {
                    circleY += step;
                    tileTriggers(whichTileIsPlayerOn(circle), tileset);
                }
                break;
            case 'd':
                if (circleCollision.right + step < boardCollision.right && moveOn == true) {
                    circleX += step;
                    tileTriggers(whichTileIsPlayerOn(circle), tileset);
                }
                break;
        }
        circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    })
}
// (6) console.log eventListeners which square did the player enter 
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
// ---tile event logic section---
// class of tile objects
class ex1Tile {
    constructor(name, number, icon, initializerEvent) {
        this.name = name,
        this.number = number,
        this.icon = icon,
        this.initializerEvent = initializerEvent
    }
    getID() {
        return `#tile${this.number}`;
    }
}
// a couple of example ex1tiles
let ex1Health = new ex1Tile('Health Potion', 70, '', initializer_ex1Health);
let ex1GoblinChief = new ex1Tile('Goblin Chief', 100, '', '');
// these exploration events should be in a different array, EACH
// array of all special tiles. each item of the array is an object with an image and a story initializer
let ex1Tiles = [ex1Health, ex1GoblinChief]
// drawIcons is in a separate function
function drawIcons(tiles_objects) { 
    let tiles_divs = document.querySelectorAll('[id^="tile"]');
    for (let i = 0; i <= tiles_divs.length; i++) {
        for (let j = 0; j <= tiles_objects.length; j++) {
            if (tiles_divs[i] == tiles_objects[j].getID) {
                let icon = document.createElement('img');
                icon.src = tiles_objects[j].icon;
                tiles_divs[i].appendChild(icon);                
            }
        }
    }
}
// function tileTriggers(tileNumber)
// connect the tileTriggers function with whichTilePlayerIsOn. WhichTile will return a tileID, which tileSettings will take for event
function tileTriggers(tileID, tileset) {
// this function will
// (1) clear main window
    while (main_window.firstChild) { main_window.removeChild(main_window.firstChild) };
// (2) activate an event
    for (let i = 0; i < tileset.length; i++) {
        if (`#${tileID}` == tileset[i].getID()) {
            tileset[i].initializerEvent(0);
        }
    }
}
// ---story logic section---
// confirm next step with an enter press
// so i need to make a thing that will be created inside the forEach loop
// that thing will say 'press something' and remove itself once pressed and call the next part of the story
// maybe a function that takes an intro chapter, adds the text to the mother div 
function continuer(currentInitializer, nextIndex) {
    let pressSomething = document.createElement('button');
    pressSomething.textContent = `Click here to continue.`;
    main_window.appendChild(pressSomething);
    pressSomething.focus();
    function continuerHandlePress() {
        story[currentInitializer](nextIndex);
        main_window.removeChild(pressSomething);
    }
    pressSomething.addEventListener(`click`, continuerHandlePress);
    pressSomething.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
            continuerHandlePress();
        }
    })
}
//dialogue system
function dialogueChoice(...choices) {
    let options = choices;
    options.forEach((currentChoice) => {
        let entry = document.createElement('button');
        entry.textContent = currentChoice.text;
        main_window.appendChild(entry);
        entry.addEventListener('click', () => {
            currentChoice.modifier();
            while (main_window.firstChild) { main_window.removeChild(main_window.firstChild) };
            currentChoice.outcome(0);
            currentStoryPoint = currentChoice.storyPoint;   
        })
    })
}
// character creation system
// Incorporate a new intro, before the current one
let creation1 = 'You walk around, suddenly feeling nostalgic and reminiscing about your life.';
let creation2 = 'First of all, what did your parents name you?';
let creationStory = [creation1, creation2];
// Add the new intro to the story
function initializeCreation(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = creationStory[chapterIndex];
    main_window.appendChild(entry);
    if (chapterIndex+1 <= creationStory.length) {
        continuer(story.findIndex(i => i == initializeCreation), chapterIndex+1);
    }
    if (chapterIndex+1 > creationStory.length) {
        formMaker((story.findIndex(i => i == initializeCreation) + 1));
    }
    // <-- THIS CODE CONTINUES TO NEXT SECTION IF THERE ISN'T A FORM, BATTLE OR CHOICE -->
    // if (chapterIndex+1 > creationStory.length) {
    //     let oldText = main_window.querySelectorAll('p');
    //     oldText.forEach(entry => {
    //         main_window.removeChild(entry);
    //     });
    //     story[story.findIndex(i => i == initializeIntro)](0);
    // }
}
// The same way as buttons are created, create a div, and inside of that giv, a form and a submit
function formMaker(nextStory) {
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
        updateNames(answer);
        while (main_window.firstChild) { main_window.removeChild(main_window.firstChild); }
        currentStoryPoint++;
        story[nextStory](0);
    })
}
function updateNames(answer) {
    for (let i = 0; i < storyStrings.length; i++) {
        for (let j = 0; j < storyStrings[i].length; j++) {
            storyStrings[i][j] = storyStrings[i][j].replaceAll(`Dude`, answer);
        }
    }
    menu_window.textContent = menu_window.textContent.replace('a person', answer);
}
// Only spawn the next thing and remove the div once the submit happens
// Lead each class choice to an object creator function?
// class selection story
let creationB1 = `Dude, exactly. Such a pretty name.`;
let creationB2 = `You had an ordinary childhood.`;
let creationB3 = `Sure it was spent in poverty, but then you went on to find a job of your own. What was it?.`;
// let creation5;
// if (char1 instanceof Janitor) {
//     creation5 = `Janitor, of course. Well, someone's gotta do it. In any case, you are on your first mission for your new employer.`
// } else if (char1 instanceof Accountant) {
//     creation5 = `Accountant. How fun. In any case, you are on your first mission for your new employer.`
// }
let creationStoryB = [creationB1, creationB2];
function initializeCreationB(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = creationStoryB[chapterIndex];
    main_window.appendChild(entry);
    let choice1 = { 
        text: 'I struggled in life and became a janitor.', 
        outcome: initializeCreationC, 
        storyPoint: story.findIndex(i => i == initializeCreationC), 
        modifier: function() { 
            char1 = new Janitor(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
            menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are a Janitor.');
            special_button.addEventListener('click', () => { switchAttack(char1) });
        } 
    };
    let choice2 = { 
        text: `It's not fun, but it pays the bills... I'm an accountant.`, 
        outcome: initializeCreationC, 
        storyPoint: story.findIndex(i => i == initializeCreationC), 
        modifier: function() { 
            char1 = new Accountant(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
            menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are an Accountant.');
            special_button.addEventListener('click', () => { switchAttack(char1) }); } 
    };
    let choice3 = { 
        text: `I channelled my struggles into my art. I am... a dancer!`, 
        outcome: initializeCreationC, 
        storyPoint: story.findIndex(i => i == initializeCreationC), 
        modifier: function() { 
            char1 = new Dancer(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
            menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are a Dancer.');
            special_button.addEventListener('click', () => { switchAttack(char1) }); } 
    };
    if (chapterIndex+1 <= creationStoryB.length) {
        continuer(story.findIndex(i => i == initializeCreationB), chapterIndex+1);
    }
    if (chapterIndex >= creationStoryB.length) {
        dialogueChoice(choice1, choice2, choice3);
    }
};
// [PART 1] intro - get items
let creationC1 = 'You keep walking through the woods, remembering your job.';
let creationC2 = 'Your job as the newest employee of the Blue Inferno mercenary company... what was it?';
let creationC3 = 'Ah, yes. Collect yourself, Dude. It was to rid the forest of a wizard that took refuge there.';
let creationC4 = 'To make sure your mission was successful, you brought your only belonging in this world.';
let creationStoryC = [creationC1, creationC2, creationC3, creationC4];
function initializeCreationC(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = creationStoryC[chapterIndex];
    main_window.appendChild(entry);
    let choice1 = { 
        text: `My mother's rusty sword.`, 
        outcome: initializeIntro, 
        storyPoint: story.findIndex(i => i == initializeIntro),
        modifier: function() { grabItem(rustySword) } 
    };
    let choice2 = { 
        text: 'I slapped together some armor out of some garbage. Pretty proud of it, actually.', 
        outcome: initializeIntro, 
        storyPoint: story.findIndex(i => i == initializeIntro), 
        modifier: function() { grabItem(rustyArmor) }
     };
    if (chapterIndex+1 <= creationStoryC.length) {
        continuer(story.findIndex(i => i == initializeCreationC), chapterIndex+1);
    }
    if (chapterIndex >= creationStoryC.length) {
        dialogueChoice(choice1, choice2);
    }
};
// [PART 1] intro - story strings
let intro1 = `Dude travels through a dark forest. Spindly trees grow around them.`;
let intro2 = `Suddenly, Dude hears a noise up in the trees. It sounds like cackling.`;
let intro3 = `Then, two dark shadows jumps ot of the tree, directly into Dude's path. Two goblins block the road!`
let intro4 = `The larger goblin brandishes a dull cutlass and jeers at Dude. "Time to die, rat!" It's a fight!`
let intros = [intro1, intro2, intro3, intro4];
// [PART 1] intro - initializer function
function initializeIntro(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = intros[chapterIndex];
    main_window.appendChild(entry);
    if (chapterIndex+1 <= intros.length) {
        continuer(story.findIndex(i => i == initializeIntro), chapterIndex+1);
    }
    if (chapterIndex >= intros.length) {
        startBattle(goblin_grunt, goblin_fighter);
    }
};
// [PART 2] intro 2 - story strings
let introB1 = `The goblins now dead, Dude continues their path in the forest.`
let introB2 = `Dude encounters a bearded man in the forest.`
let introB3 = `The bearded man is wearing wizard robes. He lies in the grass, and appears to be injured.` 
let introB4 = `He speaks in a hoarse voice. "Child, please bring me a health potion."`
let introsB = [introB1, introB2, introB3, introB4]
// [PART 2] intro 2 - initializer
function initializeIntroB(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = introsB[chapterIndex];
    main_window.appendChild(entry);
    let choice1 = { 
        text: 'Of course, hang in there!', 
        outcome: wizardAgreedToHelp, 
        storyPoint: story.findIndex(i => i == wizardAgreedToHelp),
        modifier: function() { let wizardStatus = 'agreedToHelp' } 
    };
    let choice2 = { 
        text: '*Think*: I wonder if he has some loot.', 
        outcome: wizardLooted, 
        storyPoint: story.findIndex(i => i == wizardLooted), 
        modifier: function() { let wizardStatus = 'killed' }
     };
    if (chapterIndex+1 <= introsB.length) {
        continuer(story.findIndex(i => i == initializeIntroB), chapterIndex+1);
    }
    if (chapterIndex >= introsB.length) {
        dialogueChoice(choice1, choice2);
    }
};
// [PART 3] wizard outcomes
let wizardAgreedToHelp1 = `Dude promises to help the old man.`;
let wizardAgreedToHelp2 = `Dude stitches the old man's wounds as best they could.`;
let wizardAgreedToHelp3 = `The old man weakly thanks Dude, but Dude knows that the old man won't last long without a healing potion.`;
let wizardAgreedToHelpStory = [wizardAgreedToHelp1, wizardAgreedToHelp2, wizardAgreedToHelp3]
function wizardAgreedToHelp(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = wizardAgreedToHelpStory[chapterIndex];
    main_window.appendChild(entry);
    if (chapterIndex+1 <= wizardAgreedToHelpStory.length) {
        continuer(story.findIndex(i => i == wizardAgreedToHelp), chapterIndex+1);
    }
    if (chapterIndex+1 > wizardAgreedToHelpStory.length) {
        let oldText = main_window.querySelectorAll('p');
        oldText.forEach(entry => {
            main_window.removeChild(entry);
        });
        story[story.findIndex(i => i == tutorialForExploration)](0);
    }
}
let wizardLooted1 = `Dude says, "I'd rather see what you might have of value".`;
let wizardLooted2 = `The old man squints his eyes in hatred. He clutches his wounds and quickly, but with some trouble, gets to his feet.`;
let wizardLooted3 = `"Alright, kid. You fucking earned an ass-kicking".`;
let wizardLooted4 = `The old man waves his hands around, and two reddish imps appear out of thin air. The old man turned out to be a wizard! It's a fight!`
let wizardLootedStory = [wizardLooted1, wizardLooted2, wizardLooted3, wizardLooted4]
function wizardLooted(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = wizardLootedStory[chapterIndex];
    main_window.appendChild(entry);
    if (chapterIndex+1 <= wizardLootedStory.length) {
        continuer(story.findIndex(i => i == wizardLooted), chapterIndex+1);
    }
    if (chapterIndex >= wizardLootedStory.length) {
        startBattle(wizard, imp1, imp2);
    }
}
let wizardKilled1 = `The imps crumble into dust, and the old man's body lies dead in the grass.`
let wizardKilled2 = `Dude looks around, innocently whistling. Dude bends over and searches the old man's body.`
let wizardKilled3 = `Dude finds a golden ring!`
let wizardKilledStory = [wizardKilled1, wizardKilled2, wizardKilled3]
function wizardKilled(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = wizardKilledStory[chapterIndex];
    main_window.appendChild(entry);
    if (chapterIndex+1 < wizardKilledStory.length) {
        continuer(story.findIndex(i => i == wizardKilled), chapterIndex+1);
    }
    if (chapterIndex == wizardKilledStory.findIndex(i => i == wizardKilled3)) {
        grabItem(goldRing);
    }
}
// [PART 4] begin exploration
let beginExploration1 = `With that, Dude finally reached the entrance to the forest proper.`;
let beginExploration2 = `People at the Blue Inferno called this forest the Singing Creek.`;
let beginExploration3 = `They didn't mention why exactly. In any case, it's time to explore the Singing Creek.`;
let beginExplorationStory = [beginExploration1, beginExploration2, beginExploration3]
function tutorialForExploration(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = beginExplorationStory[chapterIndex];
    main_window.appendChild(entry);
    if (chapterIndex+1 <= beginExplorationStory.length) {
        continuer(story.findIndex(i => i == tutorialForExploration), chapterIndex+1);
    }
    if (chapterIndex+1 > beginExplorationStory.length) {
        explorationModeActivator(ex1Tiles);
    }
}
// array of initializers
let storyStrings = [creationStory, creationStoryB, creationStoryC, intros, introsB, wizardAgreedToHelpStory, wizardLootedStory, wizardKilledStory, beginExplorationStory];
let story = [initializeCreation, initializeCreationB, initializeCreationC, initializeIntro, initializeIntroB, wizardAgreedToHelp, wizardLooted, wizardKilled, tutorialForExploration];
let currentStoryPoint = 0;

// --- NEW SYSTEM (CURRENTLY TESTING) ---
// class storyElement { type(dialogue, choice, battle, description, item); text = []; 
// modifiers(for battle: array of enemies, for choice/dialogue: choices, for item: item name);
// nextStory }
class storyElement {
    constructor(type, text, modifiers, nextStoryElement) {
        this.type = type;
        this.text = text;
        this.modifiers = modifiers;
        this.nextStoryElement = nextStoryElement;
    }
}
// objects of this class will be ALL that I have to edit

let testAfterDialogue = new storyElement(
    'description',
    [
        'You are alone again.'
    ],
    undefined,
    undefined
)
let testDialogue = new storyElement(
    'dialogue',
    [{ lineNumber: 0, npcLine: 'You see a person. They approach, and say: "Hello!".', responses: 
        [{ dialogueChoice: 'And hello to you kind person!', dialogueNextLine: 1, points: 1 },
        { dialogueChoice: 'Hello, more like hyulo!', dialogueNextLine: 2, points: -1 }]},
    { lineNumber: 1, npcLine: '"Nice to see a polite individual around these parts! How are you today?"', responses: 
        [{ dialogueChoice: 'I am doing well.', dialogueNextLine: 3, points: 1 },
        { dialogueChoice: 'I need help...', dialogueNextLine: 4, points: -1 }]},
    { lineNumber: 2, npcLine: '"I do not speak this foul-sounding language of yours," they say, sounding concerned. "Are you okay?".', responses: 
        [{ dialogueChoice: 'I am doing well.', dialogueNextLine: 3, points: 1 },
        { dialogueChoice: 'I need help...', dialogueNextLine: 4, points: 0 }]},
    { lineNumber: 3, npcLine: '"Glad to hear it. Well, stay safe out there."', responses: 
        [{ dialogueChoice: 'Goodbye, and good luck.', dialogueNextLine: 5, points: 1 },
        { dialogueChoice: 'Oh, piss off already.', dialogueNextLine: 5, points: -1 }]},
    { lineNumber: 4, npcLine: '"Wish I could help you, friend. God bless."', responses: 
        [{ dialogueChoice: 'It is alright. Take care of yourself, stranger.', dialogueNextLine: 5, points: 1 },
        { dialogueChoice: 'Thanks for nothing...', dialogueNextLine: 5, points: -1 }]},
    { lineNumber: 5, npcLine: 'The stranger says goodbye and leaves.'}],
    [
        'StrangerFriendly',
        'StrangerNeutral',
        'StrangerAnnoyed'
    ],
    testAfterDialogue
) 
let testChoiceOutcome2 = new storyElement(
    'description',
    [
        'You chose 2.'
    ],
    undefined,
    testDialogue
) 
let testChoiceOutcome1 = new storyElement(
    'description',
    [
        'You chose 1.'
    ],
    undefined,
    testDialogue
) 
let testChoice = new storyElement(
    'choice',
    [
        'Hello!',
        'This is the new introduction 2.',
        'Fun again, is it not?',
        'Certainly is. Again.'
    ],
    [
        {
            choiceText: 'I will choose 1.',
            choiceModifiers: 'testChoice1',
            choiceNextStory: testChoiceOutcome1
        },
        {
            choiceText: 'I will choose 2.',
            choiceModifiers: 'testChoice2',
            choiceNextStory: testChoiceOutcome2
        },
    ],
    undefined
) 
let testItem = new storyElement(
    'item',
    [
        'Enemies are dead!',
        'This description has more strings.',
        'Like one more.',
        'Thank you for your patience.',
        'As a reward, here is an item.'
    ],
    magicSword,
    testChoice
) 
let testBattle = new storyElement(
    'battle',
    [
        'Well now it is time to play!',
        'This array has fewer strings too! Muahahaha.',
        'It is a fight!'
    ],
    [imp1, imp2],
    testItem
) 
let testDescription = new storyElement(
    'description',
    [
        'Hello!',
        'This is a new introduction.',
        'Fun, is it not?',
        'Certainly is.'
    ],
    undefined,
    testBattle
)
// the function is ALWAYS static
// function story(type, text, modifiers)
function storyTeller(storyElement) {
    while (main_window.firstChild) {main_window.removeChild(main_window.firstChild)};
    if (storyElement.type !== 'dialogue') {
        textFlipper(storyElement, 0);
    } else {
        newDialogueMaker(storyElement, 0);
    }
}

// if dialogue, the text array and the modifier array are interconnected:
// the story function only plays the first line from the text array, and shows the first choices from the modifier array
// modifier array is an array of objects with props: text / nextLine (indicating which item of the text array to play after)
// each conversation is not like a dialogue tree in a videogame, but a sliding waterfall.

//--- supplementary functions
// new continue button operator
let announcement;
function textFlipper(storyElement, loop, style) {
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
                        newBattleStarter(storyElement, storyElement.modifiers);
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
                    case 'dialogue':
                        break;
                }
            }
        })
    }
}
// new dialogue function
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
            storyTeller(thisChoice.choiceNextStory);
        });
    })
}
// new battle functions
let storyAfterBattle = null;
function newBattleStarter(storyElement, thisEncounterEnemies) {
    thisEncounterEnemies.forEach((currentEnemy) => { currentEnemy.currentHP = currentEnemy.maxHP });
    enemies = thisEncounterEnemies;
    storyAfterBattle = storyElement;
    listEnemies();
}
function isBattleOver(battleResult) {
    if (battleResult == 'win') {
        let entry = document.createElement('p');
        entry.textContent = 'You win the battle!';
        log_window.appendChild(entry);
        while (log_window.children.length > 2) { log_window.removeChild(log_window.firstChild) };
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
        button_window.removeChild(trade_button);
    }
}
// TESTER. start game
storyTeller(testDialogue);

// TO DO LIST.
// finish the new system
// test with storyElements of every type
// redo the character creation using the new system
// incorporate exploration into the new system
// add icons to exploration
// different shapes of exploration? (maybe by making a few divs a different-looking class, which looks different in the css) 
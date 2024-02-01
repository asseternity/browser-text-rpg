// initialize spaces and buttons
let top_bar = document.querySelector('.top_bar');
let log_window = document.querySelector('.log');
let main_window = document.querySelector('.main_window');
let image_window = document.querySelector('.image_window');
let menu_window = document.querySelector('.menu');
let button_window = document.querySelector('.button_window');
let attack_button = document.querySelector('#attackButton');
let special_button = document.querySelector('#specialButton');
let talk_button = document.querySelector('#talkButton');
let trade_button = document.querySelector('#tradeButton');
// object constructor functions
function Character(name, attackBonus, armorClass, currentHP, maxHP, specialAttack) {
    this.name = name;
    this.attackBonus = attackBonus;
    this.armorClass = armorClass;
    this.currentHP = currentHP;
    this.maxHP = maxHP;
    this.specialAttack = specialAttack;
}

function Monster(name, armorClass, currentHP, maxHP) {
    this.name = name;
    this.armorClass = armorClass;
    this.currentHP = currentHP;
    this.maxHP = maxHP;
}
// hero.prototype attack method
Character.prototype.attack = function(selectedEnemy) {
    if (enemies.length !== 0) {
        if (selectedEnemy !== undefined) {
            if (selectedEnemy.currentHP > 0) {
                let attackRoll = Math.floor((Math.random() * 20) + 1 + this.attackBonus);
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
                        enemy.counterattack();
                    }); 
                };
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
function Janitor(name, attackBonus, armorClass, currentHP, maxHP, specialAttack) {
    Character.call(this, name, attackBonus, armorClass, currentHP, maxHP, specialAttack);
}
function Accountant(name, attackBonus, armorClass, currentHP, maxHP, specialAttack) {
    Character.call(this, name, attackBonus, armorClass, currentHP, maxHP, specialAttack);
}
// setting prototypes
Object.setPrototypeOf(Janitor.prototype, Character.prototype);
Object.setPrototypeOf(Accountant.prototype, Character.prototype); 
// character object
let char1 = new Character('Asset', 13, 15, 100, 100, 'Normal Attack'); 
// enemies objects
let goblin_grunt = new Monster('Goblin', 10, 20, 20);
let goblin_fighter = new Monster('Goblin Fighter', 13, 25, 25);
let goblin_shaman = new Monster('Goblin Shaman', 16, 30, 30);
let goblin_chieftain = new Monster('Goblin Chieftain', 17, 40, 40);
let wizard = new Monster('Half Dead Old Guy', 10, 5, 5);
let imp1 = new Monster('Red Imp', 5, 5, 5);
let imp2 = new Monster('Blue Imp', 5, 5, 5);
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
        menu_window.textContent = `You are ${char1.name}. Your armor class is ${char1.armorClass}. Your HP is ${char1.currentHP}/${char1.maxHP}.`;
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
//finish battle
function isBattleOver(battleResult) {
    if (battleResult == 'win') {
        while (log_window.children.length > 1) { log_window.removeChild(log_window.firstChild) };
        enemyToAttack == undefined;
        top_bar.removeChild(top_bar.firstChild);
        while (main_window.firstChild) { main_window.removeChild(main_window.firstChild) };
        currentStoryPoint++;
        story[currentStoryPoint](0);
    } else {   
        let entry = document.createElement('p');
        entry.textContent = `You died!`;
        log_window.appendChild(entry);
        button_window.removeChild(attack_button);
        button_window.removeChild(move_button);
        button_window.removeChild(talk_button);
        button_window.removeChild(trade_button);
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
    pressSomething.addEventListener(`click`, () => {
        story[currentInitializer](nextIndex);
        main_window.removeChild(pressSomething);
    });
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
        outcome: initializeIntro, 
        storyPoint: story.findIndex(i => i == initializeIntro), 
        modifier: function() { 
            char1 = new Janitor(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
            menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are a Janitor.');
            special_button.addEventListener('click', () => { switchAttack(char1) });
        } 
    };
    let choice2 = { 
        text: `It's not fun, but it pays the bills... I'm an accountant`, 
        outcome: initializeIntro, 
        storyPoint: story.findIndex(i => i == initializeIntro), 
        modifier: function() { 
            char1 = new Accountant(char1.name, 13, 15, 100, 100, 'Normal Attack'); 
            menu_window.textContent = menu_window.textContent.replace('Your class is unknown.', 'You are an Accountant.');
            special_button.addEventListener('click', () => { switchAttack(char1) }); } 
    };
    if (chapterIndex+1 <= creationStoryB.length) {
        continuer(story.findIndex(i => i == initializeCreationB), chapterIndex+1);
    }
    if (chapterIndex >= creationStoryB.length) {
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
    if (chapterIndex+1 < wizardAgreedToHelpStory.length) {
        continuer(story.findIndex(i => i == wizardAgreedToHelp), chapterIndex+1);
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
let wizardKilled3 = `Dude finds a gold coin!`
let wizardKilledStory = [wizardKilled1, wizardKilled2, wizardKilled3]
function wizardKilled(chapterIndex) {
    let entry = document.createElement('p');
    entry.textContent = wizardKilledStory[chapterIndex];
    main_window.appendChild(entry);
    if (chapterIndex+1 < wizardKilledStory.length) {
        continuer(story.findIndex(i => i == wizardKilled), chapterIndex+1);
    }
}
// array of initializers
let storyStrings = [creationStory, creationStoryB, intros, introsB, wizardAgreedToHelpStory, wizardLootedStory, wizardKilledStory];
let story = [initializeCreation, initializeCreationB, initializeIntro, initializeIntroB, wizardAgreedToHelp, wizardLooted, wizardKilled];
let currentStoryPoint = 0;
// TESTER. start game
initializeCreation(0);
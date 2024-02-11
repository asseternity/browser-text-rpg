
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
function explorationContinuer(currentInitializer, nextIndex) {
    let pressSomething = document.createElement('button');
    pressSomething.textContent = `Click here to continue.`;
    main_window.appendChild(pressSomething);
    pressSomething.focus();
    function explorationContinuerHandlePress() {
        currentInitializer(nextIndex);
        main_window.removeChild(pressSomething);
    }
    pressSomething.addEventListener(`click`, explorationContinuerHandlePress);
    pressSomething.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
            explorationContinuerHandlePress();
        }
    })
}
// ex1 Health
let ex1Health1 = 'Dude wanders though the forest. Eventually, Dude spots something shiny in the grass.';
let ex1Health2 = 'Dude bends over, removing dirt from the object.';
let ex1Health3 = 'It looks like a vial of red liquid.';
let ex1Health4 = 'Health Potion acquired!';
let ex1HealthStory = [ex1Health1, ex1Health2, ex1Health3, ex1Health4];

let initializer_ex1HealthSeen = false;
function initializer_ex1Health(chapterIndex) {
    if (initializer_ex1HealthSeen == false) {
        moveOn = false;
        let entry = document.createElement('p');
        entry.textContent = ex1HealthStory[chapterIndex];
        main_window.appendChild(entry);
        if (chapterIndex + 1 < ex1HealthStory.length) {
            explorationContinuer(initializer_ex1Health, chapterIndex + 1);
        }
        if (chapterIndex + 1 == ex1HealthStory.length) {
            moveOn = true;
            grabItem(healthPotion);
            initializer_ex1HealthSeen = true;
        }
    }
}
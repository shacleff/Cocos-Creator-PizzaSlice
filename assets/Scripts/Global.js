const ANGLE_BETWEEN_PIZZA = 60;
const MAX_PIZZA_ON_HOLDER = Math.round(360 / 60);
const PIZZA_TYPE = {
    TOP : 0,
    TOP_RIGHT: 300,
    BOT_RIGHT: 240,
    BOT : 180,
    BOT_LEFT: 120,
    TOP_LEFT: 60
};

const SLICE_TYPE = {
    SLICE_1 : 1,
    SLICE_2 : 2,
    COUNT: 3
};

const GAME_STATUS = {
    WELCOM : 'welcom',
    PLAYING: 'play',
    CANNOT_PLAY: 'cannotplay',
    LOSE: 'lose'
};

var Game_Status = GAME_STATUS.WELCOM;
var QuitPopupShowed = false; 
var CanContinue = true;

const getTrueAngle = angle =>{
    angle = angle % 360;
    return (angle < 0 ? angle + 360 : angle);
};

const getRandomRange = (min, max) =>{
    return ~~(Math.random() * (max - min + 1) + min);
}

const removeFromArray = (array, valueFind, valueReplace = null) =>{
    let index = array.findIndex(e => e == valueFind);
    if(index != -1 && valueReplace == null)array.splice(index, 1);
    else if(index != -1 && valueReplace != null)array[index] = valueReplace;
}

const shuffleArray = array =>{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];    //swap
    }
}
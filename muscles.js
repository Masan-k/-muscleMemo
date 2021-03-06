﻿/*globals window, document, event , localStorage, setInterval */

let eBtnSubmit;
let eLblMaxQuestion;
let eLblQuestion;
let currentCorrect = [];
let eTxtAnswer;
let eLblRemainingQuestion;
let eLblCorrectCount;
let eLblStatus;
let eLblWaitCount;
let eLblMissAnswer;
let eBtnNext;
let eBtnStart;
let currentIndex;
let correctCount;
let eBtnReset;
let eBtnMenu;
let contents;
let selectQuestion;
let intervalId;
let waitCount;
let missQuestion = [];
let missAnswer = [];
const WAIT_MAX_COUNT = 10;

function getRandom(min, max) {
    'use strict';
    
    let range = max - min + 1;
    let ramdomRange = Math.floor(Math.random() * range);
    let randomNum = ramdomRange + min;
    return randomNum;
}

function saveScore(correctCnt, maxQuestion){
    'use strict';

    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = ('00' + (nowDate.getMonth()+1)).slice(-2);
    let day = ('00' + nowDate.getDate()).slice(-2);
    let hour = ('00' + nowDate.getHours()).slice(-2);
    let minute = ('00' + nowDate.getMinutes()).slice(-2);
    let second = ('00' + nowDate.getSeconds()).slice(-2);

    localStorage.setItem('MUSCLES' + ',' + selectQuestion + ',' + year + month + day + hour + minute + second, correctCnt + ',' + maxQuestion);

}

function countdown() {
    'use strict';
    waitCount -= 1;
    if(0 < waitCount){
	setWaitCount();
    }else{
        clickBtnNext();
    }       
}

function setWaitCount() {
    'use strict';
    let str = ' ';
    for(let i = 0;i < waitCount; i++){
        str = str + '*';
    }
    eLblWaitCount.innerText = str;
}

function clickBtnStart() {
    'use strict';
    setQuestion(currentIndex, correctCount);
    intervalId = setInterval(countdown, 1000);

    eBtnStart.disabled = true;
    eLblStatus.innerText = 'Please enter the answer';
}

function setClear() {
    'use strict';
    eLblStatus.innerText = "Clear!!";
    eLblCorrectCount.innerText = correctCount;
    eLblRemainingQuestion.innerText = currentIndex;
    saveScore(correctCount, eLblMaxQuestion.innerText);
    drawPast();

    eLblWaitCount = '';
    clearInterval(intervalId);

    eBtnSubmit.disabled = true;
    eBtnNext.disabled = true;

    let answer = '';
    for(let i=0; i < missQuestion.length; i++){
        answer = answer + missAnswer[i] + '(' + missQuestion[i] + ')' + '\n';
    }
    eLblMissAnswer.innerText = answer

}

function clickBtnNext() {
    'use strict';

    missQuestion.push(contents[currentIndex].question);
    missAnswer.push('none');

    if(currentIndex !== contents.length){
        currentIndex += 1;
        if(currentIndex !== contents.length){
            setQuestion(currentIndex, correctCount);
        }else{
            setClear();
	}
    }
}

function clickBtnSubmit() {
    'use strict';
    
    if(currentCorrect.includes(eTxtAnswer.value)){
        currentIndex += 1;
        correctCount += 1;
 
        if(currentIndex !== contents.length){
            eLblStatus.innerText = "OK";
            setQuestion(currentIndex, correctCount); 
            
        }else{
	    setClear();
        }
    }else{
        eLblStatus.innerText = "NG";
        missQuestion.push(contents[currentIndex].question);
        missAnswer.push(eTxtAnswer.value);
    }
}

function setQuestion(currentId, correctCnt){
    'use strict';

    eLblRemainingQuestion.innerText = currentId;
    eLblCorrectCount.innerText = correctCnt;
    eLblQuestion.innerText = contents[currentId].question;
    currentCorrect = contents[currentId].correct.split(',');

    eTxtAnswer.value = '';
    waitCount = WAIT_MAX_COUNT;
    setWaitCount();
}

function init() {
    'use strict';
    
    currentIndex = 0;
    correctCount = 0;
    waitCount = WAIT_MAX_COUNT;
    setWaitCount();

    eLblMaxQuestion.innerText = contents.length
    eLblStatus.innerText = 'Waiting for start';
    eTxtAnswer.value = '';

    eBtnSubmit.disabled = false;
    eBtnNext.disabled = false;
    eBtnStart.disabled = false;

    missQuestion = [];
    missAnswer = [];
}

function clickBtnReset() {
    'use strict';
    init();
}

function clickBtnMenu() {
    'use strict';
    //window.location.href = 'index.html';
    window.location.href = 'https://masan-k.github.io/Memorization-of-muscles/index.html';
}

function getRectColor(count){
    if(count === 0){
        return '#EAECF0';
    }else if(count <= 2){
        return '#6BF8A3';
    }else if(count <= 4){
        return '#00D65D';
    }else if(count <= 6){
        return '#00AF4A';
    }else {
        return '#007839';
    }
}

function getRecordKeys(days) {

    let record = [];
    
    for(let key in localStorage) {
        let keys = key.split(',');
        if(keys.length === 3 && keys[0] === 'MUSCLES' && keys[1] === selectQuestion) {
            record.push(key);
            if(record.length > days){
                 record.shift();
            }
        }
    }
    return record;
}

function drawPast() {
    'use strict';

    let canvas = document.getElementById('cvsPast');
    let ctx = canvas.getContext('2d'); 

    const INIT_BLANK_WIDTH = 50;
    const DAYS_COUNT = 40;
    const X_BLANK_WIDTH = (canvas.width - (INIT_BLANK_WIDTH * 2)) / DAYS_COUNT;

    const INIT_BLANK_HEIGHT = 25;

    let keys = getRecordKeys(DAYS_COUNT);
    let maxQuestion = contents.length;
    for(let i = 0; i < keys.length; i++){
        let value = localStorage.getItem(keys[i]).split(',')
        if(maxQuestion < value[1]){maxQuestion = value[1]}
    }
    const VERTICAL_COUNT = maxQuestion;
    
    const Y_BLANK_WIDTH = (canvas.height - (INIT_BLANK_HEIGHT * 2)) / VERTICAL_COUNT;

    const HORIZONTAL_COUNT = DAYS_COUNT;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //----------------
    //Frame drawing
    //----------------
    //X axis
    ctx.lineWidth = '0.2';

    for(let i = 0; i <= VERTICAL_COUNT + 1; i++) {
        ctx.beginPath();
        ctx.lineTo(INIT_BLANK_WIDTH, INIT_BLANK_HEIGHT + i * Y_BLANK_WIDTH);
        ctx.lineTo(INIT_BLANK_WIDTH + X_BLANK_WIDTH * (HORIZONTAL_COUNT +1), INIT_BLANK_HEIGHT + i * Y_BLANK_WIDTH);
        ctx.stroke();
    }

    //Y axis
    for(let i = 0; i <= HORIZONTAL_COUNT + 1; i++) {
        ctx.beginPath();
        ctx.lineTo(i * X_BLANK_WIDTH + INIT_BLANK_WIDTH, INIT_BLANK_HEIGHT);
        ctx.lineTo(i * X_BLANK_WIDTH + INIT_BLANK_WIDTH, INIT_BLANK_HEIGHT + (Y_BLANK_WIDTH*VERTICAL_COUNT));
        ctx.stroke();
    }
	

    //The number of correct answers

    ctx.beginPath()
    ctx.lineWidth = '0.5';

    ctx.strokeStyle = getRectColor(8)

    ctx.textAlign = 'right';
    ctx.strokeText('The number of correct answers', INIT_BLANK_WIDTH + X_BLANK_WIDTH * (HORIZONTAL_COUNT +1) + 10, INIT_BLANK_HEIGHT + VERTICAL_COUNT*Y_BLANK_WIDTH + 15);
    ctx.strokeText(maxQuestion, INIT_BLANK_WIDTH + X_BLANK_WIDTH * (HORIZONTAL_COUNT +1) + 10, INIT_BLANK_HEIGHT);
    ctx.strokeText(0 , INIT_BLANK_WIDTH + X_BLANK_WIDTH * (HORIZONTAL_COUNT +1) + 10, INIT_BLANK_HEIGHT + VERTICAL_COUNT*Y_BLANK_WIDTH);

    //Correct answer rate
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#6666FF'
    ctx.strokeText('Correct answer rate', INIT_BLANK_WIDTH, INIT_BLANK_HEIGHT + VERTICAL_COUNT*Y_BLANK_WIDTH + 15);
    ctx.strokeText('100%', INIT_BLANK_WIDTH - 30, INIT_BLANK_HEIGHT + 5);
   
    ctx.stroke();
    //--------------------
    //Drawing a bar graph
    //--------------------

    ctx.beginPath();
    ctx.lineWidth = '1.0';

    //The number of correct answers 
    for(let i = 0; i < keys.length; i++){

        let value = localStorage.getItem(keys[i]).split(',')
        let correctCount = value[0]
        let maxQuestionCount = value[1]        

        ctx.fillStyle = getRectColor(0)
        ctx.fillRect(INIT_BLANK_WIDTH + i * X_BLANK_WIDTH, INIT_BLANK_HEIGHT  + VERTICAL_COUNT*Y_BLANK_WIDTH - (maxQuestionCount*Y_BLANK_WIDTH), X_BLANK_WIDTH, Y_BLANK_WIDTH*maxQuestionCount)

        ctx.fillStyle = getRectColor(4)
        ctx.fillRect(INIT_BLANK_WIDTH + i * X_BLANK_WIDTH, INIT_BLANK_HEIGHT  + VERTICAL_COUNT*Y_BLANK_WIDTH - (correctCount*Y_BLANK_WIDTH), X_BLANK_WIDTH, Y_BLANK_WIDTH*correctCount)                
        
    }

    ctx.stroke();


    //Correct answer rate
    ctx.beginPath();
    ctx.lineWidth = '3.0';
    ctx.strokeStyle = '#6666FF'
    for(let i = 0; i < keys.length; i++){

        let value = localStorage.getItem(keys[i]).split(',')
        let correctCount = value[0]
        let maxQuestionCount = value[1]

        let point
        if(correctCount === '0' || maxQuestionCount === '0'){
            point = 0
        }else{
            let answerRate = correctCount / maxQuestionCount;
            point =  (canvas.height - (INIT_BLANK_HEIGHT * 2)) * answerRate; 
        }
        ctx.lineTo(INIT_BLANK_WIDTH + i * X_BLANK_WIDTH + (X_BLANK_WIDTH/2), INIT_BLANK_HEIGHT  + VERTICAL_COUNT*Y_BLANK_WIDTH - point);
        
    }
    ctx.stroke();

}

function getShuffleContents(cnts){
    let workRecord = cnts.slice();
    let newRecord = [];
    let maxIndex;
    let randomIndex;
    let newRec;

    while(newRecord.length < cnts.length){
        maxIndex = workRecord.length - 1;
        randomIndex = getRandom(0,maxIndex);
        newRecord.push(workRecord[randomIndex]);
        workRecord.splice(randomIndex, 1);
    }
    return newRecord;

}
function loadContents() {
    "use strict";

    let requestURL = 'https://masan-k.github.io/Memorization-of-muscles/contents.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    
    request.onload = function () {
        let contentsAll = request.response;
        contents = contentsAll[selectQuestion];
        contents = getShuffleContents(contents);

        init();

        drawPast();
    }
}

function keyInput() {
    'use strict';
    const KEYCODE_ENTER = 13;
    if(currentIndex >= contents.length){
        return;
    }
    if(event.keyCode === KEYCODE_ENTER) {
        event.preventDefault();
        clickBtnSubmit();
    }
}

window.onload = function () {
    'use strict';

    document.body.onkeyup = keyInput;

    selectQuestion = location.search.split('=')[1];

    eBtnSubmit = document.getElementById("btnSubmit"),
    eBtnSubmit.addEventListener("click", clickBtnSubmit, false);

    eBtnNext = document.getElementById("btnNext"),
    eBtnNext.addEventListener("click", clickBtnNext, false);

    eBtnReset = document.getElementById("btnReset"),
    eBtnReset.addEventListener("click", clickBtnReset, false);

    eBtnMenu = document.getElementById("btnMenu"),
    eBtnMenu.addEventListener("click", clickBtnMenu, false);

    eBtnStart = document.getElementById("btnStart"),
    eBtnStart.addEventListener("click", clickBtnStart, false);

    eLblQuestion = document.getElementById("lblQuestion");
    eTxtAnswer = document.getElementById("txtAnswer");
    eLblMaxQuestion = document.getElementById("lblMaxQuestion");
    eLblRemainingQuestion = document.getElementById("lblRemainingQuestion");
    eLblCorrectCount = document.getElementById("lblCorrectCount");
    eLblStatus = document.getElementById("lblStatus");
    eLblWaitCount = document.getElementById("lblWaitCount");

    eLblMissAnswer = document.getElementById("lblMissAnswer");

    loadContents();
    
};

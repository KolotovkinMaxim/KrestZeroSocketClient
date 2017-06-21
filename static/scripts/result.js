/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class BoxRender{
    constructor(){
        this.mass = [];
    }

    addBox(s){
        this.mass.push(s);
    }

    hideAllBoxes(){
        const n = this.mass.length;
        for(let i = 0; i < n; i++){
            const boxId = this.mass[i];
            let boxObj = document.getElementById(boxId);
            boxObj.hidden = true;
        }
    }

    showBox(boxId){
        this.hideAllBoxes();
        let boxObj = document.getElementById(boxId);
        boxObj.hidden = false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BoxRender;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__RoomRender_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CanvasRender_js__ = __webpack_require__(3);





class SocketController{
    constructor(){
        this.socket = null;
        this.roomCreated = false;

        this.myLogin = "";

        this.roomRender = new __WEBPACK_IMPORTED_MODULE_0__RoomRender_js__["a" /* default */]("roomsListLabel");
        this.canvas = new __WEBPACK_IMPORTED_MODULE_1__CanvasRender_js__["a" /* default */]();
    }

    connectWithRender(render){
        this.render = render;
    }

    createRoom(){
        this.roomCreated = true;
        this.socket.send("CREATEROOM@NEWROOM");
        console.log("Отправлен запрос на создание комнаты.");
    }

    deleteRoom(){
        this.roomCreated = false;
        this.socket.send("DELETEROOM@ROOM");
        console.log("Комната удалена");
    }

    startSendingRubbish(){
        let socket = this.socket;
        this.rubbishInterval = setInterval(function(){
            socket.send("RUBBISH@RUBBISH");
        }, 3000);
    }

    createSocketAndAddEvents(valueLogin){
        // this.socket = new WebSocket("ws://localhost:5000/");
        this.socket = new WebSocket("ws://kkk-zzz.herokuapp.com/");

        let socket = this.socket;
        console.log("Socket object was created");

        let thisPointer = this;

        socket.onopen = function() {
            console.log("Соединение установлено");
            socket.send("LOGINNAME@" + valueLogin);
            thisPointer.startSendingRubbish();
        };

        socket.onclose = function(event) {
            console.log("Соединение закрыто");
        };

        socket.onmessage = function(event) {
            console.log("Получено сообщение: " + event.data);
            let message = event.data.toString();
            let mass = [];
            mass = message.split("@");
            const type = mass[0].toString();

            if(type === "LOGINCOMPLETE") {
                document.getElementById("loginName").innerHTML = mass[1];
                thisPointer.myLogin = mass[1].toString();
            }

            if(type === "ROOMSINFO"){
                thisPointer.roomRender.writeFreeRooms(message);
                thisPointer.addListenersToRoomSquares();
            }

            if(type === "TWOPLAYERSROOM"){
                let mass = [];
                mass = message.split("@");
                let login_1 = mass[3].toString();
                let login_2 = mass[4].toString();

                document.getElementById("gameStatusLabel").innerHTML = login_1 + " против " + login_2 + "<br>";
                if(thisPointer.myLogin === login_1){
                    document.getElementById("gameStatusLabel").innerHTML += "Вы играете за крестики"
                }
                if(thisPointer.myLogin === login_2){
                    document.getElementById("gameStatusLabel").innerHTML += "Вы играете за нолики"
                }

                document.getElementById("can").hidden = false;
                thisPointer.render.showBox("gameRoom");
                thisPointer.canvas.clearAndDrawFon();
                console.log("Игра началась: " + login_1 + " против " + login_2);
            }

            if(type === "ROOM_WAS_DELETED"){
                console.log("Комната была удалена.");
                document.getElementById("can").hidden = true;
                thisPointer.canvas.clearAndDrawFon();
                thisPointer.render.showBox("deletedRoomMessageBox");
            }

            if(type === "NEWFIELD"){
                let mass = [];
                mass = message.split("@");
                const field = mass[1].toString();

                thisPointer.canvas.clearAndDrawFon();

                for(let i = 0; i < field.length; i++){
                    const c = field.charAt(i);
                    if(c === "k"){
                        thisPointer.canvas.drawKKK(i);
                    }
                    if(c === "z"){
                        thisPointer.canvas.drawZZZ(i);
                    }
                }
            }

            if(type === "GAMERESULT"){
                let mass = [];
                mass = message.split("@");
                const result = mass[1].toString();

                if(result === "KRESTWIN"){
                    document.getElementById("gameStatusLabel").innerHTML = "<h2>" + "Победили крестики" + "</h2>";
                    return;
                }

                if(result === "ZEROWIN"){
                    document.getElementById("gameStatusLabel").innerHTML = "<h2>" + "Победили нолики" + "</h2>";
                    return;
                }

                if(result === "NICH"){
                    document.getElementById("gameStatusLabel").innerHTML = "<h2>" + "Ничья" + "</h2>";
                    return;
                }
            }
        };

        socket.onerror = function(error) {
            console.log("Ошибка");
        };
    }

    addListenersToRoomSquares(){
        let thisPointer = this;
        let elementsArr = document.getElementsByClassName("room");
        for(let i = 0; i < elementsArr.length; i++){
            const element = elementsArr[i];
            element.addEventListener("click",function(){
                const text = element.innerHTML.toString();
                let mass = [];
                mass = text.split(" ");
                const login = mass[2];
                thisPointer.socket.send("JOINGAME@" + login);
                console.log("Запрос на подключение к комнате.")
            });
        }
    }

    makeMove(xPos, yPos){
        let mass = [];
        mass.push("MAKEMOVE");
        mass.push(xPos.toString());
        mass.push(yPos.toString());
        const s = mass.join("@");
        this.socket.send(s);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SocketController;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class StringController{
    constructor(){
        this.allChars = "abcdefghijklmnopqrstuvwxyz0123456789";
    }

    isNormChar(c){
        const n = this.allChars.indexOf(c);
        return n !== -1;
    }

    isNormString(s){
        const n = s.length;
        if(n === 0){
            return false;
        }
        for(let i = 0; i < n; i++){
            const c = s.charAt(i);
            if(this.isNormChar(c) === false){
                return false;
            }
        }
        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringController;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class CanvasRender{
    constructor(){
        const objID = "can";
        let thisPointer = this;
        this.holst = document.getElementById(objID).getContext('2d');

        this.holst.lineWidth = 3;
        this.holst.fillStyle = '#FFFFFF';
        this.holst.strokeStyle = '#000000';

        this.clearAndDrawFon();

        this.ovalImg = new Image();
        this.ovalImg.src = ("images/oval.png");
    }

    drawLine(x1,y1,x2,y2){
        let holst = this.holst;
        holst.beginPath();
        holst.moveTo(x1,y1);
        holst.lineTo(x2,y2);
        holst.closePath();
        holst.stroke();
    }

    clearAndDrawFon(){
        const ww = 300;
        const hh = 300;
        this.holst.clearRect(0,0,ww,hh);
        this.holst.fillRect(0, 0, ww, hh);

        this.drawLine(0,0,ww,0);
        this.drawLine(ww,0,ww,hh);
        this.drawLine(ww,hh,0,hh);
        this.drawLine(0,hh,0,0);

        this.drawLine(100,0,100,300);
        this.drawLine(200,0,200,300);
        this.drawLine(0,100,300,100);
        this.drawLine(0,200,300,200);
    }

    drawKKK(nParam){
        const n = parseInt(nParam);
        if(n === 0) this.drawKrestic(0,0);
        if(n === 1) this.drawKrestic(1,0);
        if(n === 2) this.drawKrestic(2,0);
        if(n === 3) this.drawKrestic(0,1);
        if(n === 4) this.drawKrestic(1,1);
        if(n === 5) this.drawKrestic(2,1);
        if(n === 6) this.drawKrestic(0,2);
        if(n === 7) this.drawKrestic(1,2);
        if(n === 8) this.drawKrestic(2,2);
    }

    drawZZZ(nParam){
        const n = parseInt(nParam);
        if(n === 0) this.drawZero(0,0);
        if(n === 1) this.drawZero(1,0);
        if(n === 2) this.drawZero(2,0);
        if(n === 3) this.drawZero(0,1);
        if(n === 4) this.drawZero(1,1);
        if(n === 5) this.drawZero(2,1);
        if(n === 6) this.drawZero(0,2);
        if(n === 7) this.drawZero(1,2);
        if(n === 8) this.drawZero(2,2);
    }

    drawKrestic(x,y){
        const xx = x * 100;
        const yy = y * 100;
        this.drawLine(xx + 20,yy + 20,xx + 80,yy + 80);
        this.drawLine(xx + 80,yy + 20,xx + 20,yy + 80);
    }

    drawZero(x,y){
        let thisPointer = this;
        const xx = x * 100 + 20;
        const yy = y * 100 + 20;
        thisPointer.holst.drawImage(thisPointer.ovalImg,xx,yy,60,60);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CanvasRender;
;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__StringController_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BoxRender_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SocketController_js__ = __webpack_require__(1);






class MainScript{
    getIt(s){
        return document.getElementById(s);
    }

    controlLogin(){
        let thisPointer = this;
        let messageBox = thisPointer.getIt("loginMessage");
        messageBox.innerHTML = "";

        this.loginInterval = setInterval(function(){
            let s = thisPointer.getIt("loginField").value;
            let strCont = new __WEBPACK_IMPORTED_MODULE_0__StringController_js__["a" /* default */]();
            messageBox.innerHTML = "";
            if(s === ""){
                messageBox.innerHTML = "Поле ввода пусто.";
            }else if(strCont.isNormString(s) === false){
                messageBox.innerHTML = "Некорректный ввод.";
            }else{
                messageBox.innerHTML = "Хороший логин.";
            }
            console.log("Login control interval works.")
        }, 50);
    }

    constructor(){
        this.addListenersToButtons();
        this.addListenerToCanvas();
        this.controlLogin();

        this.render = new __WEBPACK_IMPORTED_MODULE_1__BoxRender_js__["a" /* default */]();

        this.socketObj = new __WEBPACK_IMPORTED_MODULE_2__SocketController_js__["a" /* default */]();
        this.socketObj.connectWithRender(this.render);

        this.render.addBox("loginBox");
        this.render.addBox("menuBox");
        this.render.addBox("gameRoom");
        this.render.addBox("roomsListBox");
        this.render.addBox("deletedRoomMessageBox");

        this.render.showBox("loginBox");
    }

    addListenersToButtons(){
        let thisPointer = this;
        thisPointer.getIt("loginButton").onclick = function(){
            let s = thisPointer.getIt("loginField").value;
            let strCont = new __WEBPACK_IMPORTED_MODULE_0__StringController_js__["a" /* default */]();
            const b = strCont.isNormString(s);
            if(b === true){
                thisPointer.render.showBox("menuBox");
                clearInterval(thisPointer.loginInterval);
                console.log("Login control interval CLEARED.");
                thisPointer.socketObj.createSocketAndAddEvents(s);
            }
        };

        thisPointer.getIt("createRoomButton").onclick = function (){
            thisPointer.socketObj.createRoom();
            thisPointer.getIt("gameStatusLabel").innerHTML = "Ожидание соперника ...";
            thisPointer.render.showBox("gameRoom");
        };

        thisPointer.getIt("deleteRoomButton").onclick = function(){
            thisPointer.socketObj.deleteRoom();
            thisPointer.render.showBox("menuBox");
        };

        thisPointer.getIt("findRoomButton").onclick = function(){
            thisPointer.render.showBox("roomsListBox");
        };

        thisPointer.getIt("getBackFromRoomsList").onclick = function(){
            thisPointer.render.showBox("menuBox");
        };

        thisPointer.getIt("goToMainMenu").onclick = function(){
            thisPointer.render.showBox("menuBox");
        };
    }

    addListenerToCanvas(){
        let thisPointer = this;
        let canvasObj = document.getElementById("can");
        canvasObj.addEventListener("click",function(event){
            const xMouse = parseInt(event.offsetX);
            const yMouse = parseInt(event.offsetY);
            console.log("Щелчок по Canvas: " + xMouse + " " + yMouse);
            let xPos = parseInt(xMouse / 100);
            let yPos = parseInt(yMouse / 100);
            console.log("Координаты клетки: " + xPos + " " + yPos);
            thisPointer.socketObj.makeMove(xPos,yPos);
        });
    }

}


window.onload = function(){
    let mainObj = new MainScript();
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class RoomRender{
    constructor(fieldNameString){
        this.obj = document.getElementById(fieldNameString);
        this.obj.innerHTML = "";
    }

    initRoomsString(s){
        this.obj.innerHTML = "";
        let mass = [];
        mass = s.split("@");
        for(let i = 0; i < mass.length; i++){
            mass[i] = mass[i].toString();
            if(mass[i] !== ""){
                if(mass[i] !== "ROOMSINFO"){
                    this.workWithRecord(mass[i]);
                }
            }
        }
    }

    workWithRecord(s){
        let mass = [];
        mass = s.split("!");
        let p1 = mass[0].toString();
        let p2 = mass[1].toString();
        if((p1 === "empty" && p2 === "empty") === false){
            if(p1 === "empty"){
                this.obj.innerHTML += ("<div class = 'room'>Комната игрока " + p2 + "</div><br>");
            }
            if(p2 === "empty"){
                this.obj.innerHTML += ("<div class = 'room'>Комната игрока " + p1 + "</div><br>");
            }
        }
    }

    writeFreeRooms(roomsString){
        this.obj.innerHTML = "";
        let s = roomsString.toString();
        this.initRoomsString(s);
        console.log("Вывод комнат в бокс");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RoomRender;


/***/ })
/******/ ]);
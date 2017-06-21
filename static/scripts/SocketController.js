"use strict";

import RoomRender from "./RoomRender.js";
import CanvasRender from "./CanvasRender.js";

export default class SocketController{
    constructor(){
        this.socket = null;
        this.roomCreated = false;

        this.myLogin = "";

        this.roomRender = new RoomRender("roomsListLabel");
        this.canvas = new CanvasRender();
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

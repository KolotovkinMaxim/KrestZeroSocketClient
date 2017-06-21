"use strict";

import StringController from "./StringController.js";
import BoxRender from "./BoxRender.js";
import SocketController from "./SocketController.js";

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
            let strCont = new StringController();
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

        this.render = new BoxRender();

        this.socketObj = new SocketController();
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
            let strCont = new StringController();
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

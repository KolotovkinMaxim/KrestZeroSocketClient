"use strict";

export default class RoomRender{
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
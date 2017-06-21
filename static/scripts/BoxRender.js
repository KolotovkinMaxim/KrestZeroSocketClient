"use strict";

export default class BoxRender{
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
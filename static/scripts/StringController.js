"use strict";

export default class StringController{
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

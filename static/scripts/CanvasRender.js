"use strict";

export default class CanvasRender{
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
};


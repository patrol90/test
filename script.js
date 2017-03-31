/**
 * Created by dmitry.sobolevsky on 28.03.2017.
 */
"use strict";


document.addEventListener("DOMContentLoaded", ready);
var playerEl=document.getElementById('player');
var container=document.querySelector('.container');

var pressed={};

var zombies={};

var magazine={
    size:10,
    current:0,
    width:100,
    height:50,
    border:"black",
    fill:"yellow",
    stock:{},
    delDomBullet:[],
    reload:function () {
        for (this.current; this.current < this.size; this.current++) {
            this.stock[this.current] = new TBullet();
            this.stock[this.current].Create(this.current,player.posX,player.posY);
        }
    },
    show:function () {
        if(document.getElementById("magazine")) {
            container.removeChild(document.getElementById("magazine"));
        }
        var MagazineBlock = document.createElement("div");
        MagazineBlock.id="magazine";
        MagazineBlock.style.width=this.width+"px";
        MagazineBlock.style.height=this.height+"px";
        MagazineBlock.style.background=this.border;
        MagazineBlock.style.position="absolute";
        MagazineBlock.style.right="0px";
        MagazineBlock.style.padding="5px";
        for (var i=0;i<this.current;i++){
            var MagazineElement = document.createElement("div");
            MagazineElement.style.background=this.fill;
            MagazineElement.style.width="10%";
            MagazineElement.style.height="100%";
            MagazineElement.style.display="inline-block";
            MagazineElement.style.borderLeft="1px solid grey";
            MagazineElement.style.boxSizing="border-box";
            MagazineBlock.appendChild(MagazineElement);

        }
        container.appendChild(MagazineBlock);
    },
    reloading:function () {
        this.reload();
        this.show();
    }
};

var ctr = { //player position
    x:playerEl.offsetLeft,
    y:playerEl.offsetTop,
};

var player= {
    posX:0,
    posY:0,
    speed:1,
    health:100,
    Fire: function (EO) {
        EO=EO||window.event;
        (magazine.current>0) ? magazine.current=magazine.current-1:"";
        magazine.show();
        var bullet=magazine.stock[magazine.current];
        bullet.PosX =EO.pageX;
        bullet.PosY=EO.pageY;
        magazine.stock[magazine.current].Element.style.left=bullet.PosX+"px";
        magazine.stock[magazine.current].Element.style.top=bullet.PosY+"px";
    },
    Look:function(EO) {
        EO=EO||window.event;

        var ms = {
            x:EO.pageX,
            y:EO.pageY
        };

        var angle=GetAngle(ms,ctr).toFixed(3);

        playerEl.style.transform="translate(-50%,-50%) rotate(-"+angle+"deg)";
    },
    MovePlayer:function () {
        if (player.posX<playerEl.offsetWidth/2){
            player.posX=playerEl.offsetWidth/2;
        }

        if (player.posX>window.innerWidth - playerEl.offsetWidth/2){
            player.posX=window.innerWidth - playerEl.offsetWidth/2;
        }
        if (player.posY+playerEl.offsetHeight/2>window.innerHeight){
            player.posY=window.innerHeight - playerEl.offsetHeight/2;
        }
        if (player.posY<playerEl.offsetHeight/2){
            player.posY=playerEl.offsetHeight/2;
        }

        if (pressed["87"]&& pressed["68"]) {
            player.posY -= player.speed/3;
            player.posX += player.speed/3;
        }
        if (pressed["83"]&& pressed["68"]) {
            player.posY += player.speed/3;
            player.posX += player.speed/3;
        }
        if (pressed["83"]&& pressed["65"]) {
            player.posY += player.speed/3;
            player.posX -= player.speed/3;
        }
        if (pressed["87"]&& pressed["65"]) {
            player.posY -= player.speed/3;
            player.posX -= player.speed/3;
        }
        if (pressed["87"]) {
            player.posY -= player.speed;
        }
        if (pressed["83"]) {
            player.posY += player.speed;
        }
        if (pressed["68"]) {
            player.posX += player.speed;
        }
        if (pressed["65"]) {
            player.posX -= player.speed;
        }

    }

};

function ready() {
    document.addEventListener("keydown",DownKey,false);
    document.addEventListener("keydown",player.MovePlayer,false);
    document.addEventListener("keyup",UpKey,false);
    document.addEventListener('mousedown',player.Fire,false);
    document.addEventListener("mousemove",player.Look,false);
    document.addEventListener('keypress',function (EO) {
        EO = EO || window.event;
        if (EO.keyCode)var keycode = EO.keyCode; // IE
        else if (EO.which) var keycode = EO.which; // all browsers
        if(keycode=="32"){
            magazine.reloading();
        }

    },false);
    player.posX=playerEl.offsetLeft;
    player.posY=playerEl.offsetTop;
    CreateZomby(15);
    Update();
    magazine.reloading();
}

function TZomby(id,width,height,speed,damage,background) {
    var self=this;
    self.id=id;
    self.Width=width;
    self.Height=height;
    self.Speed=speed;
    self.Damage=damage;
    self.Img=background;
    self.posX=0;
    self.posY=0;
    self.DomElem;
    self.Angle=0;
    self.MoveZobmie=function () {
        if(self.posX<player.posX){
            self.posX+=self.Speed;

        } else if (self.posX>player.posX) {
            self.posX-=self.Speed;

        }
        if(self.posY<player.posY){
            self.posY+=self.Speed;

        }else if (self.posY>player.posY){
            self.posY-=self.Speed;
        }

        if(self.posY>=player.posY && self.posX>=player.posX ){
            self.Angle=-45;
        }
        if(self.posY>=player.posY && self.posX<=player.posX ) {
            self.Angle=45;
        }
        if(self.posY<player.posY && self.posX<player.posX ) {
            self.Angle=120;
        }
        if(self.posY<player.posY && self.posX>player.posX ) {
            self.Angle=240;
        }
        return self.Angle;
    },
    self.RenderZombie=function () {
        var angle =self.MoveZobmie();
        self.DomElem.style.left=self.posX +"px";
        self.DomElem.style.top=self.posY +"px";
        self.DomElem.style.transform="translateZ(0) rotate("+angle+"deg)";
    }




}
function TEasyZomby() {
    var self=this;
    TZomby.apply(this,arguments);//наследуем
    self.Create=function () {
        var zombyEl=document.createElement("div");
        zombyEl.classList.add('zomby');
        zombyEl.id="z"+self.id;
        var RandomMinX=randomInteger(1,window.innerWidth/2-200);
        var RandomMaxX=randomInteger(window.innerWidth/2+200,window.innerWidth);
        var RandomMinY=randomInteger(1,window.innerHeight/2-200);
        var RandomMaxY=randomInteger(window.innerHeight/2+200,window.innerWidth);

        if(randomInteger(0,1)){self.posX=RandomMinX } else {self.posX= RandomMaxX };
        if(randomInteger(0,1)){self.posY=RandomMinY } else {self.posY= RandomMaxY };
        self.posY=randomInteger(1,window.innerHeight);

        zombyEl.style.cssText=" width: "+self.Width+"px;\
        height: "+self.Width+"px;\
        background: url("+self.Img+");\
        position: absolute;\
        left:"+self.posX+"px;\
        top:"+self.posY+"px;\
        z-index: 0;\
        background-position: -40px -20px;\
        transition: transform 1s;"
        container.appendChild(zombyEl);
        self.DomElem=zombyEl;

    };
}

function  TBullet() {
    var self=this;
    self.height=10;
    self.width=5;
    self.PosX=0;
    self.PosY=0;
    self.color="red";
    self.id=0;
    self.Element='';
    self.Fire=function () {
        console.log(self.id);
    };
    self.Create=function (id,left,top) {
        if(!left && !top){
            left=self.PosX;
            top=self.PosY;
        }
        var bullet=document.createElement('div');
        bullet.style.width=self.width + "px";
        bullet.style.height=self.height + "px";
        bullet.style.background=self.color;
        bullet.style.position="absolute";
        bullet.style.left=left+"px";
        bullet.style.top=top+"px";
        bullet.style.borderRadius=self.height/2+"px";
        bullet.id='bul'+id;
        self.Element=bullet;
        container.appendChild(bullet);

    };
    self.Shot=function () {


    }

}









function DownKey(EO) {
    EO = EO || window.event;
    var keycode;
    if (EO.keyCode) keycode = EO.keyCode; // IE
    else if (EO.which) keycode = EO.which; // all browsers
    pressed[keycode]=true;

}
function UpKey(EO) {
    EO = EO || window.event;
    var keycode;
    if (EO.keyCode) keycode = EO.keyCode; // IE
    else if (EO.which) keycode = EO.which; // all browsers
    pressed[keycode]=false;
}


function Update() {
    player.MovePlayer();
    for (var key in zombies){
        zombies[key].RenderZombie();
    }
    playerEl.style.left=player.posX+"px";
    playerEl.style.top=player.posY+"px";
    requestAnimationFrame(Update);
}




function CreateZomby(count) {

    for (var  i=0;i<count;i++){
        zombies[i]= new TEasyZomby(i,60,70,0.3,2,"../img/slow4_a.png");
        zombies[i].Create();
    }

}

//helpful
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
function GetAngle(ms, ctr) { //узнать угол поворота
    var x     = ms.x - ctr.x,
        y     = - ms.y + ctr.y,
        hyp   = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
        angle = Math.acos(x / hyp);

    if (y < 0) {
        angle = 2 * Math.PI - angle;
    }


    return radToDeg(angle);
}
var  radToDeg = function(r) { //пересчет в радианы
    return (r * (180 / Math.PI));
};


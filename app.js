/* ==========================================
   Biathlon Coach Tablet PRO
   app.js
========================================== */

const canvas = document.getElementById("targetCanvas");
const ctx = canvas.getContext("2d");

const SIZE = canvas.width;
const CENTER = SIZE / 2;

/* ===========================
   Data
=========================== */

let shots = [];

let dragging = false;

let dragIndex = -1;

/* ===========================
   UI
=========================== */

const groupSizeText =
document.getElementById("groupSize");

const offsetXText =
document.getElementById("offsetX");

const offsetYText =
document.getElementById("offsetY");

const avgRadiusText =
document.getElementById("avgRadius");

const windageText =
document.getElementById("windageClick");

const elevationText =
document.getElementById("elevationClick");

const recommendText =
document.getElementById("recommendText");

const table =
document.getElementById("shotTable");

/* ===========================
   Canvas
=========================== */

function drawTarget(){

ctx.clearRect(
0,
0,
SIZE,
SIZE
);

ctx.fillStyle="#ffffff";

ctx.fillRect(
0,
0,
SIZE,
SIZE
);

const rings=[
340,
300,
260,
220,
180,
140,
100,
60,
30,
10
];

rings.forEach((r,index)=>{

ctx.beginPath();

ctx.arc(
CENTER,
CENTER,
r,
0,
Math.PI*2
);

ctx.lineWidth=2;

ctx.strokeStyle="#000";

ctx.stroke();

if(index>=7){

ctx.fillStyle="#000";

ctx.font="26px Arial";

ctx.fillText(
10-index,
CENTER+5,
CENTER-r+25
);

}

});

ctx.beginPath();

ctx.moveTo(
CENTER-350,
CENTER
);

ctx.lineTo(
CENTER+350,
CENTER
);

ctx.moveTo(
CENTER,
CENTER-350
);

ctx.lineTo(
CENTER,
CENTER+350
);

ctx.strokeStyle="#888";

ctx.lineWidth=1;

ctx.stroke();

drawShots();

}

/* ===========================
   Draw Shots
=========================== */

function drawShots(){

shots.forEach((shot,index)=>{

ctx.beginPath();

ctx.arc(
shot.x,
shot.y,
8,
0,
Math.PI*2
);

ctx.fillStyle="#ff2d2d";

ctx.fill();

ctx.strokeStyle="#fff";

ctx.lineWidth=2;

ctx.stroke();

ctx.fillStyle="#fff";

ctx.font="15px Arial";

ctx.fillText(

index+1,

shot.x+12,

shot.y-12

);

});

}
/* ===========================
   Mouse Position
=========================== */

function getMousePos(e){

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return{

        x:(e.clientX-rect.left)*scaleX,

        y:(e.clientY-rect.top)*scaleY

    };

}

/* ===========================
   Add Shot
=========================== */

canvas.addEventListener("click",(e)=>{

    if(dragging) return;

    const pos = getMousePos(e);

    if(shots.length>=5){

        alert("최대 5발까지 입력 가능합니다.");

        return;

    }

    shots.push({

        x:pos.x,

        y:pos.y

    });

    update();

});

/* ===========================
   Drag
=========================== */

canvas.addEventListener("mousedown",(e)=>{

    const pos=getMousePos(e);

    shots.forEach((shot,index)=>{

        const d=Math.hypot(

            shot.x-pos.x,

            shot.y-pos.y

        );

        if(d<15){

            dragging=true;

            dragIndex=index;

        }

    });

});

canvas.addEventListener("mousemove",(e)=>{

    if(!dragging) return;

    const pos=getMousePos(e);

    shots[dragIndex].x=pos.x;

    shots[dragIndex].y=pos.y;

    update();

});

canvas.addEventListener("mouseup",()=>{

    dragging=false;

    dragIndex=-1;

});

canvas.addEventListener("mouseleave",()=>{

    dragging=false;

    dragIndex=-1;

});

/* ===========================
   Buttons
=========================== */

document

.getElementById("clearBtn")

.addEventListener("click",()=>{

    if(confirm("모든 탄착을 삭제하시겠습니까?")){

        shots=[];

        update();

    }

});

document

.getElementById("undoBtn")

.addEventListener("click",()=>{

    shots.pop();

    update();

});

/* ===========================
   Update
=========================== */

function update(){

    drawTarget();

    updateTable();

    calculateGroup();

}
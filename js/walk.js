/*************************************************
** walk.js
** author:    杨妍喆
** 函数：     walk(); 
** 全局变量： walkJson: 打开walk.json文件的路径
**            walkSpeed: 设置定时器的internalTime
**            walkLeftImgArray、walkRightImgArray
**            currentPersonImg = 0;
**            personX, personY：记录人物坐标
**            intervalID：用来clearInterval用
**************************************************/

//变量声明与赋值
var walkJson = 'data/walk.json';
var walkSpeed = 100;
var currentPersonImg = 0;
var walkLeftImgArray = ["img/walk/left1.png",
                      "img/walk/left2.png",
                      "img/walk/left3.png",
                      "img/walk/left4.png",
                      "img/walk/left5.png",
                      "img/walk/left6.png",
                      "img/walk/left7.png",
                      "img/walk/left8.png"
                      ];
var walkRightImgArray = ["img/walk/right1.png",
                       "img/walk/right2.png",
                       "img/walk/right3.png",
                       "img/walk/right4.png",
                       "img/walk/right5.png",
                       "img/walk/right6.png",
                       "img/walk/right7.png",
                       "img/walk/right8.png"
                       ];
var personX = 0;
var personY = 100;          
var intervalID;      
var currentDirection;       

//处理数据
function walkLeft(){
  personX-=5;
  if(personX <0)  personX=0;
  currentPersonImg = (currentPersonImg+1)%8;
  $('.personImg').attr("src", walkLeftImgArray[currentPersonImg]);
  $(".person").css("margin-left", personX + "px");
  currentDirection = "left";
}

function walkRight(){
  personX+=5;
  currentPersonImg = (currentPersonImg+1)%8;
  $('.personImg').attr("src", walkRightImgArray[currentPersonImg]);
  $(".person").css("margin-left", personX + "px");
  currentDirection = "right";
}

function jump(){
  intervalID = setInterval(rise, 20);
  currentPersonImg = (currentPersonImg+2)%8;
  if(currentDirection == 'right'){
    personX+=2;
    $('.personImg').attr("src", walkRightImgArray[currentPersonImg]);
  }
  else{
    personX-=2;
    $('.personImg').attr("src", walkLeftImgArray[currentPersonImg]);
  }  
  setTimeout(clearInterval(intervalID), 100);
  intervalID = setInterval(drop, 20);
  currentPersonImg = (currentPersonImg+2)%8;
  if(currentDirection == 'right'){
    personX+=2;
    $('.personImg').attr("src", walkRightImgArray[currentPersonImg]);
  }
  else{
    personX-=2;
    $('.personImg').attr("src", walkLeftImgArray[currentPersonImg]);
  }  
  setTimeout(clearInterval(intervalID), 100);
}

function drop(){
  personY-=4;
  $(".person").css("margin-top", personY + "px");
  $('.personImg').attr("src", "img/walk/climb.png");
}

function rise(){
  personY+=4;
  $(".person").css("margin-top", personY + "px");
  $('.personImg').attr("src", "img/walk/climb.png");
}

$(document).ready(function(){
  //37:Left 38:up 39:Right 40:Down 32:空格
  $(document).keydown(function (event) {
    switch (event.which) {
      case 37:  walkLeft();   break;
      case 39:  walkRight();  break;
      case 40:  rise(); break;
      case 32:  jump(); break;
      case 38:  drop(); break;
      default:  break;
    }
  });

  $(document).keyup(function (event) {
    switch (event.which) {
      case 37:  $('.personImg').attr("src", walkLeftImgArray[0]);
                break;
      case 39:  $('.personImg').attr("src", walkRightImgArray[0]);
                break;
      default:  break;
    }
  });
});  
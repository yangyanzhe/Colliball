/*******************************************************************
*** 游戏规则的相关说明
********************************************************************/

//变量声明与赋值
var imageSpeed = 500,
    imageWidth = 960,
    currentID = Number(localStorage['imgID']) || 0,
    nextID;


function rotateOnClick(nextID){
  //移动变换
  $('#imageBox').animate({left: "-" + nextID*imageWidth+"px"} , imageSpeed); 
  $('#titleBox').animate({left: "-" + nextID*imageWidth+"px"} , imageSpeed); 

  //ID交换
  currentID = nextID;
  localStorage['imgID'] = currentID;
}

$(document).ready(function(){
  $('#Slides_leftLogo').click(function(){
    rotateOnClick((currentID+6)%7);
  });

  $('#Slides_rightLogo').click(function(){
    rotateOnClick((currentID+1)%7);
  });

});






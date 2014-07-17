/*****************************************************************
*** client.js
*** author： 杨妍喆
*** time： 2014/7/15
*** function: 用来实现客户端,帮助实现online模式下的多人同步操作
*******************************************************************/

var col= ["#31c6e4", "#2ce4ab", "#a6e42f", "#e4de31",
		  "#ffad50", "#e4472d", "#ffad50", "#e4de31",
		  "#a6e42f", "#2ce4ab"];
var pos = 0;
var username;


function setUsername(){
  //trim函数，去除前后的空格，保障输入的鲁棒性
    username = $('.usernameInput').val().trim();
    if (username) {
      socket.emit('add user', {
        username: username,
        leftBall: leftBall,
        rightBall: rightBall,
        width: w,
        height: h
      });
    }
}

function changeColor(){
  	if(pos<0||pos>9){
  		pos=0;
  	}
  	$('.cover').css("background", col[pos]);
  	setTimeout(changeColor, 4000);
  	pos++;
}

$(document).ready(function(){
	 changeColor();
});

window.onbeforeunload = function(){socket.emit("client_disconnect");}

$(document).keydown(function (event) {
    if (event.which === 13) {
      setUsername();
      bgm1.pause();
      bgm2.play();
    }
 });


/****************与服务器响应的函数************/
//如果人够了，且为第一个，进入开始模式
socket.on('start', function(data){
    step = 1;
    $('.cover').css("z-index", '1');
    $('.partLeft').css("right", '50%');
    $('.partRight').css("left", '50%');
});

//如果人够了，且为第二个，进入开始模式
socket.on('login', function(data){
    
    id = data.id;
    leftBall = data.leftBall;
    rightBall = data.rightBall;
    step = 1;
    $('.cover').css("z-index", '1');
    $('.partLeft').css("right", '50%');
    $('.partRight').css("left", '50%');
});

//如果只有一个人在线，进入等待模式
socket.on('waiting', function(data){   
    id = data.id;
    $(".form").fadeOut(500);
    setTimeout(function(){
        $(".form>input").remove();
        $(".form>h3").text("Waiting for another friends. ^ ^");
    }, 500);
    $(".form").fadeIn(500);
    init(10,"myCanvas", w, h,main);
});

//当已经有两个人在线时，进入观战模式
socket.on('watching', function(data){
    id = data.id;
    leftBall = data.leftBall;
    rightBall = data.rightBall;

    $(".form").fadeOut(500);
    setTimeout(function(){
        $(".form>input").remove();
        $(".form>h3").text("即将进入观战模式，现在比赛的是"+data.A+"与"+data.B);
    }, 500);
    $(".form").fadeIn(500);
    init(10,"myCanvas", w, h,main);

    setTimeout(function(){
         step = 1;
        $('.cover').css("z-index", '1');
        $('.partLeft').css("right", '50%');
        $('.partRight').css("left", '50%');
    }, 2000);
});

socket.on('position change', function(data){
    if(backLayer.childList.length-5 != data.positions.length){
      console.log("error: 两侧的球数量不等"+"传来的球:" + data.positions.length );
    }
    for(var i = 0; i < data.positions.length; i++){
        var ball = backLayer.childList[i+5];
        ball.box2dBody.SetPosition(data.positions[i]);
    }  
});

socket.on('begin step3', function(){
    deleteBall();
});

socket.on('begin step4', function(data){
    if (user == 1) {
        user = 2;
    }
    else if (user == 2) {
        user = 1;
    }
    checkScore();
    step = 1;
    IsValid = false;
});

//如果有人走了
socket.on('user left', function(data){
    alert(data.username+"离开了");
    if(id > data.id){id--;}
});
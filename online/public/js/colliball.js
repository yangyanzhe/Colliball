/*****************************************************
**  colliball.js
**  author: 林聪
**  time: 2014/7/15
**  function: 实现球的碰撞模拟
*******************************************************/

var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;      //可见区域高度
var step = 0;
var user = 1;
var IsValid = false;
var leftScore = 0;
var rightScore = 0;
var leftBall = [];
var rightBall = [];
var leftUserTime = [];
var rightUserTime = [];
var left = "green_";
var right = "yellow_";
vector = Box2D.Common.Math.b2Vec2;

//添加辅助client.js的变量
var id;
var socket = io();

var bgm1 = document.createElement("audio");
bgm1.src = "sound/dumbwaystodielyrics.mp3";
bgm1.play();
var bgm2 = document.createElement("audio");
bgm2.src = "sound/dumbwaystodie.mp3";

for (var i = 0; i < 6; i++)
{
    leftBall.push(left + random(1, 3));
    rightBall.push(right + random(1, 3));
    leftUserTime.push(0);
    rightUserTime.push(0);
}

var backLayer,cLayer,wallLayer,bitmap,loadingLayer;  
var imglist = {};  
var imgData = new Array(  
        {name:"green_1",path:"img/green_1.png"},  
        {name:"green_2",path:"img/green_2.png"}, 
        {name:"green_3",path:"img/green_3.png"}, 
        {name:"yellow_1",path:"img/yellow_1.png"},  
        {name:"yellow_2",path:"img/yellow_2.png"},  
        {name:"yellow_3",path:"img/yellow_3.png"}
        );  

init(10,"myCanvas", w, h,main);  

$(document).ready(function(){
    changeColor();

    var modeArray = $('.hint').children();
    $(modeArray).click(function(){
      
        $('.cover').css("z-index", '1');
        $('.cover').css("z-index", '2');
        $('.partLeft').css("right", '50%');
        $('.partRight').css("left", '50%');
        switch($(this).attr("rel")){
            case "2Player": start2PlayerMode(); break;
            case "4Player": start4PlayerMode(); break;
            case "Online": startOnlineMode(); break;
            default: break;
        }
    });
});

function main(){      
    //会将box2d创建的debug刚体也一起显示出来
    LGlobal.setDebug(false);    
    backLayer = new LSprite();   
    addChild(backLayer);    
    
    //进度条功能 
    loadingLayer = new LoadingSample3(); 
    backLayer.addChild(loadingLayer); 
   
    LLoadManage.load(  
        //需要加载数据的数组
        imgData,  
        //加载过程中调用的函数，一般用来显示进度
        function(progress){  
            loadingLayer.setProgress(progress);  
        },  
        //当数据加载完成时调用此函数
        function(result){  
            imglist = result;  
            //移除进度条
            backLayer.removeChild(loadingLayer);  
            loadingLayer = null;  
            gameInit();  
        }  
    );  
}  

function gameInit(event){  
    LGlobal.box2d = new LBox2d([0, 0]);  
    //创建背景
    wallLayer = new LSprite();  
    wallLayer.graphics.drawRect(10,"#000000",[0, 0, w, h],true,"#123280");  
    wallLayer.alpha = 0;  
    backLayer.addChild(wallLayer); 

    /******************创建围墙***************************
    **  addBodyPolygon参数为：宽、高、静态/动态、密度、摩擦、弹力
    **  第三个参数设置为静态时后面的参数可以忽略
    **  这里将围墙设为静态物体
    ********************************************************/

    //创建上墙，其中质心为(w/2, 0),宽:w, 高:10, 为静态物体
    wallLayer = new LSprite();  
    wallLayer.x = w/2;  
    wallLayer.y = 0;  
    backLayer.addChild(wallLayer);  
    wallLayer.addBodyPolygon(w,3,0);  

    //创建左墙
    wallLayer = new LSprite();  
    wallLayer.x = 0;  
    wallLayer.y = h/2;  
    backLayer.addChild(wallLayer);  
    wallLayer.addBodyPolygon(3,h,0);  

    //创建下墙
    wallLayer = new LSprite();  
    wallLayer.x = w/2;  
    wallLayer.y = h;  
    backLayer.addChild(wallLayer);  
    wallLayer.addBodyPolygon(w,3,0);  
    
    //创建右墙
    wallLayer = new LSprite();  
    wallLayer.x = w;  
    wallLayer.y = h/2;  
    backLayer.addChild(wallLayer);  
    wallLayer.addBodyPolygon(3,h,0);  
    
    setInterval(check, 30);
}  

var isMouseDown = 0;

function mouseDown(evt){ 
    var a = evt.currentTarget;
    if (a.IsValid == false){
        a.setBodyMouseJoint(false);
        return;
    }
    if(a.belongUser == user && user == id){
        isMouseDown = 1; 
        if  (
            (a.belongUser == 1 && a.x + a.getWidth() / 2 < 0.15 * w) ||
            (a.belongUser == 2 && a.x + a.getWidth() / 2 > 0.85 * w)
            )
        {
            a.setBodyMouseJoint(true);
            a.addEventListener(LMouseEvent.MOUSE_MOVE, mouseMove);
            backLayer.addEventListener(LMouseEvent.MOUSE_UP, mouseUp);
        } 
        else a.setBodyMouseJoint(false);     
    }
    else a.setBodyMouseJoint(false);
    a.IsValid = false;
    step = 2.5;
}  

function mouseMove(evt){
    if (isMouseDown == 1)
    {
        var a = evt.currentTarget;
        if(
            a.belongUser == 1 && (a.x + a.getWidth() / 2 > 0.15 * w) ||
            a.belongUser == 2 && (a.x + a.getWidth() / 2 < 0.85 * w)
            )
        {
            if (a.box2dBody.mouseJoint == true){
                a.box2dBody.mouseJoint = false;
                if (LGlobal.box2d.mouseJoint){
                    LGlobal.box2d.world.DestroyJoint(LGlobal.box2d.mouseJoint);
                    LGlobal.box2d.mouseJoint = null;
                }
                IsValid = true;
            }
        } 
    }
}

function mouseUp(){
    isMouseDown = 0;
    IsValid = true;
    backLayer.removeEventListener(LMouseEvent.MOUSE_UP, mouseUp);
}


function check(){
    
    if (step == 1)//生成小球
    {
        //左边用户操作
        if (user == 1){
            if (leftBall.length > 0)
                createBall("left", user, leftBall.shift(), leftUserTime.shift());
            else user = 2;
        }
        if (user == 2){
            if (rightBall.length > 0)
            {
                createBall("right", user, rightBall.shift(), rightUserTime.shift());
            }
            else if (leftBall.length > 0)
            {
                user = 1;
                createBall("left", user, leftBall.shift(), leftUserTime.shift());
            }
            else {
                alert("游戏结束");
                step = -1;
            }
        };
        step = 2;
    }
    //用户操作直至操作完毕
    if (step == 2.5)
    {
        //同步画面
        var positions = new Array();
        for(var i = 5; i<backLayer.childList.length; i++){
            var ball = backLayer.childList[i];
            positions[i-5] = ball.box2dBody.GetPosition();
        }
        socket.emit('position change', {username: username, positions: positions});


        if (IsValid == true){
            checkSleep(true);
        } 
    }
    if (step == 3){
        socket.emit('begin step3');
        deleteBall();
    }
    //等待一段时间后进行初始化
    if (step == 4){
        socket.emit('begin step4', {user: user});
        if (user == 1) {
            user = 2;
        }
        else if (user == 2) {
            user = 1;
        }
        checkScore();
        step = 1;
        IsValid = false;
    }
}

function checkSleep(){
    num = 0;
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        if (a) {
            if (!a.box2dBody.IsAwake()) {
                num += 1;
            };
        };
    }
    if(num == backLayer.childList.length - 5){
        step = 3;
    }
}

function deleteBall(){
    num = 0;
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        if (a) {
            if (!a.box2dBody.IsAwake()) {
                num++;
            };
        };
    }
    if(num == backLayer.childList.length - 5){
        for (i = backLayer.childList.length - 1; i > 4; i--){
            a = backLayer.childList[i];

            if (a.x + a.getWidth()/2 > 0.85 * w){
                if (a.useTime <= 3){
                    rightBall.push(right + a.picName.substr(-1));
                    rightUserTime.push(a.useTime);
                }
                a.remove();
            }
            if (a.x + a.getWidth()/2 < 0.15 * w){
                if (a.useTime <= 3){
                    leftBall.push(left + a.picName.substr(-1));
                    leftUserTime.push(a.useTime);
                }
                a.remove();
            }
        }
        step = 4;
    }
}

function checkScore(){
    var leftScore = 0;
    var rightScore = 0;
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        if (a.belongUser == 1 && a.x + a.getWidth()/2 > 0.5 * w && a.x + a.getWidth()/2 < 0.85 * w)
            leftScore += 1;
        if (a.belongUser == 2 && a.x + a.getWidth()/2 < 0.5 * w && a.x + a.getWidth()/2 > 0.15 * w)
            rightScore += 1;
    }
    $("#leftScore").fadeOut(500);
    $("#rightScore").fadeOut(500);
    $("#leftScore").html(leftScore);
    $("#rightScore").html(rightScore);
    $("#leftScore").fadeIn(500);
    $("#rightScore").fadeIn(500);
}

function createBall(position, id, pic, usertime){
    cLayer = new LSprite(); 
    //图片
    bitmap = new LBitmap(new LBitmapData(imglist[pic]));  
    cLayer.addChild(bitmap);
    //坐标
    if (position == "left") {
        x = 0.075 * w;
        y = h / 2;
    };
    if (position == "right") {
        x = 0.925 * w;
        y = h / 2;
    };
    cLayer.x = x - cLayer.getWidth() / 2;
    cLayer.y = y - cLayer.getHeight() / 2; 
    //用户
    cLayer.belongUser = id;
    cLayer.picName = pic;
    cLayer.useTime = usertime + 1;
    cLayer.inValid = true;

    backLayer.addChild(cLayer);  
    cLayer.addBodyCircle(bitmap.getWidth()*0.5, bitmap.getHeight()*0.5, bitmap.getWidth()*0.5, 1, .5,.4,.5);  
    cLayer.setBodyMouseJoint(true); 
    //线阻力和角阻力
    cLayer.box2dBody.m_linearDamping = 0.8;
    cLayer.box2dBody.m_angularDamping = 0.8;
    //小质量 中质量 大质量设置
    if (pic.substr(-1) == 1)
        cLayer.box2dBody.m_mass = 3;
    else if (pic.substr(-1) == 2)
        cLayer.box2dBody.m_mass = 7;
    else cLayer.box2dBody.m_mass = 15;

    cLayer.addEventListener(LMouseEvent.MOUSE_DOWN, mouseDown);  //添加数遍点击的监听事件
    
}

//生成范围随机数
function random(min,max){
    return Math.floor(min+Math.random()*(max-min + 1));
}
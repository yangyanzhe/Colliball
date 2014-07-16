var w = document.documentElement.clientWidth;
var h = document.documentElement.clientHeight;//可见区域高度
var Mode = 0;		
var step = 0;
var user = 1; //两人为1,2；四人为1,2,3,4
var IsValid = false;
var leftScore = 0;
var rightScore = 0;


//mode1
var leftBall = [];
var rightBall = [];
var leftUserTime = [];
var rightUserTime = [];
var left = "green_";
var right = "yellow_";

//mode2
var leftupBall = [];
var rightupBall = [];
var leftdownBall = [];
var rightdownBall = [];

var leftupUserTime = [];
var rightupUserTime = [];
var leftdownUserTime = [];
var rightdownUserTime = [];

var leftup = "red_";
var leftdown = "yellow_";
var rightup = "blue_";
var rightdown = "green_";


function gameModeInit(gameMode){
	if (gameMode == 1){
		$("#leftScore").attr("id", "leftScore_1");
		$("#rightScore").attr("id", "rightScore_1");

		node = $("<div/>");
		node.attr("id", "leftBall");
		node.attr("class", "ball");
		$("#waitingLeft").append(node);

		node = $("<div/>");
		node.attr("id", "rightBall");
		node.attr("class", "ball");
		$("#waitingRight").prepend(node);

		for (var i = 0; i < 6; i++)
		{
		    m = left + random(1, 3);
		    n = right + random(1, 3);
		    leftBall.push(m);
		    pushToBallList_1("left", m);
		    rightBall.push(n);
		    pushToBallList_1("right", n);
		    leftUserTime.push(0);
		    rightUserTime.push(0);
		}
	}
	if (gameMode == 2){
		$("#leftScore").attr("id", "leftScore_2");
		$("#rightScore").attr("id", "rightScore_2");

		node1 = $("<div/>");
		node1.attr("id", "leftdownBall");
		node1.attr("class", "ball");
		$("#waitingLeft").append(node1);

		node2 = $("<div/>");
		node2.attr("id", "leftupBall");
		node2.attr("class", "ball");
		$("#waitingLeft").prepend(node2);

		node1 = $("<div/>");
		node1.attr("id", "rightdownBall");
		node1.attr("class", "ball");
		$("#waitingRight").append(node1);

		node2 = $("<div/>");
		node2.attr("id", "rightupBall");
		node2.attr("class", "ball");
		$("#waitingRight").prepend(node2);

		$("#gamingRight").css('background', "#ffcdc1");
		$("#gamingLeft").css('background', "#b5e7f7");
		$("#leftScore_2").css('color', "#ff494a");
		$("#rightScore_2").css('color', "#29bae7");


		for (var i = 0; i < 3; i++)
		{
		    m = leftup + random(1, 3);
		    n = leftdown + random(1, 3);
		    p = rightup + random(1, 3);
		    q = rightdown + random(1, 3);

		    leftupBall.push(m);
		    pushToBallList_2("leftup", m);

		    leftdownBall.push(n);
		    pushToBallList_2("leftdown", n);

		    rightupBall.push(p);
		    pushToBallList_2("rightup", p);

		    rightdownBall.push(q);
		    pushToBallList_2("rightdown", q);

		    leftupUserTime.push(0);
		    rightupUserTime.push(0);
		    leftdownUserTime.push(0);
		    rightdownUserTime.push(0);
		}
	}
	Mode = gameMode;
	setTimeout(function(){
		step = 1
	}, 1000);
}

//生成范围随机数
function random(min,max){
    return Math.floor(min+Math.random()*(max-min + 1));
}

//加载图片并初始化canvas
init(10,"myCanvas", w, h,main);  
var backLayer,cLayer,wallLayer,bitmap,loadingLayer;  
var imglist = {};  
var imgData = new Array(  
        {name:"green_1",path:"img/green_1.png"},  
        {name:"green_2",path:"img/green_2.png"}, 
        {name:"green_3",path:"img/green_3.png"}, 
        {name:"yellow_1",path:"img/yellow_1.png"},  
        {name:"yellow_2",path:"img/yellow_2.png"},  
        {name:"yellow_3",path:"img/yellow_3.png"},
        {name:"red_1",path:"img/red_1.png"},  
        {name:"red_2",path:"img/red_2.png"}, 
        {name:"red_3",path:"img/red_3.png"}, 
        {name:"blue_1",path:"img/blue_1.png"},  
        {name:"blue_2",path:"img/blue_2.png"},  
        {name:"blue_3",path:"img/blue_3.png"}
        );  

function main(){      
	 //将box2d创建的debug刚体也一起显示出来
    LGlobal.setDebug(false);   
    backLayer = new LSprite();    
    addChild(backLayer);      
      
    //进度条功能  
    loadingLayer = new LoadingSample3(); 
    backLayer.addChild(loadingLayer); 
    //LLoadManage同时读取图片，文本和js文件    
    LLoadManage.load(  
    	//需要加载数据的数组
        imgData,  
        function(progress){  
            loadingLayer.setProgress(progress);  
        },  //加载过程中调用的函数，一般用来显示进度
        function(result){  
            imglist = result;  
            backLayer.removeChild(loadingLayer);  //移除进度条
            loadingLayer = null;  
            gameInit();  //游戏初始化
        }  //当数据加载完成时调用此函数
    );  
}  
function gameInit(event){  
    LGlobal.box2d = new LBox2d([0, 0]);  
    //创建背景
    wallLayer = new LSprite();  
    wallLayer.graphics.drawRect(10,"#000000",[0, 0, w, h],true,"#123280");  
    wallLayer.alpha = 0;  
    backLayer.addChild(wallLayer); 

    /*****************************************************************
    **创建围墙
    **addBodyPolygon参数为：宽、高、静态/动态、密度、摩擦、弹力
    **第三个参数设置为静态时后面的参数可以忽略
    **这里将围墙设为静态物体
    ******************************************************************/

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
    
    LGlobal.box2d.setEvent(LEvent.BEGIN_CONTACT, beginContact);
    setInterval(check, 100);
}  

//碰撞检测函数
function beginContact(contact){
	var audio = document.createElement("audio");

    c1 = contact.GetFixtureA().GetBody().GetUserData().picName;
    c2 = contact.GetFixtureB().GetBody().GetUserData().picName;
    if(typeof(c1) == "undefined")
    	c1 = 3;
    else c1 = c1.substr(-1);
    if(typeof(c2) == "undefined")
    	c2 = 3;
    else c2 = c2.substr(-1);

    if (c1 == 1){
    	audio.src = "sound/23.wav";
    }
    else if (c1 == 2){
    	audio.src = "sound/22.wav";
    }
    else if (c1 == 3){
    	audio.src = "sound/13.wav";
    }
    audio.play();
}

function check(){
	if (Mode == 1)
	{
		if (step == 1)//生成小球
	    {
	        //左边用户操作
	        if (user == 1){
	            if (leftBall.length > 0)
	                createBall_1("left", user, leftBall.shift(), leftUserTime.shift());
	            else user = 2;
	        }
	        if (user == 2){
	            if (rightBall.length > 0)
	            {
	                createBall_1("right", user, rightBall.shift(), rightUserTime.shift());
	            }
	            else if (leftBall.length > 0)
	            {
	                user = 1;
	                createBall_1("left", user, leftBall.shift(), leftUserTime.shift());
	            }
	            else {
	                alert("游戏结束");
	                step = -1;
	            }
	        };
	        step = 2;
	    }
	    if (step == 2.5)//用户操作直至操作完毕
	    {
	        
	        if (IsValid == true){
	            checkSleep(true);
	        } 
	    }
	    if (step == 3){
	        deleteBall_1();
	    }
	    //等待一段时间后进行初始化
	    if (step == 4){
	        if (user == 1) {
	            user = 2;
	        }
	        else if (user == 2) {
	            user = 1;
	        }
	        checkScore_1();
	        step = 1;
	        IsValid = false;
	    }
	}
	if (Mode == 2)
	{
		if (step == 1)//生成小球
	    {
	        step = 2;
	        if (user == 1){
	            if(leftupBall.length > 0){
	                user = 1;
	                createBall_2("leftup", user, leftupBall.shift(), leftupUserTime.shift());
	            }
	            else if(leftdownBall.length > 0){
	                user = 2;
	                createBall_2("leftdown", user, leftdownBall.shift(), leftdownUserTime.shift());
	            }
	            else if(rightupBall.length > 0){
	                user = 3;
	                createBall_2("rightup", user, rightupBall.shift(), rightupUserTime.shift());
	            }
	            else if(rightdownBall.length > 0){
	                user = 4;
	                createBall_2("rightdown", user, rightdownBall.shift(), rightdownUserTime.shift());
	            }
	            else{
	                alert("游戏结束");
	                step = -1;
	            }
	        }
	        else if (user == 2){
	            if(leftdownBall.length > 0){
	                user = 2;
	                createBall_2("leftdown", user, leftdownBall.shift(), leftdownUserTime.shift());
	            }
	            else if(leftupBall.length > 0){
	                user = 1;
	                createBall_2("leftup", user, leftupBall.shift(), leftupUserTime.shift());
	            }
	            else if(rightupBall.length > 0){
	                user = 3;
	                createBall_2("rightup", user, rightupBall.shift(), rightupUserTime.shift());
	            }
	            else if(rightdownBall.length > 0){
	                user = 4;
	                createBall_2("rightdown", user, rightdownBall.shift(), rightdownUserTime.shift());
	            }
	            else{
	                alert("游戏结束");
	                step = -1;
	            }
	        }
	        else if (user == 3){
	            if(rightupBall.length > 0){
	                user = 3;
	                createBall_2("rightup", user, rightupBall.shift(), rightupUserTime.shift());
	            }
	            else if(rightdownBall.length > 0){
	                user = 4;
	                createBall_2("rightdown", user, rightdownBall.shift(), rightdownUserTime.shift());
	            }
	            else if(leftupBall.length > 0){
	                user = 1;
	                createBall_2("leftup", user, leftupBall.shift(), leftupUserTime.shift());
	            }
	            else if(leftdownBall.length > 0){
	                user = 2;
	                createBall_2("leftdown", user, leftdownBall.shift(), leftdownUserTime.shift());
	            }
	            else{
	                alert("游戏结束");
	                step = -1;
	            }
	        }
	        else if (user == 4){
	            if(rightdownBall.length > 0){
	                user = 4;
	                createBall_2("rightdown", user, rightdownBall.shift(), rightdownUserTime.shift());
	            }
	            else if(rightupBall.length > 0){
	                user = 3;
	                createBall_2("rightup", user, rightupBall.shift(), rightupUserTime.shift());
	            }
	            else if(leftupBall.length > 0){
	                user = 1;
	                createBall_2("leftup", user, leftupBall.shift(), leftupUserTime.shift());
	            }
	            else if(leftdownBall.length > 0){
	                user = 2;
	                createBall_2("leftdown", user, leftdownBall.shift(), leftdownUserTime.shift());
	            }
	            else{
	                alert("游戏结束");
	                step = -1;
	            }
	        } 
	    }

	    if (step == 2.5)//用户操作直至操作完毕
	    {
	        
	        if (IsValid == true){
	            checkSleep(true);
	        } 
	    }
	    if (step == 3){
	        deleteBall_2();
	    }
	    if (step == 4){
	        if (user == 1) {
	            user = 3;
	        }
	        else if (user == 2) {
	            user = 4;
	        }
	        else if (user == 3) {
	            user = 2;
	        }
	        else if (user == 4) {
	            user = 1;
	        }
	        checkScore_2();
	        if (user == 1 || user == 3){
            	$("#gamingRight").css('background', "#ffcdc1");
				$("#gamingLeft").css('background', "#b5e7f7");
				$("#leftScore_2").css('color', "#ff494a");
				$("#rightScore_2").css('color', "#29bae7");
            }
            if (user == 2 || user == 4){
            	$("#gamingRight").css('background', "#ffefa9");
				$("#gamingLeft").css('background', "#b6f8bb");
				$("#leftScore_2").css('color', "#ffd308");
				$("#rightScore_2").css('color', "#39e8af");
            }
	        step = 1;
	        IsValid = false;
	    }
	}
}

function createBall_1(position, id, pic, usertime){
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
    

    cLayer.box2dBody.m_angularDamping = 100;
    //小质量 中质量 大质量设置
    if (pic.substr(-1) == 1)
        cLayer.box2dBody.m_linearDamping = 0.3;
    else if (pic.substr(-1) == 2)
        cLayer.box2dBody.m_linearDamping = 0.6;
    else cLayer.box2dBody.m_linearDamping = 1.0;

    cLayer.addEventListener(LMouseEvent.MOUSE_DOWN, mouseDown_1);  //添加数遍点击的监听事件
    

    //剩余球列表的更改
    popFromBallList_1(position);
}

function createBall_2(position, id, pic, usertime){
    cLayer = new LSprite(); 
    //图片
    bitmap = new LBitmap(new LBitmapData(imglist[pic]));  
    cLayer.addChild(bitmap);
    //坐标
    if (position == "leftup") {
        x = 0.075 * w;
        y = h / 4;
    };
    if (position == "rightup") {
        x = 0.925 * w;
        y = h / 4;
    };
    if (position == "leftdown") {
        x = 0.075 * w;
        y = 3 * h / 4;
    };
    if (position == "rightdown") {
        x = 0.925 * w;
        y = 3 * h / 4;
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
    
    cLayer.box2dBody.m_angularDamping = 100;
    //小质量 中质量 大质量设置
    if (pic.substr(-1) == 1)
        cLayer.box2dBody.m_linearDamping = 0.3;
    else if (pic.substr(-1) == 2)
        cLayer.box2dBody.m_linearDamping = 0.6;
    else cLayer.box2dBody.m_linearDamping = 1.0;

    cLayer.addEventListener(LMouseEvent.MOUSE_DOWN, mouseDown_2);  //添加数遍点击的监听事件
    //剩余球列表的更改
    popFromBallList_2(position);
}

function pushToBallList_1(position, picName){
    na = "img/list/" + picName + ".png";
    nb = $('<img/>').attr("src", na);
    nb.attr("class", "picList");
    na = $('<div/>').append(nb);
    if(position == "left"){
        $("#leftBall").append(na);
    }
    if(position == "right"){
        $("#rightBall").prepend(na);
    }
}

function pushToBallList_2(position, picName){
    na = "img/list/" + picName + ".png";
    nb = $('<img/>').attr("src", na);
    nb.attr("class", "picList");
    na = $('<div/>').append(nb);
    if(position == "leftdown"){
        $("#leftdownBall").append(na);
    }
    if(position == "rightup"){
        $("#rightupBall").prepend(na);
    }
    if(position == "rightdown"){
        $("#rightdownBall").append(na);
    }
    if(position == "leftup"){
        $("#leftupBall").prepend(na);
    }
}


function popFromBallList_1(position){
    if(position == "left"){
        $("#leftBall").fadeOut("normal");
        $("#leftBall")[0].firstElementChild.remove();
        $("#leftBall").fadeIn("normal");
    }
    if(position == "right"){
        $("#rightBall").fadeOut("normal");
        $("#rightBall")[0].lastElementChild.remove();
        $("#rightBall").fadeIn("normal");
    }
}

function popFromBallList_2(position){
    if(position == "leftdown"){
        $("#leftdownBall").fadeOut("normal");
        $("#leftdownBall")[0].firstElementChild.remove();
        $("#leftdownBall").fadeIn("normal");
    }
    if(position == "rightup"){
        $("#rightupBall").fadeOut("normal");
        $("#rightupBall")[0].lastElementChild.remove();
        $("#rightupBall").fadeIn("normal");
    }
    if(position == "rightdown"){
        $("#rightdownBall").fadeOut("normal");
        $("#rightdownBall")[0].firstElementChild.remove();
        $("#rightdownBall").fadeIn("normal");
    }
    if(position == "leftup"){
        $("#leftupBall").fadeOut("normal");
        $("#leftupBall")[0].lastElementChild.remove();
        $("#leftupBall").fadeIn("normal");
    }
}


//鼠标事件

var isMouseDown = 0;
//加入波点
function mouseDown_1(evt){ 
    isMouseDown = 1; 

    var a = evt.currentTarget;
    if (a.IsValid == false){
        a.setBodyMouseJoint(false);
        return;
    }
    if(a.belongUser == user){
        if  (
            (a.belongUser == 1 && a.x + a.getWidth() / 2 < 0.15 * w) ||
            (a.belongUser == 2 && a.x + a.getWidth() / 2 > 0.85 * w)
            )
        {
            a.setBodyMouseJoint(true);
            a.addEventListener(LMouseEvent.MOUSE_MOVE, mouseMove_1);
            backLayer.addEventListener(LMouseEvent.MOUSE_UP, mouseUp);
        } 
        else a.setBodyMouseJoint(false);
    }
    else a.setBodyMouseJoint(false);
    a.IsValid = false;
    step = 2.5;

}  

function mouseMove_1(evt){
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


function mouseDown_2(evt){ 
    isMouseDown = 1; 

    var a = evt.currentTarget;
    if (a.IsValid == false){
        a.setBodyMouseJoint(false);
        return;
    }
    if(a.belongUser == user){
        if  (
            (a.belongUser == 1 && a.x + a.getWidth() / 2 < 0.15 * w) ||
            (a.belongUser == 2 && a.x + a.getWidth() / 2 < 0.15 * w) ||
            (a.belongUser == 3 && a.x + a.getWidth() / 2 > 0.85 * w) ||
            (a.belongUser == 4 && a.x + a.getWidth() / 2 > 0.85 * w)
            )
        {
            a.setBodyMouseJoint(true);
            a.addEventListener(LMouseEvent.MOUSE_MOVE, mouseMove_2);
            backLayer.addEventListener(LMouseEvent.MOUSE_UP, mouseUp);
        } 
        else a.setBodyMouseJoint(false);
    }
    else a.setBodyMouseJoint(false);
    a.IsValid = false;
    step = 2.5;
}  

function mouseMove_2(evt){
    if (isMouseDown == 1)
    {
        var a = evt.currentTarget;
        if(
            (a.belongUser == 1 && (a.x + a.getWidth() / 2 > 0.15 * w)) ||
            (a.belongUser == 2 && (a.x + a.getWidth() / 2 > 0.15 * w)) ||
            (a.belongUser == 3 && (a.x + a.getWidth() / 2 < 0.85 * w)) ||
            (a.belongUser == 4 && (a.x + a.getWidth() / 2 < 0.85 * w))
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

function deleteBall_1(){
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
                    temp = right + a.picName.substr(-1);
                    pushToBallList_1("right", temp);
                    rightBall.push(temp);
                    rightUserTime.push(a.useTime);
                }
                a.remove();
            }
            else if (a.x + a.getWidth()/2 < 0.15 * w){
                if (a.useTime <= 3){
                    temp = left + a.picName.substr(-1);
                    pushToBallList_1("left", temp);
                    leftBall.push(temp);
                    leftUserTime.push(a.useTime);
                }
                a.remove();
            }
        }
        step = 4;
    }
}

function deleteBall_2(){
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
                    if (a.y + a.getHeight()/2 < 0.5 * h){
                        temp = rightup + a.picName.substr(-1);
                        pushToBallList_2("rightup", temp);
                        rightupBall.push(temp);
                        rightupUserTime.push(a.useTime);
                    }
                    if (a.y + a.getHeight()/2 > 0.5 * h){
                        temp = rightdown + a.picName.substr(-1);
                        pushToBallList_2("rightdown", temp);
                        rightdownBall.push(temp);
                        rightdownUserTime.push(a.useTime);
                    }
                }
                a.remove();
            }
            else if (a.x + a.getWidth()/2 < 0.15 * w){
                if (a.useTime <= 3){
                    if (a.y + a.getHeight()/2 < 0.5 * h){
                        temp = leftup + a.picName.substr(-1);
                        pushToBallList_2("leftup", temp);
                        leftupBall.push(temp);
                        leftupUserTime.push(a.useTime);
                    }
                    if (a.y + a.getHeight()/2 > 0.5 * h){
                        temp = leftdown + a.picName.substr(-1);
                        pushToBallList_2("leftdown", temp);
                        leftdownBall.push(temp);
                        leftdownUserTime.push(a.useTime);
                    }
                }
                a.remove();
            }
        }
        step = 4;
    }
}

function checkScore_1(){
    var leftScore = 0;
    var rightScore = 0;
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        if (a.belongUser == 1 && a.x + a.getWidth()/2 > 0.5 * w && a.x + a.getWidth()/2 < 0.85 * w)
            leftScore += 1;
        if (a.belongUser == 2 && a.x + a.getWidth()/2 < 0.5 * w && a.x + a.getWidth()/2 > 0.15 * w)
            rightScore += 1;
    }
    
    
    $("#leftScore_1").fadeOut(500);
    $("#rightScore_1").fadeOut(500);
    $("#leftScore_1").html(leftScore);
    $("#rightScore_1").html(rightScore);
    $("#leftScore_1").fadeIn(500);
    $("#rightScore_1").fadeIn(500);
}

function checkScore_2(){
    var leftScore = 0;
    var rightScore = 0;
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        if (((a.belongUser == 1) || (a.belongUser == 2)) && a.x + a.getWidth()/2 > 0.5 * w && a.x + a.getWidth()/2 < 0.85 * w)
            leftScore += 1;
        if (((a.belongUser == 3) || (a.belongUser == 4)) && a.x + a.getWidth()/2 < 0.5 * w && a.x + a.getWidth()/2 > 0.15 * w)
            rightScore += 1;
    }
    $("#leftScore_2").fadeOut(500);
    $("#rightScore_2").fadeOut(500);
    $("#leftScore_2").html(leftScore);
    $("#rightScore_2").html(rightScore);
    $("#leftScore_2").fadeIn(500);
    $("#rightScore_2").fadeIn(500);
}



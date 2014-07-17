var w = document.documentElement.clientWidth;//可见区域宽度
var h = document.documentElement.clientHeight;//可见区域高度
var Mode = 0;//当前模式 1为双人模式 2为四人模式		
var step = 0;//当前游戏进行的阶段
var user = 1; //两人为1,2；四人为1,2,3,4
var IsValid = false;//玩家操作是否有效
var leftScore = 0;//左边玩家得分
var rightScore = 0;//右边玩家得分
var historyMode = 0;//上一次玩的模式，用于replay时判断模式


//双人模式
//双方的可使用球列表
var leftBall = [];
var rightBall = [];
//双方球列表中每个球的使用次数
var leftUserTime = [];
var rightUserTime = [];
//双方球的名字前缀
var left = "green_";
var right = "yellow_";

//四人模式 同双人模式，分为左上下、右上下四个部分
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

//载入背景音乐
var bgm1 = document.createElement("audio");//开始界面和结束界面音乐
bgm1.src = "sound/dumbwaystodielyrics.mp3";
bgm1.play();//开始界面音乐播放
var bgm2 = document.createElement("audio");//游戏进行时音乐
bgm2.src = "sound/dumbwaystodie.mp3";


//根据输入的游戏模式初始化游戏的各个变量
function gameModeInit(gameMode){
	historyMode = gameMode;
	if (gameMode == 1){
		$("#leftScore").attr("id", "leftScore_1");
		$("#rightScore").attr("id", "rightScore_1");

		//根据模式动态调整画面布局
		node = $("<div/>");
		node.attr("id", "leftBall");
		node.attr("class", "ball");
		$("#waitingLeft").append(node);

		node = $("<div/>");
		node.attr("id", "rightBall");
		node.attr("class", "ball");
		$("#waitingRight").prepend(node);

		//初始化双方的可使用球列表
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

		//初始化四人的可使用球列表
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

		//根据当前对战的球颜色显示对应的区域颜色
		$("#gamingRight").css('background', "#ffcdc1");
		$("#gamingLeft").css('background', "#b5e7f7");
		$("#leftScore_2").css('color', "#ff494a");
		$("#rightScore_2").css('color', "#29bae7");

		//初始化四人的可使用球列表
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
	//设置游戏模式，同时游戏开始进入阶段1
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
var backLayer,cLayer,wallLayer,bitmap,loadingLayer, effectLayer;  
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
        {name:"blue_3",path:"img/blue_3.png"},
        {name:"white_1",path:"img/white_1.png"},
        {name:"white_2",path:"img/white_2.png"},
        {name:"white_3",path:"img/white_3.png"}
        );  

//lufyLegend的初始化API
function main(){      
	 //将box2d创建的debug刚体也一起显示出来
    LGlobal.setDebug(false);   
    backLayer = new LSprite();  
    effectLayer = new LSprite();
    addChild(effectLayer); 
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
    
    //全局碰撞检测函数
    LGlobal.box2d.setEvent(LEvent.BEGIN_CONTACT, beginContact);
    //全局游戏阶段检测
    setInterval(check, 100);
}  

//碰撞检测函数
function beginContact(contact){
	var audio = document.createElement("audio");
	//得到两个碰撞物体的名字
    c1 = contact.GetFixtureA().GetBody().GetUserData().picName;
    c2 = contact.GetFixtureB().GetBody().GetUserData().picName;
    //如果其中一个碰撞体为墙，质量设置为最大的球的碰撞效果
    if(typeof(c1) == "undefined")
    	c1 = 3;
    else c1 = c1.substr(-1);
    if(typeof(c2) == "undefined")
    	c2 = 3;
    else c2 = c2.substr(-1);
    //根据碰撞的物体质量不同产生不同的音效
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
	//双人模式下
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
	                end();
	                step = -1;
	            }
	        };
	        step = 2;
	    }
	    if (step == 2.5)//用户操作直至操作完毕
	    {
	        if (IsValid == true){
	        	deleteCorrectSign();//删除产生小球时附加的波纹提示效果
	            checkSleep();//检查所有小球是否均停止运动
	        } 
	    }
	    if (step == 3){
	        deleteBall_1();//删除不在有效区域内的小球
	    }
	    //本轮游戏结束，等待一段时间后进行初始化
	    if (step == 4){
	        if (user == 1) {
	            user = 2;
	        }
	        else if (user == 2) {
	            user = 1;
	        }
	        //计算得分，重新初始化变量，等待进入下一轮step = 1
	        checkScore_1();
	        IsValid = false;
	        step = 5;
	        setTimeout(function(){
	        	step = 1;
	        }, 1000);
	        
	    }
	}
	//四人模式下
	if (Mode == 2)
	{
		if (step == 1)//生成小球
	    {
	        step = 2;
	        //判断玩家的操作顺序（如AB一方，CD一方，如果A没有球了则下一个操作玩家应该是B而不是CD）
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
	                end();
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
	                end();
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
	                end();
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
	                end();
	                step = -1;
	            }
	        } 
	    }

	    if (step == 2.5)//用户操作直至操作完毕
	    {
	        
	        if (IsValid == true){
	        	deleteCorrectSign();
	            checkSleep();
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
	        //根据下一次操作的玩家更改相应的区域颜色和得分颜色
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
	        IsValid = false;
	        step = 5;
	        setTimeout(function(){
	        	step = 1;
	        }, 1000);
	    }
	}
}

//后缀为_1的为双人模式的函数， _2的为四人模式，无后缀表示通用
//双人模式产生小球
function createBall_1(position, id, pic, usertime){
    cLayer = new LSprite(); 
    //图片
    
    //坐标
    if (position == "left") {
        x = 0.075 * w;
        y = h / 2;
    };
    if (position == "right") {
        x = 0.925 * w;
        y = h / 2;
    };
    //产生提示波纹和得分白色圆环
    createWave(x, y, pic);
    bitmap1 = new LBitmap(new LBitmapData(imglist["white_" + pic.substr(-1)]));  
    bitmap1.alpha = 0;
    cLayer.addChild(bitmap1);

    bitmap2 = new LBitmap(new LBitmapData(imglist[pic])); 
    cLayer.addChild(bitmap2);

    cLayer.x = x - cLayer.getWidth() / 2;
    cLayer.y = y - cLayer.getHeight() / 2; 

    bitmap1.x =  -(bitmap1.getWidth() - bitmap2.getWidth())/2;
    bitmap1.y = -(bitmap1.getHeight() - bitmap2.getHeight())/2;

    //当前生成的球
    cLayer.belongUser = id;
    cLayer.picName = pic;
    cLayer.useTime = usertime + 1;
    cLayer.isValid = true;
    //让小球的产生为透明度从0开始的渐变过程
	cLayer.alpha = 0;
    backLayer.addChild(cLayer);  
    cLayer.addBodyCircle(bitmap2.getWidth()*0.5, bitmap1.getWidth()*0.5, bitmap1.getHeight()*0.5, 1, .5,.4,.5);  
    cLayer.setBodyMouseJoint(true);
    LTweenLite.to(cLayer, 0.5, {alpha:1});
    

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


//将球的信息压入玩家的备用球列表中
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


//得到球列表中第一个球的信息并从列表中删除它
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


//鼠标事件

var isMouseDown = 0;

//鼠标单击判断函数
function mouseDown_1(evt){ 
    isMouseDown = 1; 
    deleteWave();//用户操作时即删除波纹提示效果
    var a = evt.currentTarget;
    if (a.IsValid == false){
        a.setBodyMouseJoint(false);
        return;
    }
    //如果当前玩家的颜色和球的颜色相同，同时球的位置在可操作区域，则鼠标与小球关联，可以进行拖拽
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
    a.IsValid = false;//被操作过的小球不可被二次操作
    step = 2.5;//进入2.5的游戏阶段
}  
//鼠标移动判断函数
function mouseMove_1(evt){
    if (isMouseDown == 1)
    {
        var a = evt.currentTarget;
        //在拖拽过程中如果小球的坐标进入了得分区域，则后续的鼠标拖拽应设为无效，
        //删除鼠标和小球的关联，使得小球可以沿着惯性滑动，避免出现可以全屏拖动的现象
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

//鼠标左键松开函数
function mouseUp(){
    isMouseDown = 0;
    IsValid = true;//用户松开鼠标则视为当前操作结束
    backLayer.removeEventListener(LMouseEvent.MOUSE_UP, mouseUp);
}

//检测小球是否均已停止运动
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
    //根据模式对得分的小球进行白色圈环标记
    if(num == backLayer.childList.length - 5){
    	if (Mode == 1)
    		correctSign_1();
    	if (Mode == 2)
    		correctSign_2();
        step = 3;
    }
}

//对不在得分区的小球进行删除操作
function deleteBall_1(){
    num = 0;
    //判断是否所有小球都已停止运动
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        if (a) {
            if (!a.box2dBody.IsAwake()) {
                num++;
            };
        };
    }
    //如果停止运动的小球和总球数相同则进入判断
    if(num == backLayer.childList.length - 5){
        for (i = backLayer.childList.length - 1; i > 4; i--){
            a = backLayer.childList[i];
            //遍历每一个小球，若小球在用户操作区域内且已使用次数没有超过三，则将球信息加入剩余球列表中
            //同时使用缓动类产生淡出的小球消失效果
            if (a.x + a.getWidth()/2 > 0.85 * w){
                if (a.useTime <= 3){
                    temp = right + a.picName.substr(-1);
                    pushToBallList_1("right", temp);
                    rightBall.push(temp);
                    rightUserTime.push(a.useTime);
                }
                LTweenLite.to(a, 0.5, {alpha:0, onComplete:function(e){e.remove();}});
            }
            else if (a.x + a.getWidth()/2 < 0.15 * w){
                if (a.useTime <= 3){
                    temp = left + a.picName.substr(-1);
                    pushToBallList_1("left", temp);
                    leftBall.push(temp);
                    leftUserTime.push(a.useTime);
                }
                LTweenLite.to(a, 0.5, {alpha:0, onComplete:function(e){e.remove();}});
            }
        }
        //进入游戏阶段4
        step = 4;
    }
}


//计算双方游戏得分
function checkScore_1(){
	//初始化得分便于重新计算
    leftScore = 0;
    rightScore = 0;
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        //小球在正确的得分区域时，相应的玩家得分加一分
        if (a.belongUser == 1 && a.x + a.getWidth()/2 > 0.5 * w && a.x + a.getWidth()/2 < 0.85 * w)
            leftScore += 1;
        if (a.belongUser == 2 && a.x + a.getWidth()/2 < 0.5 * w && a.x + a.getWidth()/2 > 0.15 * w)
            rightScore += 1;
    }
    
    //得分更改，以及伴随的淡入淡出效果
    $("#leftScore_1").fadeOut(500);
    $("#rightScore_1").fadeOut(500);
    $("#leftScore_1").html(leftScore);
    $("#rightScore_1").html(rightScore);
    $("#leftScore_1").fadeIn(500);
    $("#rightScore_1").fadeIn(500);
}

//对处在正确区域的小球进行白色圈环的标识
function correctSign_1(){
    //坐标
	for (i = 5; i < backLayer.childList.length; i++){
        k = backLayer.childList[i];
        if (k.belongUser == 1 && k.x + k.getWidth()/2 > 0.5 * w && k.x + k.getWidth()/2 < 0.85 * w)
            LTweenLite.to(k.childList[0], 0.2, {alpha:0.8}).to(k.childList[0], 0.2, {alpha:0.2}).to(k.childList[0], 0.2, {alpha:1});
        if (k.belongUser == 2 && k.x + k.getWidth()/2 < 0.5 * w && k.x + k.getWidth()/2 > 0.15 * w)
            LTweenLite.to(k.childList[0], 0.2, {alpha:0.8}).to(k.childList[0], 0.2, {alpha:0.2}).to(k.childList[0], 0.2, {alpha:1});
    }
}


//删除白色圈环标识
function deleteCorrectSign(){
	for (i = 5; i < backLayer.childList.length; i++){
        k = backLayer.childList[i];
        if (k.childList[0].alpha > 0)
      		LTweenLite.to(k.childList[0], 0.5, {alpha:0});
    }
}

//产生小球提示的波纹效果
function createWave(wx, wy, pic){
	var wave = new Array();
	//创造三个同颜色有一定透明度小球当做底部波纹
	for(var i = 0; i < 3; i++){
		wave[i] = new LSprite();
		wave[i].x = wx;
		wave[i].y = wy;
		p = new LBitmap(new LBitmapData(imglist[pic]));
		p.alpha = 0.3;
		p.x = -p.getWidth()*0.5;
		p.y = -p.getWidth()*0.5;
		wave[i].addChild(p);
		effectLayer.addChild(wave[i]);
	}
	//根据时间差控制三个小球的缩放比例产生逐渐扩大和变淡的波纹效果
	LTweenLite.to(wave[0], 1.5, {scaleX: 2, scaleY: 2,  loop: true}).to(wave[0], 0, {scaleX: 1, scaleY: 1});
	LTweenLite.to(wave[0].childList[0], 1.5, {alpha: 0,  loop: true}).to(wave[0].childList[0], 0, {alpha:0.3});
	setTimeout(function(){
		LTweenLite.to(wave[1], 1.5, {scaleX: 2, scaleY: 2,  loop: true}).to(wave[1], 0, {scaleX: 1, scaleY: 1});
		LTweenLite.to(wave[1].childList[0], 1.5, {alpha: 0,  loop: true}).to(wave[1].childList[0], 0, {alpha:0.3});
	}, 500);
	setTimeout(function(){
		LTweenLite.to(wave[2], 1.5, {scaleX: 2, scaleY: 2,  loop: true}).to(wave[2], 0, {scaleX: 1, scaleY: 1});
		LTweenLite.to(wave[2].childList[0], 1.5, {alpha: 0,  loop: true}).to(wave[2].childList[0], 0, {alpha:0.3});
	}, 1000);
}

//删除小球提示的波纹效果
function deleteWave(){
	while (effectLayer.childList.length > 0)
	{
		effectLayer.childList[0].remove();
	}
}
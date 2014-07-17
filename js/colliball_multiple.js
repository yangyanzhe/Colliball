//四人模式产生小球
function createBall_2(position, id, pic, usertime){
    cLayer = new LSprite(); 
    
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

    //用户
    cLayer.belongUser = id;
    cLayer.picName = pic;
    cLayer.useTime = usertime + 1;
    cLayer.isValid = true;

    cLayer.alpha = 0;
    backLayer.addChild(cLayer);  
    cLayer.addBodyCircle(bitmap2.getWidth()*0.5, bitmap1.getHeight()*0.5, bitmap1.getWidth()*0.5, 1, .5,.4,.5);  
    cLayer.setBodyMouseJoint(true);
    LTweenLite.to(cLayer, 0.5, {alpha:1});
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

//将球的信息压入玩家的备用球列表中
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


//得到球列表中第一个球的信息并从列表中删除它
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

//鼠标单击判断函数
function mouseDown_2(evt){ 
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
    a.IsValid = false;//被操作过的小球不可被二次操作
    step = 2.5;//进入2.5的游戏阶段
}  

//鼠标移动判断函数
function mouseMove_2(evt){
    if (isMouseDown == 1)
    {
        var a = evt.currentTarget;
        //在拖拽过程中如果小球的坐标进入了得分区域，则后续的鼠标拖拽应设为无效，
        //删除鼠标和小球的关联，使得小球可以沿着惯性滑动，避免出现可以全屏拖动的现象
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

//对不在得分区的小球进行删除操作
function deleteBall_2(){
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
                    LTweenLite.to(a, 0.5, {alpha:0, onComplete:function(e){e.remove();}});
                }
                
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
                    LTweenLite.to(a, 0.5, {alpha:0, onComplete:function(e){e.remove();}});
                }
                
            }
        }
        //进入游戏阶段4
        step = 4;
    }
}

//计算双方游戏得分
function checkScore_2(){
    //初始化得分便于重新计算
    leftScore = 0;
    rightScore = 0;
    for (i = 5; i < backLayer.childList.length; i++){
        a = backLayer.childList[i];
        //小球在正确的得分区域时，相应的玩家得分加一分
        if (((a.belongUser == 1) || (a.belongUser == 2)) && a.x + a.getWidth()/2 > 0.5 * w && a.x + a.getWidth()/2 < 0.85 * w)
            leftScore += 1;
        if (((a.belongUser == 3) || (a.belongUser == 4)) && a.x + a.getWidth()/2 < 0.5 * w && a.x + a.getWidth()/2 > 0.15 * w)
            rightScore += 1;
    }

    //得分更改，以及伴随的淡入淡出效果
    $("#leftScore_2").fadeOut(500);
    $("#rightScore_2").fadeOut(500);
    $("#leftScore_2").html(leftScore);
    $("#rightScore_2").html(rightScore);
    $("#leftScore_2").fadeIn(500);
    $("#rightScore_2").fadeIn(500);
}

//对处在正确区域的小球进行白色圈环的标识
function correctSign_2(){
    //坐标
    for (i = 5; i < backLayer.childList.length; i++){
        k = backLayer.childList[i];
        if (((k.belongUser == 1) || (k.belongUser == 2)) && k.x + k.getWidth()/2 > 0.5 * w && k.x + k.getWidth()/2 < 0.85 * w)
            LTweenLite.to(k.childList[0], 0.2, {alpha:0.8}).to(k.childList[0], 0.2, {alpha:0.2}).to(k.childList[0], 0.2, {alpha:1});
        if (((k.belongUser == 3) || (k.belongUser == 4)) && k.x + k.getWidth()/2 < 0.5 * w && k.x + k.getWidth()/2 > 0.15 * w)
            LTweenLite.to(k.childList[0], 0.2, {alpha:0.8}).to(k.childList[0], 0.2, {alpha:0.2}).to(k.childList[0], 0.2, {alpha:1});
    }
}
var col= ["#31c6e4", "#2ce4ab", "#e4de31", "#ffad50",
		  "#e4472d", "#ffad50", "#e4de31", "#2ce4ab"];
var pos = 0;

var imageSpeed = 500,
    imageWidth = 1024,
    currentID = 0,
    nextID;

//规则界面切换函数
function rotateOnClick(nextID){
  //移动变换
  $('#imageBox').animate({left: "-" + nextID*imageWidth+"px"} , imageSpeed); 
  //ID交换
  currentID = nextID;
}

function changeColor(){
	if(pos<0||pos>7){
		pos=0;
	}
	$('.cover').css("background", col[pos]);
	setTimeout(changeColor, 4000);
	pos++;
}

$(document).ready(function(){
	changeColor();

	var modeArray = $('.hint').children();
	$(modeArray).click(function(){
		$('.cover').css("z-index", '1');
		$('.cover').css("z-index", '2');
		$('.partLeft').css("right", '50%');
		$('.partRight').css("left", '50%');
		switch($(this).attr("rel")){
			case "2Player": gameModeInit(1); break;
			case "4Player": gameModeInit(2); break;
			default: break;
		}
        bgm1.pause();
        bgm2.play();
		var w = document.documentElement.clientWidth;
   		var h = document.documentElement.clientHeight;		//可见区域高度
   		setTimeout(function(){}, 1500);
	});


    // 规则显示按钮
    var bottomFlag = 0;
    $("#gameRule").click(function(){
        currentID = 0;
        if (bottomFlag == 0){
            $('#Slides_leftLogo').css("z-index", "5").css("opacity", 1);
            $('#Slides_rightLogo').css("z-index", "5").css("opacity", 1);
            $('#slideBox').css("z-index", "5").css("opacity", 1);
            bottomFlag = 1;
        }
        else{
            $('#Slides_leftLogo').css("opacity", 0);
            $('#Slides_rightLogo').css("opacity", 0);
            $('#slideBox').css("opacity", 0);
            setTimeout(function(){
                $('#Slides_leftLogo').css("z-index", "-1");
                $('#Slides_rightLogo').css("z-index", "-1");
                $('#slideBox').css("z-index", "-1");
            }, 500)
            bottomFlag = 0;
        }
        
    });
    $('#Slides_leftLogo').click(function(){
        rotateOnClick((currentID+7)%7);
    });
    $('#Slides_rightLogo').click(function(){
        rotateOnClick((currentID)%7);
    });




    // 重新开始按钮
    $("#replay").click(function(){
        gameReset();
        $('.partLeft').css("right", '50%');
        $('.partRight').css("left", '50%');
        $('#coverStart').css("display", "none");
        $('#coverEnd').css("display", "block").css("z-index", "1");
        gameModeInit(historyMode);
        bgm1.pause();
        bgm2.src = "sound/dumbwaystodie.mp3";
        bgm2.play();
    })

    // 返回主菜单按钮
    $("#return").click(function(){
        gameReset();
        // $('.partLeft').css("right", '50%');
        // $('.partRight').css("left", '50%');
        $('#coverStart').css("display", "block").css("z-index", "5").css("opacity", "0").css("opacity", "1");
        $('#coverEnd').css("display", "none").css("z-index", "0");
        // gameModeInit(historyMode);
    })

});

//游戏结束后清零
function gameReset(){
    Mode = 0;       
    step = 0;
    user = 1; //两人为1,2；四人为1,2,3,4
    IsValid = false;
    leftScore = 0;
    rightScore = 0;
    $('.ball').remove();
    checkScore_1();
    checkScore_2();
}

//设置退出场景
function end(){
    setTimeout(function(){
        bgm2.pause();
        bgm1.src = "sound/dumbwaystodielyrics.mp3";
        bgm1.play();
        $('#spanLeft').html(leftScore);
        $('#spanRight').html(rightScore);


        $('#myCanvas').css("z-index", "0");
        $('.partLeft').css("right", '100%');
        $('.partRight').css("left", '100%');
        while (backLayer.childList.length > 5){
            backLayer.childList[5].remove();
        }
        while (effectLayer.childList.length > 0){
            effectLayer.childList[0].remove();
        }
        $('#coverStart').css("display", "none");
        $('#coverEnd').css("display", "block").css("z-index", "1");
        setTimeout(function(){
            $('#coverEnd').css("display", "block").css("z-index", "5");
            $('#myCanvas').css("z-index", "4");
        }, 1000);
    }, 2000);
}

//wave的函数
function wavelet(location, path, width){
    var wave = $('<div/>');
    wave.attr("id", "wave");
    wave.css({
        "z-index": 4,
        "position": "absolute",
        "padding": 0,
         "marginLeft": location.x - width*1.5/2 +  'px',
        "marginTop": location.y - width*1.5/2 + 'px',
        "width": width * 1.5 + 'px',
        "height": width * 1.5 + 'px'
    });

    var img = $('<img/>');
    img.attr({
        "src": path
    });
    img.css({
        "width": width * 1.5 + 'px',
        "height": width * 1.5 + 'px',
        "opacity": 0.5
    });
    var order = 2;
    wave.append(img);
    $('body').append(wave);

    setInterval(function(){
        var value = 0;
        var opacity = 0;
        if(order > 3){order = 1;}
        switch(order){
            case 1: value = 1.3;
                    opacity = 0.5;
                    break;
            case 2: value = 1.7;
                    opacity = 0.3;
                    break;
            case 3: value = 2;
                    opacity = 0.1;
                    break;
        }
        order++;
        img.css({
                "width": width * value + 'px',
                "height": width * value + 'px',
                "opacity": opacity
        });
        wave.css({
                "marginLeft": location.x - width*value/2 +  'px',
                "marginTop": location.y - width*value/2 + 'px',
                "width": width * value + 'px',
                "height": width * value + 'px'
        });
    }, 300);
    
}
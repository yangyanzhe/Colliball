var col= ["#31c6e4", "#2ce4ab", "#e4de31", "#ffad50",
		  "#e4472d", "#ffad50", "#e4de31", "#2ce4ab"];
var pos = 0;

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
		var w = document.documentElement.clientWidth;
   		var h = document.documentElement.clientHeight;		//可见区域高度
   		setTimeout(function(){}, 1500);
	});
});


//设置退出场景
function end(){
	var scoreArray = $('.score');
	$('#myCanvas').remove();
	$('.option').remove();
	$('.partLeft').css("right", '100%');
	$('.partRight').css("left", '100%');
	$('.footer').text("Replay");
	$('.hint').css({
		"marginTop": "14%",
	})
	
	setTimeout(function(){
		$('.cover').css("z-index", '5');
		
		var spanLeft = $('<span/>');
		spanLeft.attr("id", "spanLeft");
		spanLeft.text(scoreArray[0].textContent);
		$('.hint').append(spanLeft);

		var mid = $('<span/>');
		mid.attr("id", "spanMid");
		mid.text(":");
		$('.hint').append(mid);

		var spanRight = $('<span/>');
		spanRight.css({
			"fontSize": '300px',
			"marginLeft": "150px",
			"marginRight": "150px"
		});
		spanRight.text(scoreArray[1].textContent);
		$('.hint').append(spanRight);

		$('.footer').css("z-index", '6');
	}, 300);
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
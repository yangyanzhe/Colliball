//波纹函数
function createWave(wx, wy, pic){
	var wave = new Array();
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

function deleteWave(){
	while (effectLayer.childList.length > 0)
	{
		effectLayer.childList[0].remove();
	}
}
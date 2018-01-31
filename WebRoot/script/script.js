//落子数组
var chessBorad = new Array();
var me = true;
var over = false;
//赢法数组
var wins = [];
//赢法统计数组
var myWins = [];
var computerWins = [];
//赢法数量
var count = 0;
//难度系数
var level = 1; //3个等级
//记录机器人和me最后一次落子的坐标
var myI,myJ,comI,comJ;
for (var i = 0; i < 15; i++) {
	chessBorad[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBorad[i][j] = 0;
	}
}
for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
//横线赢法
for(var i = 0;i < 15;i ++){
	for(var j = 0;j <  11;j ++){
		for(var k = 0;k < 5;k ++){ 
			wins[i][j+k][count] = true;
		}
		count ++;
	}
}
//竖线赢法
for(var i = 0;i < 15;i ++){
	for(var j = 0;j < 11;j ++){
		for(var k = 0;k < 5;k ++){
			wins[j+k][i][count] = true;
		}
		count ++;
	}
}
//正斜线赢法
for(var i = 0;i < 11;i ++){
	for(var j = 0;j < 11;j ++){
		for(var k = 0;k < 5;k ++){
			wins[i+k][j+k][count] = true;
		}
		count ++; 
	}
}
//反斜线赢法
for(var i = 4;i < 15;i ++){
	for(var j = 0;j < 11;j ++){
		for(var k = 0;k < 5;k ++){
			wins[i-k][j+k][count] = true;
		}
		count ++;
	}
}

//console.log(count);
for (var i = 0; i < count; i++) {
	myWins[i] = 0;
	computerWins[i] = 0;
}
var chess = document.getElementById('chess');
var context = chess.getContext("2d");
context.strokeStyle="#bfbfbf";
var logo = new Image();
logo.src = "images/logo.png";
//画水印
logo.onload=drawImage;
function drawImage(){
	context.drawImage(logo,0,0,450,450);
	drawChess();
}
//画棋盘
function drawChess(){
	for (var i = 0; i < 15; i++) {
		context.moveTo(15+30*i,15);
		context.lineTo(15+30*i,430);
		context.moveTo(15,15+30*i);
		context.lineTo(430,15+30*i);
		context.stroke();
	}
};
var oneStep = function(i,j,me){
	context.beginPath();
	context.arc(15 + 30*i,15+ 30*j,13,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + 30*i + 2,15+ 30*j - 2,13,15 + 30*i + 2,15+ 30*j - 2,0);
	if(me){
		gradient.addColorStop(0,"#0a0a0a");
		gradient.addColorStop(1,"#636766");
	}else{
		gradient.addColorStop(0,"#d1d1d1");
		gradient.addColorStop(1,"#f9f9f9");
	}
	context.fillStyle=gradient;
	context.fill();
};

chess.onclick = function (e) {
	if(over || !me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	myI = i;
	myJ = j;
	if(chessBorad[i][j] === 0){
		oneStep(i,j,me);
		chessBorad[i][j] = 1;
		for(var k = 0;k < count;k++){
			if(wins[i][j][k]){
				myWins[k]++;
				computerWins[k] = 6;
				if(myWins[k]==5){
					//console.log("你"+k);
					window.alert("你赢了！");
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
			computerAI();
		}
	}
};

var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0, v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for(var j = 0; j < 15; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i = 0;i < 15;i++){
		for(var j = 0; j < 15;j++){
			if(chessBorad[i][j] == 0){
				for(var k = 0;k < count; k++){
					if(wins[i][j][k]){
						if(myWins[k]==1){
							myScore[i][j] += 200*level;
						}else if(myWins[k]==2){
							myScore[i][j] += 300*level;
						}else if(myWins[k]==3){
							myScore[i][j]+=2000*level;
						}else if(myWins[k]==4){
							myScore[i][j]+=10000*level;
						}
						if(computerWins[k]==1){
							computerScore[i][j] += 300*level;
						}else if(computerWins[k]==2){
							computerScore[i][j] += 500*level;
						}else if(computerWins[k]==3){
							computerScore[i][j]+=5000*level;
						}else if(computerWins[k]==4){
							computerScore[i][j]+=30000*level;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(myScore[i][i] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(computerScore[i][i] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	comI = u;
	comJ = v;
	oneStep(u,v,false);
	chessBorad[u][v] = 2;
	for(var k = 0;k < count;k++){
		if(wins[u][v][k]){
			computerWins[k]++;
			myWins[k] = 6;
			if(computerWins[k]==5){
				//console.log("小红"+k);
				window.alert("小红赢了！");
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
	}
};

var deleteOneStep = function(i,j){
	context.beginPath();
	context.arc(15 + 30*i,15+ 30*j,13,0,2*Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + 30*i + 2,15+ 30*j - 2,13,15 + 30*i + 2,15+ 30*j - 2,0);
	gradient.addColorStop(0,"#fff");
	gradient.addColorStop(1,"#fff");
	context.fillStyle=gradient;
	context.fill();
};
//悔棋
var backStep=function(){
	if(over){
		over = false;
		me = !me;
	}
	chessBorad[myI][myJ] = 0;
	chessBorad[comI][comJ] = 0;
	deleteOneStep(myI,myJ);
	deleteOneStep(comI,comJ);
};

//重来
var replay=function(){
	location.reload();
};

//改变难度
var selectLevel=function(val){
	level = val;
	//drawImage();
};
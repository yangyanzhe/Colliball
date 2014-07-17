/*****************************************************************
*** server.js
*** author： 杨妍喆
*** time： 2014/7/15
*** function: 用来实现服务器,帮助实现online模式下的多人同步操作
*******************************************************************/

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 18080;
var widthSet = {};
var heightSet = {};

server.listen(port);

//html路径
app.use(express.static(__dirname + '/public'));

//变量声明
var usernames = [];
var idArray = {};
var numUsers = 0;
var start = false;    //当有两个人同时在线的时候才可以玩
var leftBall = [];
var rightBall = [];
var size

io.on('connection', function(socket){
    var addedUser = false;

    //添加新用户
    socket.on('add user', function (data) {
        addedUser = true;

        //服务器上将为改用户建立用户名、自动分配id、记录屏幕长宽比
        widthSet[data.username] = data.width;
        heightSet[data.username] = data.height;
        socket.username = data.username;
        usernames[numUsers] = data.username;
        numUsers++;
        idArray[data.username] = numUsers;

        //服务器输出，方便调试
        console.log(numUsers);
        console.log(socket.username);

        //完善
        if(numUsers == 1){
            leftBall = data.leftBall;
            rightBall = data.rightBall;
        }

        //如果只有一个人在线
        if(numUsers == 1){
            socket.emit('waiting', {
              id: numUsers
            });  
        }
        //如果多于两人在线
        else if(numUsers > 2){
            socket.emit('watching', {
              A: usernames[0],
              B: usernames[1],
              leftBall: leftBall,
              rightBall: rightBall,
              id: numUsers
            });
        }
        //如果正好有两个人在线
        else if(numUsers == 2){
            socket.emit('login', {
                A: usernames[0],
                B: usernames[1],
                leftBall: leftBall,
                rightBall: rightBall,
                id: numUsers
            });
            socket.broadcast.emit('start', {
                A: usernames[0],
                B: usernames[1],
                num: numUsers
            });
        }
        
    });

    //当用户断开连接时
    socket.on('client_disconnect', function () {
      if (addedUser) {
        delete usernames[socket.username];
        --numUsers;

        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers,
          id: idArray[socket.username]
        });
      }
    });

    //当用户进行鼠标移动操作时
    socket.on('position change', function(data){
        socket.broadcast.emit('position change', {
          username: data.username,
          positions: data.positions 
        });
    });

    //开始清除
    socket.on('begin step3', function(){
        socket.broadcast.emit('begin step3');
    })

    //球主交换
    socket.on('begin step4', function(data){
        socket.broadcast.emit('begin step4', data);
    })
});

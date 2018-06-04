var path = require('path');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var url = require('url');
//var WebSocketServer = require('ws').Server;
const WebSocket = require('ws');
var sesion_estado = "NULA";
var timer;
var html_player_controller = new Object();
//var https = require('https');
var http = require('http');
var fs = require('fs');

var serverConfig = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
};

var HTTP_PORT = 8080;

var httpServer = http.createServer(app).listen(HTTP_PORT);
var ws1 = new WebSocket.Server({noServer: true});
var ws2 = new WebSocket.Server({noServer: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
        }));

ws1.on('connection', function(ws) {
    console.log("nueva conexión player1");
    ws.on('message', function(message) {
    ws1.broadcast(message);
    console.log(message);
    html_player_controller = JSON.parse(message);
    });
});

ws1.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};

ws2.on('connection', function(ws) {
    console.log("nueva conexión player2");
    ws.on('message', function(message) {
    ws2.broadcast(message);
    console.log(message);
    html_player_controller = JSON.parse(message);
    });
});

ws2.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};


httpServer.on('upgrade', function upgrade(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/player1') {
    ws1.handleUpgrade(request, socket, head, function done(ws) {
      ws1.emit('connection', ws, request);
    });
  } else if (pathname === '/player2') {
    ws2.handleUpgrade(request, socket, head, function done(ws) {
      ws2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

app.get(/^(.+)$/, function(req, res){ 
    switch(req.params[0]) {
        case '/aceleracion':
            res.send(JSON.stringify(aceleracion));
            break;
        case '/player2':
	    res.sendFile( __dirname + '/html/player2.html');
            break;
    default: res.sendFile( __dirname + '/html/player1.html'); 
    }
 });

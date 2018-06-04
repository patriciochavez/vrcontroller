var path = require('path');
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var WebSocketServer = require('ws').Server;
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

var HTTP_PORT = 80;

//var httpsServer = https.createServer(serverConfig, app).listen(HTTPS_PORT);
var httpServer = http.createServer(app).listen(HTTP_PORT);
var socket = new WebSocketServer({server: httpServer});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
        }));

socket.on('connection', function(ws) {
    console.log("Nueva conexión");
    ws.on('message', function(message) {
    socket.broadcast(message);
    console.log(message);
    html_player_controller = JSON.parse(message);
    if(html_player_controller.sesion == "NUEVA_SESION") {
    sesion_estado = "ACTIVA";
    socket.broadcast(JSON.stringify(html_player_controller));
    console.log(JSON.stringify(html_player_controller));
    timer = setTimeout(function(){ 
        sesion_estado = "NULA"; 
                html_player_controller.sesion= "FINALIZAR_SESION";
        console.log(JSON.stringify(html_player_controller));
                socket.broadcast(JSON.stringify(html_player_controller));
        }, 30000);  
    } else if(sesion_estado == "ACTIVA"){
    clearTimeout(timer);
        timer = setTimeout(function(){
                sesion_estado = "NULA";
        html_player_controller.sesion = "FINALIZAR_SESION";
        console.log(JSON.stringify(html_player_controller));
        socket.broadcast(JSON.stringify(html_player_controller));  
                }, 30000);
        console.log(JSON.parse(message));
    var objeto = new Object();
    objeto = JSON.parse(message);
    socket.broadcast(JSON.stringify(objeto));
        //wss.broadcast(message);
    } 
    });
});

socket.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};

/*socket.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
	console.log("enviando data a un cliente", data);
    }
  });
};*/

app.get(/^(.+)$/, function(req, res){ 
    switch(req.params[0]) {
        case '/aceleracion':
            res.send(JSON.stringify(aceleracion));
            break;
    default: res.sendFile( __dirname + req.params[0]); 
    }
 });

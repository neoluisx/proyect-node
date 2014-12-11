var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    sanitizer = require('sanitizer'),
    io = require('socket.io').listen(server, {

    });

server.listen(3001);

app.use(express.static(__dirname + '/public'));

app.get('/public', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.get("http://localhost:3001/",function(req,res)
{
	res.render("http://localhost:3001/");});
app.get("/crear_sala.html",function(req,res)
{
	res.render("crear_sala,html",{})});

var usuarios = [], 
    jugadores = [], 
    tablero = ['','','','','','','','',''],
    turno = false, 
    jugadas = 0; 


io.sockets.on('connection', function (socket) {

    var desconectarAmbosJugadores = function(){
        jugadores = [];
        tablero = ['','','','','','','','',''];
        turno = false;
        jugadas = 0;
        io.sockets.emit('desconectarAmbosJugadores', true);


        for(var i in io.sockets.sockets){

            if(io.sockets.sockets[i].jugador){
                delete io.sockets.sockets[i].jugador;
            }
        }
    };

    
    socket.emit('conexion', {'jugadores' : jugadores, 'tablero' : tablero});

    
    socket.on('ping', function(data, callback){
        if(callback && typeof callback == 'function'){
            callback(data);
        }
    });


    socket.on('comprobarUsuario',function(data, callback){

        data = sanitizer.escape(data);


        if(usuarios.indexOf(data) >= 0){
            callback({ok : false, msg : 'Este nombre esta ocupado'});
        }else{


            callback({ok : true, nick : data});
            socket.nick = data;
            usuarios.push(data);
            console.log('Usuario conectado: ' + socket.nick);

  
            io.sockets.emit('nuevoUsuario', {nick : data, listaUsuarios : usuarios});
        }

    });

    socket.on('msg', function (data) {
        data.msg = sanitizer.escape(data.msg);
        io.sockets.emit('msg', data);
    });

	exports.initialize=function(server){
	io=io.listen(server);

	io.sockets.on("connection",function(socket){
	    socket.on("crearpartida",function(cliente){
	        console.log(cliente);
	        partidas.push(cliente);
	        socket.broadcast.emit("crearpartida",partidas);
	    });
	});
}

    
    socket.on('disconnect', function(){

        if( socket.nick ){
            usuarios.splice(usuarios.indexOf(socket.nick), 1);
            io.sockets.emit('desconectarUsuario', {nick : socket.nick, listaUsuarios : usuarios});
            console.log('usuario desconectado: ' + socket.nick);


            if(socket.jugador){
                if(jugadores.length == 2){

                    desconectarAmbosJugadores();

                }else{

                    jugadores.splice(jugadores.indexOf(socket.nick), 1);
                    io.sockets.emit('desconectarJugador', {nick : socket.nick, jugador : socket.jugador});
                }
            }

        }

    });
});
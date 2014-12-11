var io=require('socket.io');
var partidas=Array();
exports.initialize=function(server){
	io=io.listen(server);
	io.sockets.on("connection", function(socket){
		mensaje="bienvenido usuario";
		socket.emit('inicio_server',mensaje);


		socket.on("mensaje_cliente", function(datos){
			msj=datos;
			io.sockets.emit("mensaje_servidor",msj);
		})
	});
	io.sockets.on("connection",function(socket){
	    socket.on("crearpartida",function(cliente){
	        console.log(cliente);
	        partidas.push(cliente);
	        socket.broadcast.emit("crearpartida",partidas);
	    });
	});
}
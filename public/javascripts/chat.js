//$(document).ready(function() {
//	alert("hola")
//});
$(function($) {
	/*alert("load")
	$("#sala").click(function(event) {
		event.preventDefault();
		alert("click")

	});*/
	var socket=io.connect("http://localhost:3001/");
	$("#sala").submit(function(event) {
		//enviar
		socket.emit("crearpartida",$(this).serializeObject());
		return false;
	});
	//escuchar el servidor
	socket.on("crearpartida",function(server){
		/*alert("partida nueva"+server)*/
		html="<div id='partidas'>";
		for(var i=0;i<server.length;i++)
		{
			/*html="<div id='partidas'>";*/
			html+="<h2>"+server[i].nombre+"</h2>";
			html+="<h5> Jugadores:  "+server[i].cantidad+"</h5>";
			html+="<h5> Preguntas:  "+server[i].pregunta+"</h5>";
		}
		html+="</div>"
		$("#contaner").html(html);
	});
});


let socket = null;

/*$(document).ready(() => {
    log = document.getElementById('log')
    connection()
})*/


function connection(){

    socket = new WebSocket('ws://localhost:8000/ws');

    let log = document.getElementById('log')
    let name = document.getElementById('name')
    console.log(socket)
    
    socket.onopen = () => {
      log.innerText = "conexion exitosa"
    };
    
    
    socket.onmessage = (response => {
      console.log(response);
      json = JSON.parse(response.data)
      if (json.actionType == 0) {
        name.innerText = json.message
      } else if (json.actionType == 1) {
        log.innerText = json.message
      }
      
    });
}

function startGame() {
  socket.send("1")
}
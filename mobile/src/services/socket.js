import socketio from 'socket.io-client';

const socket = socketio('http://10.0.3.70:3333', {
    autoConnect: false,
})


function subscribeToNewDevs(subscribeFunction) {
    socket.on('newNerd', subscribeFunction);
}


function connect(latitude, longitude, techs){
    //Enviando para o backend:
    socket.io.opts.query = {
        latitude,
        longitude,
        techs
    }
    socket.connect();
}

function disconnect() {
    if(socket.connected){
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs
}
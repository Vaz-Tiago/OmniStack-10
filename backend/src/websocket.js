const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');


//TODDO - Armazenamento de sessões - Melhor local BancoDeDados
//Mas a principio fica na memória.
const connections = [];

let io;

exports.setupWebsocket = (server) => {
  io = socketio(server);

  io.on('connection', socket => {
    //Info que vem do front
    const { latitude, longitude, techs } = socket.handshake.query;

    //Toda informção vem como string. Conversões necessárias
    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs)
    });
  });
};

//Acha conexões proximas que correspondam a tecnologia pesquisada
exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return calculateDistance(coordinates, connection.coordinates) < 10
      && connection.techs.some(item => techs.includes(item))
  });
};

//Envia Mensagem para o front de um novo cadastro
exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data)
  });
}
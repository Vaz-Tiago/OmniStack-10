const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const { setupWebsocket } = require('./websocket');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const routes = require('./routes');

const app = express();

//Extraindo do express o servidor http para trabalhar diretamente com ele.
const server = http.Server(app);
setupWebsocket(server);

//1° Parametro: String de conexão
//2° Parametro: Objeto para tratamento dos warnings
mongoose.connect('mongodb+srv://Tiago:B2rz96wJEwnCttoB@cluster0-0tmdt.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Todas as rotas entenderem json
app.use(express.json());
app.use(cors());
app.use(routes);

//Importante mudar o listen para o server que está recebendo o app
server.listen(3333);
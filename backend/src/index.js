const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

//1° Parametro: String de conexão
//2° Parametro: Objeto para tratamento dos warnings
mongoose.connect('mongodb+srv://Tiago:B2rz96wJEwnCttoB@cluster0-0tmdt.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Todas as rotas entenderem json
app.use(express.json());
app.use(routes);


app.listen(3333);
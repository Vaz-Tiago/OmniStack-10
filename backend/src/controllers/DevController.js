const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index(req, res){
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res){

        const { github_username, techs, latitude, longitude } = req.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
        
            //default if null
            const { name = login, avatar_url, bio } = response.data;
            const techsArray = parseStringAsArray(techs);
        
            //Set coordinates with mongDb Gesospatial docs
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            //Filtrar as conexões pela distancia e tecnologias para já exibir para o usuário
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );

            sendMessage(sendSocketMessageTo, 'newNerd', dev);
        }

        return res.json(dev);
    },


    async update(req, res){
        const { github_username, name, avatar_url, techs, longitude, latitude, bio } = req.body;
        let devId = await Dev.findOne({ github_username });
        if(devId){
            const techsArray = parseStringAsArray(techs);

            const location = {
                type:'Point',
                coordinates:[longitude, latitude]
            };

            const dev = await Dev.findByIdAndUpdate(devId, {
                name,
                avatar_url,
                techs: techsArray,
                location,
                bio
            })
            return res.json(dev);
        }else{
            return res.json({"Erro": "Usuário não encontrado"})
        }
    },

    async destroy(req, res){
        const del = await Dev.findByIdAndRemove(req.params.id);
        if(del){
            return res.json({message: 'Deletado com sucesso'})
        }
        return res.json({error: "Erro"})
    }
}
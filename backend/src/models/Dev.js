const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

const DevSchema = new mongoose.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
})

//1° Parametro - Nome da collection que vai ser gravada no banco:
//2° Parametro - keys da collection
module.exports = mongoose.model('Dev', DevSchema);
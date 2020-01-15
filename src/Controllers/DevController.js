const axios = require('axios');
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArrays')

module.exports = {
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            const apiRes = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name = login, avatar_url, bio } = apiRes.data;
            const techsArray = parseStringAsArray(techs);
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
            dev = await Dev.create({
                name,
                github_username,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        }
        return response.json(dev);
    },

    async index(request, response) {
        const devs = await Dev.find()
        return response.json(devs);
    },
    
    async update(request, response) {
        const { id_dev } = request.query;
        const { techs, name } = request.body;

        const techsArray = parseStringAsArray(techs);
        const dev = await Dev.findById(id_dev);
        dev.name = name;
        dev.techs = techsArray;
        dev.save()
        response.json({dev})
    },

    async delete(request, response) {
        const deleted = await Dev.findByIdAndDelete(request.query.id_dev);
        response.json(deleted)
    }
}
const roles = require('../models').roles_model;


module.exports = {

    list(req, res) {
        return roles
            .findAll({})
            .then((roles) => res.status(200).send(roles))
            .catch((error) => { res.status(400).send(error); });
    },

};

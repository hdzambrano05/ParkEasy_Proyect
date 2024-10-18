const parking_spaces = require('../models').parking_spaces_model;
const reservations = require('../models').reservations_model;

module.exports = {
    list(req, res) {
        return parking_spaces
            .findAll({})
            .then((parking_spaces) => res.status(200).send(parking_spaces))
            .catch((error) => { res.status(400).send(error); });
    },


    listFull(req, res) {
        return parking_spaces
          .findAll({
            attributes: ['space_id', 'space_number', 'is_occupied', 'space_type', 'location'],
            include: [{
              model: reservations,
              attributes: ['reservation_id', 'user_id', 'reservation_start', 'reservation_end', 'status'],
            }]
          })
          .then((spaces) => res.status(200).send(spaces))
          .catch((error) => {
            console.error('Error al listar los espacios:', error); // Detallar el error
            res.status(500).send({ message: 'Error al listar los espacios', error: error.message });
          });
    },

    getById(req, res) {
        return parking_spaces
            .findByPk(req.params.id)
            .then(space => {
                if (!space) {
                    return res.status(404).send({ message: 'Parking space not found' });
                }
                return res.status(200).send(space);
            })
            .catch(error => res.status(400).send(error));
    },



    // Adicionar nuevo espacio
    add(req, res) {
        return parking_spaces
            .create({
                space_number: req.body.space_number,
                is_occupied: req.body.is_occupied,
                space_type: req.body.space_type,
                location: req.body.location
            })
            .then(space => res.status(201).send(space))
            .catch(error => res.status(400).send(error));
    },

    // Actualizar espacio por ID
    update(req, res) {
        return parking_spaces
            .findByPk(req.params.id)
            .then(space => {
                if (!space) {
                    return res.status(404).send({ message: 'Parking space not found' });
                }
                return space
                    .update({
                        space_number: req.body.space_number || space.space_number,
                        is_occupied: req.body.is_occupied || space.is_occupied,
                        space_type: req.body.space_type || space.space_type,
                        location: req.body.location || space.location
                    })
                    .then(() => res.status(200).send(space))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    // Eliminar espacio por ID
    delete(req, res) {
        return parking_spaces
            .findByPk(req.params.id)
            .then(space => {
                if (!space) {
                    return res.status(404).send({ message: 'Parking space not found' });
                }
                return space
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

};

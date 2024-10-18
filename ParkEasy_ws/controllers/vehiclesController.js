const vehicles = require('../models').vehicles_model;
const users = require('../models').users_model;
const reservations = require('../models').reservations_model;

module.exports = {


    list(req, res) {
        return vehicles
            .findAll({})
            .then((vehicles) => res.status(200).send(vehicles))
            .catch((error) => { res.status(400).send(error); });
    },



    listFull(req, res) {
        return vehicles
            .findAll({
                attributes: ['vehicle_id', 'license_plate', 'vehicle_type', 'color'],
                include: [
                    {
                        model: users,
                        attributes: ['user_id', 'username', 'email'],
                    },
                    {
                        model: reservations,
                        attributes: ['reservation_id', 'reservation_start', 'reservation_end', 'status'],
                    },
                ],
            })
            .then((vehicles) => res.status(200).send(vehicles))
            .catch((error) => res.status(400).send(error));
    },

    // Obtener vehículo por ID
    getById(req, res) {
        return vehicles
            .findByPk(req.params.id)
            .then(vehicle => {
                if (!vehicle) {
                    return res.status(404).send({ message: 'Vehicle not found' });
                }
                return res.status(200).send(vehicle);
            })
            .catch(error => res.status(400).send(error));
    },

    // Adicionar nuevo vehículo
    add(req, res) {
        return vehicles
            .create({
                user_id: req.body.user_id,
                license_plate: req.body.license_plate,
                vehicle_type: req.body.vehicle_type,
                color: req.body.color
            })
            .then(vehicle => res.status(201).send(vehicle))
            .catch(error => res.status(400).send(error));
    },

    // Actualizar vehículo por ID
    update(req, res) {
        return vehicles
            .findByPk(req.params.id)
            .then(vehicle => {
                if (!vehicle) {
                    return res.status(404).send({ message: 'Vehicle not found' });
                }
                return vehicle
                    .update({
                        user_id: req.body.user_id || vehicle.user_id,
                        license_plate: req.body.license_plate || vehicle.license_plate,
                        vehicle_type: req.body.vehicle_type || vehicle.vehicle_type,
                        color: req.body.color || vehicle.color
                    })
                    .then(() => res.status(200).send(vehicle))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    // Eliminar vehículo por ID
    delete(req, res) {
        return vehicles
            .findByPk(req.params.id)
            .then(vehicle => {
                if (!vehicle) {
                    return res.status(404).send({ message: 'Vehicle not found' });
                }
                return vehicle
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    checkVehicleExistence(req, res) {
        const licensePlate = req.query.license_plate; // Obtiene la matrícula del vehículo de los parámetros de la consulta
    
        return vehicles.findOne({
            where: { license_plate: licensePlate },
            attributes: ['vehicle_id', 'license_plate', 'vehicle_type', 'color'] // Ajusta los atributos según tus necesidades
        })
        .then(vehicle => {
            if (!vehicle) {
                return res.status(404).send({ message: 'Vehículo no encontrado.' });
            }
            return res.status(200).send(vehicle); // Devuelve los datos del vehículo si existe
        })
        .catch(error => {
            console.error('Error al verificar el vehículo:', error);
            return res.status(500).send({ message: 'Error al verificar el vehículo', error: error.message });
        });
    }


};

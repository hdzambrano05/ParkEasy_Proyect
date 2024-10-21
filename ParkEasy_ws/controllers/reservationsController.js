const { Op } = require('sequelize');

const moment = require('moment');
const reservations = require('../models').reservations_model;
const parking_spaces = require('../models').parking_spaces_model;
const users = require('../models').users_model;
const vehicles = require('../models').vehicles_model;


module.exports = {

    list(req, res) {
        return reservations
            .findAll({
                include: [{ model: vehicles }] // Incluir el modelo de vehículos para obtener el tipo
            })
            .then((reservations) => {
                // Calcular la tarifa para cada reserva
                const reservationsWithFees = reservations.map(reservation => {
                    const entryTime = moment(reservation.reservation_start);
                    const exitTime = moment(reservation.reservation_end); // Hora actual
                    const duration = exitTime.diff(entryTime, 'hours', true); // Duración en horas (decimal)

                    let fee = 0;

                    // Calcular tarifa según el tipo de vehículo
                    const vehicleType = reservation.vehicles_model.dataValues.vehicle_type; // Cambia a reservation.vehicles_model.dataValues
                    if (vehicleType === 'CARRO') {
                        fee = 2000; // Tarifa mínima para carro
                        if (duration > 1) {
                            fee += Math.ceil(duration - 1) * 1000; // Horas adicionales
                        }
                    } else if (vehicleType === 'MOTO') {
                        fee = 1500; // Tarifa mínima para moto
                        if (duration > 1) {
                            fee += Math.ceil(duration - 1) * 500; // Horas adicionales
                        }
                    }

                    // Añadir la tarifa calculada a la reserva
                    return { ...reservation.dataValues, fee }; // Crear un nuevo objeto con la reserva y la tarifa
                });

                // Enviar la respuesta con todas las reservas y sus tarifas
                return res.status(200).json(reservationsWithFees);
            })
            .catch((error) => {
                console.error('Error al listar las reservas:', error);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            });
    },


    getActiveReservation(req, res) {
        const userId = req.params.userId; // Obtiene el userId de los parámetros de la ruta

        return reservations.findOne({
            where: {
                user_id: userId,
                status: 'pending' // O el estado que consideres como "activo"
            },
            attributes: ['reservation_id', 'space_id', 'reservation_start', 'reservation_end', 'status'],
            order: [['reservation_start', 'ASC']],
        })
            .then(reservation => {
                if (!reservation) {
                    return res.status(404).send({ message: 'No hay reserva activa para este usuario.' });
                }
                return res.status(200).send(reservation);
            })
            .catch(error => {
                console.error('Error al obtener la reserva activa:', error);
                return res.status(500).send({ message: 'Error al obtener la reserva activa', error: error.message });
            });
    },

    listFull(req, res) {
        return reservations
            .findAll({
                attributes: ['reservation_id', 'user_id', 'space_id', 'vehicle_id', 'reservation_start', 'reservation_end', 'status', 'created_at'],
                include: [
                    {
                        model: parking_spaces,
                        attributes: ['space_id', 'space_number', 'is_occupied'],
                    },
                    {
                        model: users,
                        attributes: ['user_id', 'username', 'email'],
                    },
                    {
                        model: vehicles,
                        attributes: ['vehicle_id', 'license_plate', 'vehicle_type', 'color'],
                    }
                ]
            })
            .then((reservations) => {
                // Calcular la tarifa para cada reserva
                const reservationsWithFees = reservations.map(reservation => {
                    const entryTime = moment(reservation.reservation_start);
                    const exitTime = moment(reservation.reservation_end); // Hora actual
                    const duration = exitTime.diff(entryTime, 'hours', true); // Duración en horas (decimal)

                    let fee = 0;

                    // Calcular tarifa según el tipo de vehículo
                    const vehicleType = reservation.vehicles_model.dataValues.vehicle_type; // Cambia a reservation.vehicles_model.dataValues
                    if (vehicleType === 'CARRO') {
                        fee = 2000; // Tarifa mínima para carro
                        if (duration > 1) {
                            fee += Math.ceil(duration - 1) * 1000; // Horas adicionales
                        }
                    } else if (vehicleType === 'MOTO') {
                        fee = 1500; // Tarifa mínima para moto
                        if (duration > 1) {
                            fee += Math.ceil(duration - 1) * 500; // Horas adicionales
                        }
                    }

                    // Añadir la tarifa calculada a la reserva
                    return { ...reservation.dataValues, fee }; // Crear un nuevo objeto con la reserva y la tarifa
                });

                // Enviar la respuesta con todas las reservas y sus tarifas
                return res.status(200).json(reservationsWithFees);
            })
            .catch((error) => {
                console.error('Error al listar las reservas:', error);
                return res.status(500).json({ message: 'Error interno del servidor.' });
            });
            
    },

    getById(req, res) {
        return reservations
            .findByPk(req.params.id)
            .then(reservation => {
                if (!reservation) {
                    return res.status(404).send({ message: 'Reservation not found' });
                }
                return res.status(200).send(reservation);
            })
            .catch(error => res.status(400).send(error));
    },

    // Adicionar nueva reserva
    add(req, res) {
        const { user_id, space_id, vehicle_id, reservation_start, reservation_end, status } = req.body;

        if (!user_id || !space_id || !vehicle_id || !reservation_start || !reservation_end) {
            return res.status(400).send({ message: 'Faltan datos requeridos.' });
        }

        // Crear una nueva reserva
        reservations.create({
            user_id,
            space_id,
            vehicle_id,
            reservation_start: new Date(),
            reservation_end: new Date(),
            status: 'pending',
        })
            .then(reservation => {
                // Actualizar el estado del espacio a ocupado
                return parking_spaces.update({ is_occupied: true }, { where: { space_id } })
                    .then(() => {
                        return res.status(201).send(reservation);
                    })
                    .catch(error => {
                        console.error('Error al actualizar el espacio:', error);
                        return res.status(500).send({ message: 'Error al actualizar el espacio', error: error.message });
                    });
            })
            .catch(error => {
                console.error('Error al agregar la reserva:', error);
                return res.status(500).send({ message: 'Error al agregar la reserva', error: error.message });
            });
    },


    // Actualizar reserva por ID
    update(req, res) {
        return reservations.findByPk(req.params.id)
            .then(reservation => {
                if (!reservation) {
                    return res.status(404).send({ message: 'Reservation not found' });
                }

                // Prepara los datos para la actualización
                const updatedData = {
                    user_id: req.body.user_id || reservation.user_id,
                    space_id: req.body.space_id || reservation.space_id,
                    vehicle_id: req.body.vehicle_id || reservation.vehicle_id,
                    reservation_start: req.body.reservation_start || reservation.reservation_start,
                    reservation_end: req.body.reservation_end || reservation.reservation_end,
                    status: req.body.status || reservation.status
                };

                // Actualiza la reserva y devuelve la respuesta
                return reservation.update(updatedData)
                    .then(updatedReservation => {
                        return res.status(200).send(updatedReservation);
                    })
                    .catch(error => {
                        return res.status(400).send({ message: 'Error updating reservation', error });
                    });
            })
            .catch(error => {
                return res.status(400).send({ message: 'Error fetching reservation', error });
            });
    },


    // Eliminar reserva por ID
    delete(req, res) {
        return reservations
            .findByPk(req.params.id)
            .then(reservation => {
                if (!reservation) {
                    return res.status(404).send({ message: 'Reservation not found' });
                }
                return reservation
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },



    markExit: (req, res) => {
        const { id } = req.params; // Obtiene el id de la reserva desde los parámetros de la ruta
        const exitTime = moment(); // Hora actual para la salida

        // Encuentra la reserva usando reservation_id
        reservations.findOne({
            where: { reservation_id: id },
            include: [{ model: vehicles }] // Asegúrate de incluir correctamente el modelo
        })
            .then(reservation => {
                if (!reservation) {
                    console.log(`Reserva con ID ${id} no encontrada.`);
                    return res.status(404).json({ message: 'Reserva no encontrada.' });
                }

                console.log(`Reserva encontrada: `, reservation); // Imprimir la reserva encontrada

                // Verifica el estado de la reserva
                if (reservation.status !== 'pending') {
                    return res.status(400).json({ message: 'No se puede marcar salida de una reserva que no está pendiente.' });
                }

                const entryTime = moment(reservation.reservation_start); // Hora de entrada (timestamp)
                const duration = exitTime.diff(entryTime, 'hours', true); // Duración en horas (decimal)

                // Obtener el tipo de vehículo desde la relación
                const vehicleType = reservation.vehicles_model.dataValues.vehicle_type; // Cambia a reservation.vehicles_model.dataValues

                // Inicializa la tarifa
                let fee = 0;

                // Calcular tarifa
                if (vehicleType === 'CARRO') {
                    fee = 2000; // Siempre cobramos la tarifa mínima de 2000
                    if (duration > 1) {
                        fee += Math.ceil(duration - 1) * 1000; // Horas adicionales
                    }
                } else if (vehicleType === 'MOTO') {
                    fee = 1500; // Siempre cobramos la tarifa mínima de 1500
                    if (duration > 1) {
                        fee += Math.ceil(duration - 1) * 500; // Horas adicionales
                    }
                }

                // Imprimir la tarifa calculada para fines de depuración
                console.log(`Tarifa calculada para la reserva ${id}: ${fee}`);

                return reservations.update(
                    {
                        status: 'completed',
                        reservation_end: exitTime.toDate() // Actualiza la hora de salida como un timestamp
                    },
                    { where: { reservation_id: id } } // Cambia a reservation_id
                ).then(() => {
                    return parking_spaces.update(
                        { is_occupied: false },
                        { where: { space_id: reservation.space_id } } // Asegúrate de usar el ID correcto del espacio
                    );
                }).then(() => {
                    res.status(200).json({ message: 'Salida marcada con éxito.', fee });
                });
            })
            .catch(error => {
                console.error('Error al marcar salida:', error);
                res.status(500).json({ message: 'Error al marcar salida.', error });
            });
    },



    getMonthlyEarnings: (req, res) => {
        const startOfMonth = moment().startOf('month').toDate(); // Inicio del mes actual
        const endOfMonth = moment().endOf('month').toDate(); // Fin del mes actual

        console.log('Inicio del mes:', startOfMonth);
        console.log('Fin del mes:', endOfMonth);

        // Buscar todas las reservas completadas dentro del mes actual
        reservations.findAll({
            where: {
                status: 'completed',
                reservation_end: {
                    [Op.between]: [startOfMonth, endOfMonth] // Filtrar por el rango de fechas
                }
            },
            include: [{ model: vehicles }] // Asegúrate de usar el alias correcto aquí
        })
            .then(completedReservations => {
                console.log('Reservas completadas encontradas:', completedReservations);

                if (!completedReservations.length) {
                    return res.status(200).json({
                        message: 'No hay reservas completadas este mes.',
                        totalEarnings: 0
                    });
                }

                // Calcular las ganancias totales
                const totalEarnings = completedReservations.reduce((total, reservation) => {
                    const entryTime = moment(reservation.reservation_start);
                    const exitTime = moment(reservation.reservation_end);
                    const duration = exitTime.diff(entryTime, 'hours', true); // Duración en horas (decimal)

                    const vehicleType = reservation.vehicles_model ? reservation.vehicles_model.vehicle_type : null;

                    if (!vehicleType) {
                        console.warn('Tipo de vehículo no encontrado para la reserva:', reservation);
                        return total; // Saltar si no hay tipo de vehículo
                    }

                    let fee = 0;

                    // Calcular tarifa basada en el tipo de vehículo
                    if (vehicleType === 'CARRO') {
                        fee = 2000; // Tarifa mínima para carros
                        if (duration > 1) {
                            fee += Math.ceil(duration - 1) * 1000; // Horas adicionales
                        }
                    } else if (vehicleType === 'MOTO') {
                        fee = 1500; // Tarifa mínima para motos
                        if (duration > 1) {
                            fee += Math.ceil(duration - 1) * 500; // Horas adicionales
                        }
                    }

                    return total + fee; // Sumar la tarifa de cada reserva al total
                }, 0);

                // Imprimir las ganancias totales para fines de depuración
                console.log(`Ganancias del mes: ${totalEarnings}`);

                // Devolver la respuesta con las ganancias
                res.status(200).json({
                    message: 'Ganancias del mes obtenidas con éxito.',
                    totalEarnings
                });
            })
            .catch(error => {
                console.error('Error al obtener las ganancias del mes:', error);
                res.status(500).json({ message: 'Error al obtener las ganancias del mes.', error });
            });
    }

};

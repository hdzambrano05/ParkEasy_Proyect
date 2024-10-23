const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const users = require('../models').users_model;
const roles = require('../models').roles_model;
const vehicles = require('../models').vehicles_model;
const reservations = require('../models').reservations_model;


module.exports = {

    login(req, res) {
        const { email, username, password } = req.body;

        // Buscar usuario por email o username
        users.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        })
            .then(user => {
                // Verificar si el usuario existe
                if (!user) {
                    return res.status(404).send({ message: 'Usuario no encontrado' });
                }

                // Verificar la contraseña
                return bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.status(401).send({ message: 'Contraseña incorrecta' });
                        }

                        // Devolver información del usuario (sin la contraseña)
                        const { password: _, ...userData } = user.dataValues; // Excluir la contraseña
                        return res.status(200).send(userData); // O devuelve solo lo que necesites
                    });
            })
            .catch(error => {
                console.error('Error en el inicio de sesión:', error);
                return res.status(500).send({ message: 'Error del servidor' });
            });
    },


    list(req, res) {
        return users
            .findAll({})
            .then((users) => res.status(200).send(users))
            .catch((error) => { res.status(400).send(error); });
    },





    listFull(req, res) {
        return users
            .findAll({
                attributes: ['user_id', 'username', 'email', 'full_name', 'created_at'],
                include: [
                    {
                        model: roles,
                        attributes: ['role_id', 'role_name'],
                    },
                    {
                        model: vehicles,
                        attributes: ['vehicle_id', 'license_plate', 'vehicle_type', 'color'],
                    },
                    {
                        model: reservations,
                        attributes: ['reservation_id', 'reservation_start', 'reservation_end', 'status'],
                    },
                ],
            })
            .then((users) => res.status(200).send(users))
            .catch((error) => res.status(400).send(error));
    },

    getById(req, res) {
        return users
            .findByPk(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: 'User not found' });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },

    // Adicionar nuevo usuario
    add: async (req, res) => {
        try {
            // Verificar si el usuario ya existe por el email o el nombre de usuario
            const existingUser = await users.findOne({
                where: {
                    [Op.or]: [
                        { email: req.body.email },
                        { username: req.body.username }
                    ]
                }
            });

            if (existingUser) {
                return res.status(400).send({ error: 'El nombre de usuario o el correo electrónico ya están registrados.' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            const newUser = await users.create({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                full_name: req.body.full_name,
                role_id: 2
            });

            return res.status(201).send(newUser);

        } catch (error) {
            return res.status(500).send({ error: 'Hubo un error al procesar la solicitud.' });
        }
    },


    // Actualizar usuario por ID
    update(req, res) {
        return users
            .findByPk(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: 'User not found' });
                }
                return user
                    .update({
                        username: req.body.username || user.username,
                        email: req.body.email || user.email,
                        password: req.body.password || user.password,
                        full_name: req.body.full_name || user.full_name,
                        role_id: req.body.role_id || user.role_id
                    })
                    .then(() => res.status(200).send(user))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    // Eliminar usuario por ID
    delete(req, res) {
        return users
            .findByPk(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: 'User not found' });
                }
                return user
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },

    UserInfo(req, res) {
        const userId = req.params.id; // Asegúrate de que estás usando `req.params.id`

        return users
            .findOne({
                where: { user_id: userId },
                attributes: ['user_id', 'username', 'email', 'full_name'],
                include: [
                    {
                        model: roles,
                        attributes: ['role_id', 'role_name'],
                    },
                    {
                        model: vehicles,
                        attributes: ['vehicle_id', 'license_plate', 'vehicle_type', 'color'],
                    },
                ],
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: 'Usuario no encontrado' });
                }
                return res.status(200).send(user);
            })
            .catch((error) => res.status(400).send(error));
    },


    verifyUser: async (req, res) => {
        const { emailOrUsername } = req.body;
        console.log('Email o Username:', emailOrUsername);

        try {
            // Buscar al usuario por email o username
            const user = await users.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrUsername.trim() }, // Usar email
                        { username: emailOrUsername.trim() } // Usar username
                    ]
                }
            });

            if (!user) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }

            return res.status(200).send({ message: 'Usuario encontrado, puede proceder a cambiar la contraseña' });
        } catch (error) {
            console.error('Error al buscar el usuario:', error);
            return res.status(500).send({ message: 'Error del servidor' });
        }
    },


    // Método para cambiar la contraseña del usuario
    changePassword: async (req, res) => {
        const { emailOrUsername, newPassword } = req.body;

        try {
            // Buscar al usuario por email o username
            const user = await users.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrUsername.trim() }, // Usar email
                        { username: emailOrUsername.trim() } // Usar username
                    ]
                }
            });

            if (!user) {
                return res.status(404).send({ message: 'Usuario no encontrado' });
            }

            // Hashear la nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword,10);
            console.log('Hashed Password:', hashedPassword); // Imprimir el hash
            // Actualizar la contraseña del usuario
            user.password = hashedPassword;

            // Guardar los cambios
            await user.save();

            return res.status(200).send({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            return res.status(500).send({ message: 'Error del servidor' });
        }
    }

};

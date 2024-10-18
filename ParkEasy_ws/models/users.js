const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "user_id",
      autoIncrement: true
    },
    username: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "username",
      autoIncrement: false,
      unique: "users_username_key"
    },
    email: {
      type: DataTypes.CHAR(100),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "email",
      autoIncrement: false,
      unique: "users_email_key"
    },
    password: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "password",
      autoIncrement: false
    },
    full_name: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "full_name",
      autoIncrement: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "role_id",
      autoIncrement: false,
      references: {
        key: "role_id",
        model: "roles_model"
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      comment: null,
      primaryKey: false,
      field: "created_at",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "users",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const UsersModel = sequelize.define("users_model", attributes, options);

  UsersModel.associate = function (models) {
    UsersModel.belongsTo(models.roles_model, {
      foreignKey: 'role_id',
    });
    UsersModel.hasMany(models.vehicles_model, {
      foreignKey: 'user_id',
    });
    UsersModel.hasMany(models.reservations_model, {
      foreignKey: 'user_id',
    });
  };
  return UsersModel;
};
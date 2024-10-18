const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "vehicle_id",
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "user_id",
      autoIncrement: false,
      references: {
        key: "user_id",
        model: "users_model"
      }
    },
    license_plate: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "license_plate",
      autoIncrement: false,
      unique: "vehicles_license_plate_key"
    },
    vehicle_type: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "vehicle_type",
      autoIncrement: false
    },
    color: {
      type: DataTypes.CHAR(30),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "color",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "vehicles",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'


  };
  const VehiclesModel = sequelize.define("vehicles_model", attributes, options);
  VehiclesModel.associate = function (models) {
    VehiclesModel.belongsTo(models.users_model, {
      foreignKey: 'user_id',
    });
    VehiclesModel.hasMany(models.reservations_model, {
      foreignKey: 'vehicle_id',
    });
  };
  return VehiclesModel;
};
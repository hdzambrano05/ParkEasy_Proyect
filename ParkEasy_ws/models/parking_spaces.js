const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    space_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "space_id",
      autoIncrement: true
    },
    space_number: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "space_number",
      autoIncrement: false,
      unique: "parking_spaces_space_number_key"
    },
    is_occupied: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "is_occupied",
      autoIncrement: false
    },
    space_type: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "space_type",
      autoIncrement: false
    },
    location: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "location",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "parking_spaces",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const ParkingSpacesModel = sequelize.define("parking_spaces_model", attributes, options);

  ParkingSpacesModel.associate = function (models) {
    ParkingSpacesModel.hasMany(models.reservations_model, {
      foreignKey: 'space_id',
    });
  };

  return ParkingSpacesModel;
};
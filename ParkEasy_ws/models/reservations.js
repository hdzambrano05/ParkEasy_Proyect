const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "reservation_id",
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
    space_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "space_id",
      autoIncrement: false,
      references: {
        key: "space_id",
        model: "parking_spaces_model"
      }
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "vehicle_id",
      autoIncrement: false,
      references: {
        key: "vehicle_id",
        model: "vehicles_model"
      }
    },
    reservation_start: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "reservation_start",
      autoIncrement: false
    },
    reservation_end: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "reservation_end",
      autoIncrement: false
    },
    status: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "status",
      autoIncrement: false
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
    tableName: "reservations",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const ReservationsModel = sequelize.define("reservations_model", attributes, options);


  ReservationsModel.associate = function (models) {
  
    ReservationsModel.belongsTo(models.parking_spaces_model, {
      foreignKey: 'space_id',
    });

    ReservationsModel.belongsTo(models.users_model, {
      foreignKey: 'user_id',
    });
    
    ReservationsModel.belongsTo(models.vehicles_model, {
      foreignKey: 'vehicle_id',
    });
  };

  return ReservationsModel;
};
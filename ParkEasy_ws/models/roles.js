const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "role_id",
      autoIncrement: true
    },
    role_name: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "role_name",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "roles",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const RolesModel = sequelize.define("roles_model", attributes, options);

  RolesModel.associate = function (models) {
    RolesModel.hasMany(models.users_model, {
      foreignKey: 'role_id',
    });
  };

  
  return RolesModel;
};
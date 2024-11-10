'use strict';

const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model{}
    User.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        
        },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        },
    password: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: false,
        
        },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail:true
        }

        }, 
    permisos:{
        type : DataTypes.BOOLEAN,
        allowNull: false,
        unique:false,
        defaultValue: true,
    }
    }, {
        sequelize,
        modelName : 'User',
        tableName: 'Usuarios',
        timestamps: true,
    });

    return User;
}


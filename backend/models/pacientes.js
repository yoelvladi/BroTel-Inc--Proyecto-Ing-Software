'use strict';

const {Model, DataTypes, Sequelize} = require('sequelize');

module.exports = (sequelize) =>{
    class Pacient extends Model{
        static associate(models){

        }
    }
    Pacient.init({
        id_paciente:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
            
            },
        nombre_paciente: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        },
        password_paciente: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: false,
        
        },
        email_paciente: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail:true
        }

        },
        permisos:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: false,
        } 
    }, {
        sequelize,
        modelName:'Pacient',
        tableName: 'Pacientes',
        timestamps: true,
    });
    return Pacient;
}
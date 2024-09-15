'use strict';

const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Imagen extends Model{
        static associate(models){
            Imagen.belongsTo(models.Pacient,{
                foreignKey : 'paciente_id',
                as: 'paciente',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }
    Imagen.init({
    id_image:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
        
        },
    paciente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references:{
            model:'Pacientes',
            key:'id_paciente',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
        },
    imagen_file: {
        type: DataTypes.STRING,
        allowNull:false,
        unique: true,
        
        },
    }, {
        sequelize,
        modelName : 'Imagen',
        tableName: 'Imagenes',
        timestamps: true,
    });

    return Imagen;
}
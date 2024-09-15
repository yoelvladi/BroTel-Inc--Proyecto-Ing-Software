const express = require('express');
const router = express.Router();
const db = require('../models');

const verifyPacient = async(req , res)=>{
    const {id_paciente} = req.params;
    try {
        const {paciente} = await db.Pacient.findByPk(id_paciente);
        if(!paciente){
            return res.status(404).json({ success: false, message: 'paciente no existe' });
        }
        res.json({success: true, message: 'Encontrado'})
    }catch{
        console.error("Error al verificar paciente:", error);
        res.status(500).json({ success: false, message: 'Error al verificar paciente' });
    }
}

const getImagePacientID = async(req,res)=>{
    const {nombre_image} = req.params;
    try{
        const{id_paciente} = await db.Imagen.findByPk(nombre_image);
        if(!id_paciente){
            return res.status(404).json({success:false,message:'XD'})
        }
        res.json({success:true,message:'God',id_paciente:id_paciente})
    }
    catch{
        console.error("Error wtf:", error);
        res.status(500).json({ success: false, message: 'Error wtf' });
    }
}
const getImageID = async(req,res)=>{
    const {nombre_image} = req.params;
    try{
        const {id} = await db.Imagen.findByPk(nombre_image);
        if(!id){
            return res.status(404).json({success:false,message:'XD'}) 
        }
        res.json({success:true, message:'God',id_image:id})
    }catch{
        console.error("error",error);
        res.status(500).json({success:false,message:'lol'})
    }
}
const CreateImage = async(req,res)=>{
    const {id,nombre_image} = req.params;
    try{
        const {existingImage} = await db.Imagen.findOne(nombre_image);
        if(existingImage){
            return res.status(404).json({success:false,message:'Ya existe'})
        }
        const {newImage} = await db.Imagen.Create({id,nombre_image})
        res.json({success:true,message:'Creado exitosamente', image : newImage})
    }catch{
        console.error("error",error);
        res.status(500).json({success:false,message:'lol'})
    }
};

module.exports ={verifyPacient,getImageID,getImagePacientID,CreateImage};
const mongoose = require('mongoose')
const userModel = require('../model/userModel')
const {validString , validEmail , validPassword } = require('../validation/validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// let ObjectId = mongoose.Types.ObjectId

const registerUser = async (req,res) =>{
    try{
    let data = req.body ;

    let {FirstName , LastName , Email , Password} = data ;

    if(Object.keys(data).length ==0){
        return res.status(400).send({status : true , message : `some data must be present in the body`})
    }

    if(!FirstName){
        return res.status(400).send({status : true , message : `First Name is mandatory ,Please provide first name`})
    }

    if(!validString(FirstName)){
        return res.status(400).send({status : true , message : `Please provide valid first name`})
    }

    if(!LastName){
        return res.status(400).send({status : true , message : `Last Name is mandatory ,Please provide last name`})
    }

    if(!validString(LastName)){
        return res.status(400).send({status : true , message : `Please provide valid last name`})
    }

    if(!Email){
        return res.status(400).send({status : true , message : `Emailis mandatory ,Please provide email`})
    }

    if(!validEmail(Email)){
        return res.status(400).send({status : true , message : `Please provide valid email Id`})
    }

    let uniqueEmail = await userModel.findOne({Email :Email})
    if(uniqueEmail){
        if(uniqueEmail.Email === Email){
            return res.status(400).send({status : true , message : `Please provide other email Id this email already exist`})
        }
    }
    if(!Password){
        return res.status(400).send({status : true , message : `Password is mandatory ,Please provide password`})
    }

    if(!validPassword(Password)){
        return res.status(400).send({status : true , message : `Password should be strong`})
    }

    let hash =  bcrypt.hashSync(Password , 10) 
    data.Password = hash ;

    const saverUser = await userModel.create(data) 

    return res.status(201).send({status : true , message : `User register successsfully` , data : saverUser})
}
catch(err){
    return res.status(500).send({status : true , message : err.message})
}

}

const loginUser = async (req,res) =>{
  try{

    const Email = req.body.Email;
    const Password = req.body.Password;

    if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, message: "Please provide some detail" })
    }

    if (!Email) {
        return res.status(400).send({ status: false, message: "Please provide EmailId" })
    }
    if (!validEmail(Email)) {
        return res.status(400).send({ status: false, message: "Email is Invalid" })
    }
    if (!(Password)) {
        return res.status(400).send({ status: false, message: "Please provide Password" })
    }
    if (!validPassword(Password)) {
        return res.status(400).send({ status: false, message: "Password Should be Min-8 & Max-15, it contain atleast -> 1 Uppercase , 1 Lowercase , 1 Number , 1 Special Character  Ex- Abcd@123" })
    }

    const user = await userModel.findOne({ Email: Email})
    if (!user) { return res.status(400).send({ status: false, message: "Please provide correct email" }) }

    const isMatch = await bcrypt.compare(Password, user.Password) // compare logIN and DB password , return boolean value
    if (!isMatch) { return res.status(400).send({ Status: false, message: "incorrect credential" }) }

    const token = jwt.sign({
        user: user._id.toString(),
        expiresIn: "24h"
    },
        "Netforth"
    )

    return res.status(200).send({ status: true, message: "User login successfull", data: { user: user._id, token: token } })


  }
  catch(err){
    
        return res.status(400).send({status : true , message : `Password is mandatory ,Please provide password`})
    
  }
}

module.exports = {registerUser , loginUser}
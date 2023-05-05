// const mongoose = require('mongoose')
const validString = (string) =>{
    return /^[a-zA-Z\s]{0,255}$/.test(string)
}

const validEmail = (Email) =>{
    return  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(Email)
}

const validPassword = (Password) =>{
    return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,15}$/.test(Password);
}


module.exports = {validString , validEmail , validPassword }


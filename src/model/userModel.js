const mongoose = require('mongoose') ;

const userSchema = new mongoose.Schema({
    FirstName : {
     type : String ,
     required : true 
    },
    LastName : {
        type : String ,
        required : true 
    },
    Email : {
        type : String ,
        unique : true ,
        required : true 
    },
    Password : {
        type : String ,
        required : true 
    }
    
},{timestamps : true })

module.exports = mongoose.model('user' , userSchema)
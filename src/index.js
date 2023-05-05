const mongoose = require('mongoose') ;
const route = require('./router/route')
const express = require('express') ;

const app = express() ;

app.use(express.json()) ;


mongoose.connect('mongodb+srv://Ranamahato:9XBWNazgyvZ41FGS@rana.1qocv4g.mongodb.net/Netforth' ,
 {useNewUrlParser : true}
)

.then(() =>{
    console.log(`mongoose is connected`);
})

.catch((err) =>{
    console.log(err);
})


app.use('/' , route) ;

app.listen(3000 , () =>{
    console.log(`express is connected at ${3000}`);
})
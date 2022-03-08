const express = require('express');
const path = require('path')
const app = express();
const hbs = require('hbs')
const bodyParser = require('body-parser')
const db = require('./configuration/connection')




const url = require('./Router/router');

// Mongodb connection ;

db.connect((err)=>{
    if(err) console.log("Error" + err);
    else console.log('Database connected to port 27017');
})

// View Engine Setup;
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');



// parse application/form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/',url)

app.listen(5000,()=>{
    console.log('Server connected port at 5000')
})
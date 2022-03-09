const express = require('express');
const path = require('path')
const app = express();
const hbs = require('hbs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')


dotenv.config();

const url = require('./Router/router');

// Mongodb connection ;

mongoose.connect(process.env.DATABASE_ACCESS, ()=>  console.log('Database connected successfully'))


// View Engine Setup;
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');



// parse application/form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/',url)

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server connected port at  ${port}`)
})
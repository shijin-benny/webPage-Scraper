const mongoose = require('mongoose');

const addDetails = mongoose.Schema({
    domain:{
        type:String
    },
    total:{
        type:Number
    },
    favorite:{
        type:String
    },
    webLinks:[],
    mediaLinks:[]

})

module.exports = mongoose.model('details',addDetails)
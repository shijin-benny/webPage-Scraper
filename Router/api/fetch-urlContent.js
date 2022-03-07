const axios = require('axios')

exports.fetchurlContent = (url)=>{
    return axios.get(url).then((response)=>{
        return response.data
    }).catch((err)=>{
        console.log(err);
    })
}
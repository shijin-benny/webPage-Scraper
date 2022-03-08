const db = require('../configuration/connection')
const collection = require('../configuration/collection')
const { links } = require('express/lib/response')
const objectid = require('mongodb').ObjectId
const async = require('hbs/lib/async')

module.exports={
    addDetails: ({total,webLinks,mediaLinks,name})=>{
      const links = webLinks.filter((items)=>{
          return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(items.href);
      })
      return new Promise((resolve,reject)=>{
          const favorite = '';
          db.get().collection(collection.DETAILS).insertOne({domain:name,totalwords:total,favorite:favorite, webLinks:links,mediaLinks:mediaLinks}).then((data)=>{
              resolve(data)
          })
          
      })
    },
    getDetails:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.DETAILS).find().toArray().then((data)=>{
               resolve(data)
            })
        })
    },
    Removehistory:(Id)=>{
        return new Promise(async(resolve,reject)=>{
        db.get().collection(collection.DETAILS).deleteOne({_id:objectid(Id)}).then((res)=>{
            resolve({remove:true})
        })
       
        })
    },
    setFavorite:(data)=>{
       return new Promise((resolve,reject)=>{
           db.get().collection(collection.DETAILS).updateOne({_id:objectid(data.itemId)},{$set:{favorite:data.action}}).then((res)=>{
               resolve(res)
           })
       })
    }
}

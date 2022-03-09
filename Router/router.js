const express = require('express');
const async = require('hbs/lib/async');
const { fetchurlContent } = require('./api/fetch-urlContent')
const { cleanContent } = require('./api/cleanContent')
const { wordCount } = require('./api/WordCount')
const cheerio = require('cheerio');
const addDetails = require('../Models/schema')



const router = express.Router();


router.get('/', (req, res) => {
  res.render('index')
})

router.post('/setDetails', async (req, res) => {
  const url = req.body.url
  // url validation 
  var expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  var regex = new RegExp(expression);
     if(url.match(regex)){
  
      const content = await fetchurlContent(url)
      const clean = cleanContent(content)
      const totalWord = wordCount(clean)
      // Using cheerio to extract <a> tags
      const $ = cheerio.load(content);
      const linkObjects = $('a');
      // Collect the "href" of each link and add them to an array
      const links = [];
      linkObjects.each((index, element) => {
        links.push({
          href: $(element).attr('href'), // get the href attribute
        });
      });
      // collect the images
      const Images = $('img');
      const images = [];
      Images.each((index, element) => {
        images.push({
          src: $(element).attr('src') // get the src attributes
        })
      })
      const weblinks = links.filter((items) => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(items.href);
      })
      // save details on mongodb atlas 
      const details = await new addDetails({
        domain: url,
        total: totalWord,
        favorite: '',
        webLinks: weblinks,
        mediaLinks: images
      })
    
      details.save().then(data => {
        res.render('showTable')
      })
     }else{
       res.render('index',{Error:'Website url is Invalid'})
     }

 



})

router.get('/showTable', async (req, res) => {
  const tableDetails = await addDetails.find()
  res.render('table', { tableDetails })
})

// Remove items from table
router.post('/remove', async (req, res) => {
  addDetails.deleteOne({ _id: req.body.itemId }).then((response) => {
    res.json(response)
  })


})
// Setup favorite action
router.post('/setfavorite', (req, res) => {
  if (req.body.action == 'true') {
    addDetails.updateOne({ _id: req.body.itemId }, { $set: { favorite: req.body.action } }).then((response) => {
      res.json(response)
    })
  } else {
    addDetails.updateOne({ _id: req.body.itemId }, { $set: { favorite: "" } }).then((response) => {
      console.log(response);
      res.json(response)
    })
  }

})




module.exports = router;
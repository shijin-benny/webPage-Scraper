const express = require('express');
const async = require('hbs/lib/async');
const {fetchurlContent} = require('./api/fetch-urlContent')
const {cleanContent} = require('./api/cleanContent')
const {wordCount} = require('./api/WordCount')
const cheerio = require('cheerio');
const helpers = require('../helpers/helpers')



const router = express.Router();


router.get('/',(req,res)=>{
   res.render('index')
})

router.post('/setDetails',async(req,res)=>{
    const url = req.body.url
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
        href:$(element).attr('href'), // get the href attribute
      });
    });
    // collect the images
    const Images = $('img');
    const images =[];
    Images.each((index,element)=>{
      images.push({
          src:$(element).attr('src') // get the src attributes
      })
    })
    const addDetails = await helpers.addDetails({name:url,total:totalWord,webLinks:links,mediaLinks:images})
   
      res.render('showTable')
     
    
})

router.get('/showTable',async (req,res)=>{
  const tableDetails = await helpers.getDetails()
   res.render('table',{tableDetails})
})

router.post('/remove', async(req,res)=>{
 const removeitem = await helpers.Removehistory(req.body.itemId)
  res.json(removeitem)

})

router.post('/setfavorite',(req,res)=>{
   helpers.setFavorite(req.body).then((response)=>{
     res.json(response.acknowledged)
   })
})




module.exports = router;
const express = require('express');
const async = require('hbs/lib/async');
const {fetchurlContent} = require('./api/fetch-urlContent')
const {cleanContent} = require('./api/cleanContent')
const {wordCount} = require('./api/WordCount')
const cheerio = require('cheerio');
const { index } = require('cheerio/lib/api/traversing');


const router = express.Router();


router.get('/',(req,res)=>{
   res.render('index')
})

router.post('/getCount',async(req,res)=>{
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

    res.render('Table')
})



module.exports = router;
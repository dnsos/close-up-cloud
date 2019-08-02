/*
  BATCH IMAGE RESIZING

  Instructions:
  1. Create directory 'in' and insert all images to be resized
  2. Create directory 'out' where resized images will be written to
  3. Run this script using 'node resizeImages.js' (node installation required)

*/

'use strict'
const fs = require('fs')
const sharp = require('sharp')

// iterate all entries in 'in' directory
fs.readdir('in', (err, entries) => {
  if (err) throw err

  // operate on each entry
  entries.map(entry => {

    // read each file
    fs.readFile('in/' + entry, (err, data) => {
      if (err) throw err
      
      const image = sharp(data)
    
      // resizing process
      image
        .metadata() // access metadata of input image
        .then(metadata => {
          return image
            .resize(Math.round(metadata.width / 2)) // resize factor 0.5
            .jpeg({ quality: 60 }) // jpg quality
            .toBuffer()
        })
        .then(data => {
          // write resized image to 'out' directory with same filename as input
          image.toFile('out/' + entry, (err, info) => { 
            if (err) throw err
            console.log('Resizing successfully completed')
            console.log('File:', info)
          })
        })
    })

  })
})
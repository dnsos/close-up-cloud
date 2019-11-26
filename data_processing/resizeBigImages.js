/*
  BATCH IMAGE RESIZING

  Instructions:
  1. Create directory 'in' and insert all images to be resized
  2. Create directory 'out' where resized images will be written to
  3. Run this script using 'node resizeImages.js' (node installation required)

*/

"use strict";
const fs = require("fs");
const sharp = require("sharp");

const pathIn = "../public/assets/images/frames_x1/";
const pathOut = "../public/assets/images/frames_x2/";

// iterate all entries in 'in' directory
fs.readdir(pathIn, (err, entries) => {
  if (err) throw err;

  // operate on each entry
  entries.map(entry => {
    // read each file
    fs.readFile(pathIn + entry, (err, data) => {
      if (err) throw err;

      // resizing process
      sharp(data)
        .resize(4096, 4096, { fit: "inside" }) // resize factor 0.5
        .jpeg({ quality: 60 }) // jpg quality
        .toFile(pathOut + entry, err => {
          if (err) console.log(err);
          else console.log("resized", entry);
        });
    });
  });
});

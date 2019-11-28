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
const path = require("path");

const pathIn = "../public/assets/images/frames_x1/";
// const pathIn = "../public/assets/images/test/";
const pathOut = "../public/assets/images/frames_x2/";

const metadataPath = "../public/assets/data/objects-label-metadata.json";
const objectsmetadata = require(metadataPath);

// iterate all entries in 'in' directory
fs.readdir(pathIn, (err, entries) => {
  if (err) throw err;

  // operate on each entry
  entries.map(entry => {
    // read each file
    fs.readFile(pathIn + entry, (err, data) => {
      if (err) throw err;

      // resizing process
      const image = sharp(data);
      image
        .metadata() // access metadata of input image
        .then(metadata => {
          const { width, height } = metadata;

          const nWidth = Math.round(
            width > height ? 4096 : (width / height) * 4096
          );
          const nHeight = Math.round(
            width > height ? (height / width) * 4096 : 4096
          );

          const id = entry.replace(".jpg", "");
          const index = objectsmetadata.findIndex(d => d.id === id);
          if (!index) console.warn(id, "not found");

          objectsmetadata[index].origWidth = width;
          objectsmetadata[index].origHeight = height;
          objectsmetadata[index].width = nWidth;
          objectsmetadata[index].height = nHeight;

          console.log(index, width, height);

          image
            .resize(nWidth, nHeight)
            .jpeg({ quality: 60 }) // jpg quality
            .toFile(pathOut + entry, err => {
              if (err) console.log(err);
              else console.log("resized", entry);
            });
        });
    });
  });

  setTimeout(() => {
    fs.writeFileSync(metadataPath, JSON.stringify(objectsmetadata, null, 2));
  }, 3000);
});

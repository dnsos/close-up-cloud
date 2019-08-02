/*

  PIXI RESOURCES JSON FROM FILENAMES

  Instructions:
  1. Create 'in' directory and insert all files that are to be included in the JSON
  2. Create 'out' directory where the output JSON will be written to
  3. Run this script using 'node getResourcesJSON.js' (node installation required)

*/

'use strict'
const fs = require('fs')
const util = require('util')

// define path where resources will be stored
const resourcesFilePath = './assets/img/resized/'

const readdir = util.promisify(fs.readdir)

// async function that iterates over all entries in 'in' directory
async function getResourcesJSON() {
  try {
    const entries = await readdir('in')
    const resources = await entries.map(entry => {
      // returns object with name and url to resource (necessary syntax for PIXI loader to access)
      return {
        name: entry.replace('.jpg', ''),
        url: resourcesFilePath + entry
      }
    })
    let data = JSON.stringify(resources)
    fs.writeFileSync('out/resources.json', data)
    
  } catch (err) {
    console.log('error', err)
  }
  
}

getResourcesJSON()

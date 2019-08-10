const fs = require('fs');
const path = require('path');

const dataPath = '../src/assets/data/';
const csvFile = 'src/20190605_CloseUpCloud-Auswahl146.csv';
const jsonFile = 'src/labelbox-export-2019-08-10T15_14_43.595Z.json';
const outFile = 'objects-label-metadata.json';

const csvContent = fs.readFileSync(path.resolve(__dirname, dataPath, csvFile), {encoding: 'utf8'});
const jsonContent = fs.readFileSync(path.resolve(__dirname, dataPath, jsonFile), {encoding: 'utf8'});

const csvData = parseCsv(csvContent);
const jsonData = JSON.parse(jsonContent);

for(let i=0; i<csvData.length; i++) {
    csvData[i] = cleanupCsv(csvData[i]);
}

const out = combineData(jsonData, csvData);

fs.writeFile(path.resolve(__dirname, dataPath, outFile), JSON.stringify(out, null, 2), (err) => {
    if(err) {
        console.log('*** Error writing file', err);
    } else {
        console.log('*** DONE :)');
        console.log('***', out.length, 'valid Objects');
        console.log('*** Combined data written to file:', path.resolve(__dirname, dataPath, outFile));
    }   
});


/**
 * combineData
 * Enhances the JSON data from Labelbox with the CSV metadata
 * Also slightly rewrites the Labelbox "Label"-Data to arrays
 * @param {Object} labelboxData 
 * @param {Object} metaData 
 * @return {Object}
 */
function combineData(labelboxData, metaData) {

    console.log('*** Processing', labelboxData.length, 'Objects ...');

    const out = [];

    for(let labelboxObj of labelboxData) {

        const id = sanitizeFilename(labelboxObj['External ID']);
        const csvRow = metaData.find((row) => row.Inventarnummer === id);

        //console.log('--- object ---', id);

        if(!csvRow) {
            console.log('*** No CSV row found for', id, ', skipping ...');
            continue;
        }

        if(labelboxObj['Label'] === 'Skip') {
            console.log('*** No Label Data for', id, ', skipping ...');
            continue;
        }

        const tags = [];
        for(let tagname in labelboxObj['Label']) {

            //console.log('--- tag ---', tagname);

            const tagGeometry = {
                title: tagname,
                geometry: []
            }
            
            for(let geometry of labelboxObj['Label'][tagname]) {

                cleanGeometry = getGeometryBoundaries(geometry.geometry);
                tagGeometry.geometry.push(cleanGeometry);
            }

            tags.push(tagGeometry);
        }

        const objectData = {
            id:         id, 
            title:      csvRow['Titel'],
            date:       csvRow['Anzeige Datierung'], 
            location:   csvRow['Ort'], 
            widthInCm:  csvRow['widthInCm'], 
            heightInCm: csvRow['heightInCm'], 
            signature:  csvRow['Signatur'],
            tags:       tags
        };

        out.push(objectData);
    }

    return out;
}


/**
 * cleanupCsv
 * Parse and sanitize individual properties 
 * @param {Object} row 
 * @return {Object}
 */
function cleanupCsv(row) {

    //parse "Maße" - extract width and height as float in cm
    if(row['Maße']) {
        const rgxHeight = new RegExp(/Höhe: (\d+,?\d?)cm/)
        const rgxWidth = new RegExp(/Breite: (\d+,?\d?)cm/)

        let match = row['Maße'].match(rgxWidth);
        if(match) row['widthInCm'] = parseFloat(match[1].replace(/,/, '.'));

        match = row['Maße'].match(rgxHeight);
        if(match) row['heightInCm'] = parseFloat(match[1].replace(/,/, '.'));

        delete row['Maße'];
    }

    return row;
}


/**
 * getGeometryBoundaries
 * Parse the non-unifrom Labelbox geometry data
 * @param {Object} geometry 
 * @return {Object}
 */
function getGeometryBoundaries(geometry) {

	let top = 9999, left = 9999, width = 0, height = 0;

	//find the highest and lowest x and y
	for(let i=0; i<geometry.length; i++) {
		if(geometry[i].y < top) top = geometry[i].y;
		if(geometry[i].x < left) left = geometry[i].x;

		if(geometry[i].x > width) width = geometry[i].x;
		if(geometry[i].y > height) height = geometry[i].y;
	}

	width = width - left;
	height = height - top;
	width = height = Math.max(width, height);

	//console.log('assuming geometry', {top, left, width, height});
	return {
        x: left,
        y: top, 
        width, 
        //height
    };
}


/**
 * sanitizeFilename
 * remove file extention from filename
 * @param {string} filename 
 * @return {string}
 */
function sanitizeFilename(filename) {
	const fileParts = filename.split('.'); 
	fileParts.pop();
	return fileParts.join('.');
}



/**
 * parseCsv
 * Convert multiline and comma-seperated csv string into an array of objects
 * @param {string} strIn 
 * @return {Object} 
 */
function parseCsv(strIn) {

	const out = [];
	const rows = strIn.split('\r\n');
    const labels = rows.shift().split(',');

	rows.forEach((r,r_i) => {
		//@see https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes/23582323
		const row = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
		if(!out[r_i]) out[r_i] = {};
		labels.forEach((l,l_i) => {
			if(!row[l_i]) return;
			out[r_i][l] = row[l_i].replace(/"/g, '');			
        });
	})
	
	return out;
}
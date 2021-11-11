const fs = require("fs");
const path = require("path");
const convertDir = 'convert';
const generatedFileDir = `generated`;
const logDir = 'log';

/**
 * Generate a timestamp and remove extra string
 * @returns {string}
 */
const generateTimestamp = () => {
    let dateTimestamp;
    dateTimestamp = new Date().toISOString()
        .replace(/:/g, '')
        .replace(/T/, '_')
        .replace(/\..+/, '');
    return dateTimestamp;
}

/**
 * Get generated JSON file path
 * @returns {string}
 */
const getGeneratedJsonFilePath = () => {
    return generatedFileDir+'/'+'generated_json_'+generateTimestamp()+'.json';
}

/**
 * Get log file path with timestamp
 * @param pathToLogDir
 * @param type
 * @returns {string}
 */
const getLogFilePath = (pathToLogDir, type) => {
    return pathToLogDir + '/'+ type + '_' + generateTimestamp() + '.log';
}

/**
 * Check the file existing under certain path with filter
 * @param startPath
 * @param filter
 * @returns {boolean}
 */
const isFileExisting = (startPath, filter) => {
    console.log('Start checking from dir '+startPath+'/');
    if (!fs.existsSync(startPath)){
        console.log("no dir ", startPath);
        return false;
    }

    if (getConvertSourceFilename(startPath, filter)) {
        return true;
    }

    return false;
}

/**
 * Get convert source filename
 * @param path
 * @param filter
 * @returns {*}
 */
const getConvertSourceFilename = (startPath, filter) => {
    let files=fs.readdirSync(startPath);
    if (files.length === 0) {
        return false;
    }

    for(let i = 0; i < files.length; i++){
        let filename = path.join(startPath,files[i]);
        let stat = fs.lstatSync(filename);
        if (filename.indexOf(filter) >= 0 && stat) {
            return filename;
        }
    }
}

module.exports = {
    convertDir,
    generatedFileDir,
    logDir,
    generateTimestamp,
    getGeneratedJsonFilePath,
    getLogFilePath,
    isFileExisting,
    getConvertSourceFilename
}

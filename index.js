const { program } = require('commander');
const helper = require('./src/helper');
const generator = require('./src/generator');
const fs = require("fs");
require("dotenv").config();

program.version('0.0.1');
program.option('--file-to-convert <filePath>', 'XML file to convert, move file to generated directory');
program.showSuggestionAfterError(true);
program.parse();

const args = program.opts();
let toBeConvertedFilePath = args.fileToConvert;

if (!args.hasOwnProperty("fileToConvert")) {
    console.log("--file-to-convert: XML file is missing\n")
    if (helper.isFileExisting(helper.convertDir, '.xml')) {
        toBeConvertedFilePath = helper.getConvertSourceFilename(helper.convertDir, '.xml');
        console.log(`---Found ${toBeConvertedFilePath}`);
    } else {
        console.log(`No XML files found in ${helper.convertDir} directory`)
        return false;
    }

    console.log(`Use < ${toBeConvertedFilePath} > as source file.\n`);
}

const mainProcess = async () => {
    //preparing the data
    let jsonData = await generator.convertXmlToJsonData(toBeConvertedFilePath);
    console.log("JSON data is ready!");
    //Write into a generated JSON file
    let newJsonFilePath = await generator.processingJsonGenerating(jsonData);
    console.log("Generator process finished!")
    return newJsonFilePath;
}


mainProcess()
    .then((result) => {
        //Write into Log file
        let logFilePath = helper.getLogFilePath(helper.logDir, "success");
        fs.appendFileSync(
            logFilePath,
            `${toBeConvertedFilePath} has been converted to JSON format successfully, data store in ${result}`
        );
    })
    .catch((error) => {
        console.error(error);
        //Write error into log file
        let errorLogFilePath = helper.getLogFilePath(helper.logDir, "error");
        fs.appendFileSync(
            errorLogFilePath,
            `${toBeConvertedFilePath} error on converting: ${error}`
        );
    });


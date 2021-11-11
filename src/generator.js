require("dotenv").config();
const xmlConvert = require("xml-js");
const fs = require("fs");
const helper = require("./helper");
const generatedJsonFilePath = helper.getGeneratedJsonFilePath();
const TurndownService = require("turndown");
const htmlEntities = require("html-entities");

/**
 * XML to JSON options, get more available options from
 * https://www.npmjs.com/package/xml-js#convert-xml-%E2%86%92-js-object--json
 * @type {{compact: boolean, ignoreDeclaration: boolean, spaces: number}}
 */
const xml2JsonOptions = {
    compact: true,
    ignoreDeclaration: true,
    spaces: 3
};

/**
 * Convert XML data to JSON data structure with xml2json plugin
 * @param filePath
 * @returns {Promise<any>}
 */
const convertXmlToJsonData = async (filePath) => {
    console.log('\nConverting XML to JSON');
    let xmlString = fs.readFileSync(filePath, "utf-8");
    let generatedJsonDataString = xmlConvert.xml2json(xmlString, xml2JsonOptions)
    return JSON.parse(generatedJsonDataString);
}

/**
 * Write JSON format date to new file
 * @param jsonData
 * @returns {Promise<string>}
 */
const processingJsonGenerating = async (jsonData) => {
    let contentType = Object.keys(jsonData).shift();
    let cTypeKey = contentType.slice(0, -1);
    console.log(`Start Converting: ${cTypeKey}`);

    for (const cType of jsonData[contentType][cTypeKey]) {
        let index = jsonData[contentType][cTypeKey].indexOf(cType);
        let resourceDataKeys = Object.keys(jsonData[contentType][cTypeKey][index]);

        for (let k = 0; k < resourceDataKeys.length; k++) {
            let key = resourceDataKeys[k];
            let keyItem = jsonData[contentType][cTypeKey][index][key];
            let value = null;

            if (keyItem.hasOwnProperty("_text")) {
                value = keyItem._text;
                if (key === "content") {
                    //Convert encode HTML string to Markdown
                    value = convertHtmlToMarkDown(contentfulHtmlTextDecode(keyItem._text));
                }
            } else{
                //if the value is multiple entries
                if (Object.keys(keyItem) !== null && Object.keys(keyItem).length === 1 ) {
                    value = keyItem[Object.keys(keyItem)[0]];
                }
            }
        }
    }

    console.log(`Writing JSON data to file : ${generatedJsonFilePath}`)
    fs.appendFileSync(generatedJsonFilePath, JSON.stringify(jsonData, null, 3));

    return generatedJsonFilePath;
}

/**
 * Convert HTML string to Markdown
 * @param htmlEntity
 * @returns {*}
 */
const convertHtmlToMarkDown = (htmlEntity) => {
    const turnDownService = new TurndownService();
    let markDown = turnDownService.turndown(htmlEntity);
    return markDown;
}

/**
 * Convert encoded HTML string
 * @param encodedText
 * @returns {string}
 */
const contentfulHtmlTextDecode = (encodedText) => {
    return htmlEntities.decode(encodedText);
}

module.exports = {
    convertXmlToJsonData,
    processingJsonGenerating,
    convertHtmlToMarkDown
}
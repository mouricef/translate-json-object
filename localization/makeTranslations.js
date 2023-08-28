const { createWriteStream } = require('fs');

// installed from my own repository , globally
var TJO = require('./../lib/translate-json-object')();
var json_SOURCE_OF_TRUTH = require('./locals/en.json');
var supportedLanguages = require('./supportedLanguages');
var fs = require('fs');
var path = require('path');

const outputDirectory = 'translations';

const writeToFile = (data, lang = 'out.txt') => {
    //TODO mkdir translation folder  - if it does not exist, code fails
    const stream = createWriteStream(pathRelative(lang));
    stream.once('open', function (fd) {
        stream.write(JSON.stringify(data));
        stream.end();
        console.log('lang', lang, ' written');
    });
};

TJO.init({
    deeplApiKey: '867a63ed-1620-5d7b-6135-da90afd1138b',
});

function convertToNestedKeys(obj, parentKey = "") {
    const result = {};

    for (const key in obj) {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            result[key] = convertToNestedKeys(obj[key], `${parentKey}${key}.`);
        } else {
            result[key] = `${parentKey}${key}`;
        }
    }

    return result;
}

(async function main() {
    try {
        const outputDirectoryPath = path.join(__dirname, outputDirectory);
        const translationFolderExists = fs.existsSync(outputDirectoryPath);
        if (!translationFolderExists) {
            fs.mkdirSync(outputDirectoryPath);
        }


        for (const lang of supportedLanguages) {
            if (fileExists(lang) === false) {
                let data = await TJO.translate(json_SOURCE_OF_TRUTH, lang);
                writeToFile(data, lang);
                sleep(1000);

                let planeJsonData = [];
                for (let k in data) {
                    planeJsonData = { ...planeJsonData, ...data[k] }
                    // planeJsonData.push(data[k]);
                }
                writeToFile(planeJsonData, 'key_value_' + lang);
                sleep(1000);
            } else {
                console.log('File already exits for lang ', lang);
            }
        }

        let planeEnJsonData = [];
        let enData = json_SOURCE_OF_TRUTH;
        for (let k in enData) {
            planeEnJsonData = { ...planeEnJsonData, ...enData[k] }
        }
        writeToFile(planeEnJsonData, 'key_value_en');

        sleep(1000);

        // //Find: "(.*?)":
        // //Replace: $1:
        // let translationData = json_SOURCE_OF_TRUTH;
        // const translationKeys = convertToNestedKeys(translationData, "");
        // writeToFile(translationKeys, 'translation_keys');
        // sleep(1000);
    } catch (error) {
        console.log('error ', error);
    }

    console.log(
        'Do not forget to run prettier on translations folder to make output pretty',
    );
    console.log('Now you can copy translations folder into app.');
})();

function fileExists(lang) {
    return fs.existsSync(pathRelative(lang));
}

function pathRelative(lang) {
    return path.join(__dirname, outputDirectory, lang + '.json');
}

function sleep(ms = 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
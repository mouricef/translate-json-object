var Promise = require('promise');
var _ = require('lodash');

var translateService;

const deepl = require('deepl-node');

function init(setting) {
    translateService = new deepl.Translator(setting.deeplApiKey);
}

// eslint-disable-next-line max-params
function translateObject(language, key, destObj, keysArray, valuesArray) {
    return new Promise(function (resolve, reject) {
        translateService.translateText(valuesArray, null, language).then((res) => {
            for (var i = 0; i < keysArray.length; i++) {
                destObj[key][keysArray[i]] = res[i].text;
            }
            resolve(destObj);
        }, (error) => {
            reject(error);
        });
    });
}

function translateString(language, key, destObj, valueStr) {
    return new Promise(function (resolve, reject) {
        translateService.translateText(valueStr, null, language).then((res) => {
            destObj[key] = res.translatedText;
            resolve(destObj);
        }, (error) => {
            reject(error);
        });
    });
}

module.exports = {
    init: init,
    object: translateObject,
    string: translateString
};

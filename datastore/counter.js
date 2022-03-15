const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

const returnData = (err, data) => {
  if (err) {
    console.log('err from returnData Callback:', err);
    return;
  }
  console.log('non error from returnData Callback:', data);
  // return a zero padded number here instead?
  return data;
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (err, data) => {
  var returnId;
  readCounter(function(err, idNum) {
    if (err) {
      console.log('readCounter error in getNextUniqueId');
    } else {
      let incremented = idNum + 1;
      writeCounter(incremented, function(err2, counterStr) {
        if (err2) {
          console.log('writeCounter error in getNextUniqueId');
        } else {
          returnId = counterStr;
        }
      });
    }
  });

  return zeroPaddedNumber(returnId);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');

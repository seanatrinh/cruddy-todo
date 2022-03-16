const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

const writeTodo = (text, id, callback) => {
  fs.writeFile(path.join(exports.dataDir, id.toString() + '.txt'), text, (err) => {
    if (err) {
      callback(err, {id, text});
      throw ('error writing text');
    } else {
      callback(null, {id, text});
    }
  });
};

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, uniqueID) {
    if (err) {
      throw ('error at getNextUniqueId');
    } else {
      writeTodo(text, uniqueID, callback);
    }
  });
};

const readTodos = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, slicedFiles);
      throw ('error reading dataDir');
    } else {
      let slicedFiles = files.map((file) => {
        // !!!!! We need to refactor this so that text is the actual text.
        let id = file.substr(0, file.length - 4);
        return readFilePromise(file).then((fileData) => {
          return {
            id: id,
            text: fileData
          };
        });
      });
      Promise.all(slicedFiles)
        .then((items) => {
          callback(null, items);
        });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      let data = files.map((file) => {
        let id = path.basename(file, '.txt');
        return readFilePromise(path.join(exports.dataDir, file)).then((fileData) => {
          return {
            id: id,
            text: fileData.toString()
          };
        });
      });
      Promise.all(data)
        .then((items) => {
          callback(null, items);
        });
    }
  });
};

const readTodo = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id.toString() + '.txt'), 'utf8', (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, {id: id, text: fileData});
    }
  });
};

exports.readOne = (id, callback) => {
  readTodo(id, function(err, todo) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, todo);
    }
  });
};

const updateTodo = (id, text, callback) => {
  // check if file exists
  fs.readFile(path.join(exports.dataDir, id.toString() + '.txt'), 'utf8', (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(path.join(exports.dataDir, id.toString() + '.txt'), text, (err) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.update = (id, text, callback) => {
  updateTodo(id, text, function(err, newText) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, newText);
    }
  });
};

exports.delete = (id, callback) => {

  fs.unlink(path.join(exports.dataDir, id.toString() + '.txt'), (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });



  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

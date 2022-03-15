const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

const writeTodo = (text, id, callback) => {
  fs.writeFile(path.join(exports.dataDir, id.toString() + '.txt'), text, (err) => {
    if (err) {
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
      throw ('error reading dataDir');
    } else {
      let slicedFiles = files.map((file) => {
        // !!!!! We need to refactor this so that text is the actual text.
        return {id: file.substr(0, file.length - 4), text: file.substr(0, file.length - 4)};
      });
      callback(null, slicedFiles);
    }
  });
};

exports.readAll = (callback) => {
  readTodos(function(err, files) {
    if (err) {
      throw ('error at readAll');
    } else {
      callback(null, files);
    }
  });
};

const readTodo = (callback) => {
  console.log('we made ittttttt' + id);
  // console.log(path.join(exports.dataDir, id.toString() + '.txt'));
  fs.readFile(path.join(exports.dataDir, id.toString() + '.txt'), (err, fileData) => {
    if (err) {
      throw ('error at readTodo');
    } else {

      callback(null, {id: id, text: fileData});
    }
  });
};

exports.readOne = (id, callback) => {
  console.log(id);
  readTodo(function(err, todo) {
    console.log(todo);
    if (err) {
      throw ('error at readOne');
    } else {
      console.log(todo);
      callback(todo);
    }
  });


  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

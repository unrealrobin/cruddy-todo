const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //define a callback that handles an error and a correct case
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      //creats path
      let todoPath = path.join(exports.dataDir, `${id}.txt`);
      //creates file
      fs.writeFile(todoPath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
          //console.log('The file has been saved!');
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  //asynchronous doesnt wait on any other functions to be completed to be able to finish
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading data folder');
    }
    var data = files.map(file => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      //readFilePromise is actually just fs.readFile but only takes the first argument
      //then...with the "resolve" 'd data, return an object with the id and text
      //synchronous function
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    //the call back is from the actual invocation of readAll somewhere
    Promise.all(data)
      .then(items => callback(null, items))
      .catch(err => callback(err));
  });




  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     //console.log(files)
  //     callback(null, files.map(txtFileName => {
  //       let id = txtFileName.split('.')[0];
  //       return {
  //         id: id,
  //         text: id
  //       };
  //     }));
  //   }
  // });
};

exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text});
    }
  });
};

exports.update = (id, text, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        // if (err) {
        //   callback(err);
        // } else {
        callback(null, {id, text});
        // }
      });
    }
  });
};


exports.delete = (id, callback) => {
  //think we use unlink here from nodejs

  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); //

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


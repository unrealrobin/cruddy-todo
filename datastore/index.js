const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //define a callback that handles an error and a correct case
  counter.getNextUniqueId((err, id) => {
    if(err){
      callback(err)
    }else{
      //creats path
      let todoPath = path.join(exports.dataDir, `${id}.txt`);
      //creates file
      fs.writeFile(todoPath, text, (err) => {
        if (err) {
          callback(err)
        }else{
          callback(null, { id, text })
          //console.log('The file has been saved!');
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      //console.log(files)
      callback(null, files.map(txtFileName => {
        let id = txtFileName.split('.')[0];
        return {
          id:id,
          text:id
        }
      }));
    }
  })
};

exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id,text});
    }
  });
};

// exports.update = (id, text, callback) => {
  //fs.readFile --> (err, text)
    //if(err) {
      //do
    //} else {
        //fs.writeFile with the goods
    //}
 exports.update = (id, text, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        // if (err) {
        //   callback(err);
        // } else {
        callback(null, {id,text});
        // }
      });
    }
  });
};


exports.delete = (id, callback) => {
  //think we use unlink here from nodejs

  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if(err){
      callback(err);
    }else{
      callback()
    }
  })

};



// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data'); //

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


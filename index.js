var fs = require("fs");
const { exec } = require("child_process");

var path = require("path");
const { FILE } = require("dns");
var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      let file1 = file;
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            exec("git add " + file, (error, stdout, stderr) => {
              if (error) {
                console.log(`error: ${error.message}`);
                return;
              }
              if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
              }
              console.log(`stdout: ${stdout}`);
            });

            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk(".", function (err, results) {
  if (err) throw err;
  console.log(results.length);
});

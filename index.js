var exec = require('child_process').exec

// a forbidden set of characters, use something that will never occur in a commit message.
var logsplit_string = '  |  ';

// special tags that can be used in logobj_properties instead of format strings.
var SPECIAL = {
  TIME:0, // To get a time object since the commit, rather than a git string "minutes ago"
};

// the format of the object that will be built when logobj is called paired to the git log format string used to get it.
// alternatively we can use special parameters from SPECIAL to indicate we need a fancy version of what would otherwise be text.
var logobj_properties = {
  sha:{long:'%H', short:'%h'},
  time:{ago:'%cr', time:SPECIAL.TIME},
  author:'%an',
  msg:'%s'
};

var logobj_property_info = [];

// the string to use for logobj before any limit is added.
var logobj_command_string = 'git log --no-color --pretty=format:\"%H'+logsplit_string+'%cr'+logsplit_string+'%an'+logsplit_string+'%s\" --abbrev-commit';

var _populate_logobj = function(line) {
  var logobj = {};
  var splt = line.split(logsplit_string);
  for(var property in logobj_properties) {
    if(logobj_properties.hasOwnProperty(property)) {

    }
  }
  return logobj;
}

module.exports = {
    short : function (cb) {
      _command('git rev-parse --short HEAD', cb)
    }
  , long : function (cb) {
      _command('git rev-parse HEAD', cb)
    }
  , branch : function (cb) {
      _command('git rev-parse --abbrev-ref HEAD', cb)
    }
  , tag : function (cb) {
      _command('git describe --always --tag --abbrev=0', cb)
    }
  , logobj : function(cb, limit) {
      var cmd_string = 'git log --no-color --pretty=format:\"%H  |  %cr  |  %an  |  %s\" --abbrev-commit';
      if(limit != null && !isNaN(limit)) {
         cmd_string += ' -'+limit;
      }
      _command(cmd_string, function (str) {
      var logs = [];
      if ( str !== null ) {
        (str.split('\n')).forEach(function(line, line_idx) {
          var parsed_line = line.split('  |  ');
            logs.push({
              sha:{long:parsed_line[0], short:''},
              msg:parsed_line[3],
              time:{ago:parsed_line[1]},
              author:parsed_line[2]
            });
          });
        };
        cb(logs);
      });
  }
  , log : function (cb, limit) {
      var cmd_string = 'git log --no-color --pretty=format:\"%H'+logsplit_string+'%cr'+logsplit_string+'%an'+logsplit_string+'%s\" --abbrev-commit';
      if(limit != null && !isNaN(limit)) {
         cmd_string += ' -'+limit;
      }
      _command(cmd_string, function (str) {
      var logs = [];
      if ( str !== null ) {
        (str.split('\n')).forEach(function(line, line_idx) {
          var parsed_line = line.split(logsplit_string);
            logs.push([
              parsed_line[0],
              parsed_line[3],
              parsed_line[1],
              parsed_line[2]
            ]);
          });
        };
        cb(logs);
      });
   }
}


function _command (cmd, cb) {
  exec(cmd, { cwd: __dirname, maxBuffer: 1024 * 1024 }, function (err, stdout, stderr) {
    if (err !== null) {
    console.log('[NODE-GIT-REV] exec error: ' + err);
    cb(null);
  }
    cb(stdout.slice(0, -1));
  })
}

var _setup_property_info = function(){
  var i = 0;
  var _recursively_add_property = function(obj, rootname) {
    for(var property in obj) {
      if(obj.hasOwnProperty(property)) {
        var value = obj[property];

        if(typeof value === "string" || !isNaN(value)) {
          logobj_property_info.push({index:i, name:(rootname!=''?rootname+'.':'')+property, command: value});
          i++;
        } else {

          _recursively_add_property(value, (rootname!=''?rootname+'.':'')+property);
        }
      }
    }
  };
  _recursively_add_property(logobj_properties, '');
  //console.log('info', logobj_property_info);
}();

var _setup_command_string = function() {
  //logobj_command_string = '';
  var cmdstr = '';
  for(var i = 0; i < logobj_property_info.length; ++i) {
    if(isNaN(logobj_property_info.command)) {
      cmdstr += logobj_property_info.command;
    }
  }
  console.log('cmdstr', cmdstr);
}();
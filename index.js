var exec = require('child_process').exec

// special tags that can be used in logobj_properties instead of format strings.
var SPECIAL = {
  AUTHOR_DATEOBJ: 0, // A Date() object for the author time.
  COMMITTER_DATEOBJ: 1, // A Date() object for the committer time.
};

// This is the structure of the log info returned in an array from logobj. You can change the variable names as you see fit and
// add or remove format strings as defined here:(http://git-scm.com/docs/pretty-formats). There are also special cases as defined
// in SPECIAL.
var logobj_properties = {
  commit: { long_hash: '%H', short_hash: '%h' },
  tree: { long_hash: '%T', short_hash: '%t' },
  author: { name:'%aN', email:'%aE', date: { unix:'%at', relative:'%ar',  ISO:'%ai', date_obj:SPECIAL.AUTHOR_DATEOBJ } },
  committer: { name:'%cN', email:'%cE', date: { unix:'%ct', relative:'%cr',  ISO:'%ci', date_obj:SPECIAL.COMMITTER_DATEOBJ } },
  message: { encoding:'%e', subject:'%s', body:'%b', signature: { good:'%G?', signer:'%GS', key:'%GK' } }
};

var special_case_commands = [];
special_case_commands[SPECIAL.AUTHOR_DATEOBJ] = '%at';
special_case_commands[SPECIAL.COMMITTER_DATEOBJ] = '%ct';

var special_case_operations = [];
var _unix_to_date = function(value) { return new Date(Date(value * 1000)); };
special_case_operations[SPECIAL.AUTHOR_DATEOBJ] = _unix_to_date;
special_case_operations[SPECIAL.COMMITTER_DATEOBJ] = _unix_to_date;

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
      var cmd_string = logobj_command_string;
      if(limit != null && !isNaN(limit)) {
         cmd_string += ' -'+limit;
      }
      _command(cmd_string, function (str) {
      var logs = [];
      if ( str !== null ) {
        _itterate_lines_combining_bodytext(str, function(line) {
          var parsed_line = line.split(logsplit_string);
          var parsed_obj = {};
          for(var i = 0; i < logobj_property_info.length; ++i) {
            // for use later once the value is parsed out
            var value = parsed_line[logobj_property_info[i].index];
            var cmd = logobj_property_info[i].command;
            // split the variable name on dots so we can add intermediate objects before assigning the parsed value
            var dots_split = logobj_property_info[i].name.split('.');
            var latest_obj = parsed_obj;

            // after looping latest_obj should be pointing to the unassigned variable we want to store our value
            for(var j = 0; j < dots_split.length-1; ++j) {
              // create it if it doesn't exist yet
              if(latest_obj[dots_split[j]] == undefined) {
                latest_obj[dots_split[j]] = {};
              }
              latest_obj = latest_obj[dots_split[j]];
            }

            // is a special case?
            if(!isNaN(cmd)) {
              value = special_case_operations[cmd](value);
            }

            latest_obj[dots_split[dots_split.length-1]] = value;
          }

          logs.push(parsed_obj);
        });
      };
      cb(logs);
    });
  }
  , log : function (cb, limit, format) {
      if(format == null || isNaN(format.length)) {
        format = ['%H', '%an', '%cr', '%s'];
      }
      var cmd_string = 'git log --no-color --pretty=format:\"';
      for(var i = 0; i < format.length; ++i) {
        var formatter = format[i];
        if(_is_body_command(formatter)) {
          formatter = start_body_string + formatter + end_body_string;
        }
        cmd_string += formatter;
        
        if(i != format.length -1) {
          cmd_string += logsplit_string;
        }
      }
      cmd_string += '\" --abbrev-commit';
      if(limit != null && !isNaN(limit)) {
         cmd_string += ' -'+limit;
      }
      _command(cmd_string, function (str) {
        var results = [];
        if ( str !== null ) {
          _itterate_lines_combining_bodytext(str, function(line){
          });
      });
   }
}

var logsplit_string = '  |  ';

// array of information about the properties contained in logobj_properties
// logobj_property_info = [{index:0, name:'foo.bar', command:'%H'}]
var logobj_property_info = [];

// the string to use for logobj before any limit is added.
var logobj_command_string = '';

function _command (cmd, cb) {
  exec(cmd, { cwd: __dirname, maxBuffer: 1024 * 1024 }, function (err, stdout, stderr) {
    if (err !== null) {
      console.log('[NODE-GIT-REV] exec error: ' + err);
      cb(null);
    }
    cb(stdout.slice(0));
  });
}

{ // Setup logobj_property_info from logobj_properties
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
}


{ // Setup command string
  logobj_command_string = 'git log --no-color --pretty=format:\"';
  for(var i = 0; i < logobj_property_info.length; ++i) {
    // just a simple command string?
    if(isNaN(logobj_property_info[i].command)) {
    } 
    else { // special case
    }

    if(i != logobj_property_info.length-1) {
      logobj_command_string += logsplit_string;
    }
  }
  logobj_command_string += '\" --abbrev-commit';
}
var exec = require('child_process').exec

function _command (cmd, cb) {
  exec(cmd, { cwd: __dirname, maxBuffer: 1024 * 1024 }, function (err, stdout, stderr) {
    if (err !== null) {
		console.log('[NODE-GIT-REV] exec error: ' + err);
		cb(null);
	}
    cb(stdout.slice(0, -1));
  })
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
  , log : function (cb, limit) {
      var cmd_string = 'git log --no-color --pretty=format:\"%H  |  %cr  |  %an  |  %s\" --abbrev-commit';
      if(limit != null && !isNaN(limit)) {
         cmd_string += ' -'+limit;
      }
      _command(cmd_string, function (str) {
         var logs = [];
	 if ( str !== null ) {
      	    (str.split('\n')).forEach(function(line, line_idx) {
      	       var parsed_line = line.split('  |  ');
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

var git = require('../')
var inspect = require('util').inspect;

git.short(function (str) {
  console.log('short', str)
  // => aefdd94
})

git.long(function (str) {
  console.log('long', str)
  // => aefdd946ea65c88f8aa003e46474d57ed5b291d1
})

git.branch(function (str) {
  console.log('branch', str)
  // => master
})

git.tag(function (str) {
  console.log('tag', str)
  // => 0.1.0
})

git.log(function (array) {
  console.log('log', inspect(array, { colors: true }));
  // => [ [ '8ff80cfe54ca7fe4cb1fa780d146266c4145544d',
  //     'xoorath',
  //     '16 hours ago',
  //     'in progress: building command string :cactus:' ],
  //   [ 'cfb8a8fb9bd311698a1ca4b451656c79a28272fc',
  //     'xoorath',
  //     '16 hours ago',
  //     'in progress: working on property info and logobj' ],
  //   [ '7f0439b4f66c0cf2fd899ece0a036e63211c811f',
  //     'Roman Jurkov',
  //     '26 hours ago',
  //     'incorporated changes by @xoorath' ] ]
}, 3)

git.log(function (array) {
  console.log('log', inspect(array, { colors: true }));
  // => [ [ '8ff80cf', '8ff80cfe54ca7fe4cb1fa780d146266c4145544d' ],
  //   [ 'cfb8a8f', 'cfb8a8fb9bd311698a1ca4b451656c79a28272fc' ],
  //   [ '7f0439b', '7f0439b4f66c0cf2fd899ece0a036e63211c811f' ] ]
}, 3, ['%h', '%H'])

git.logobj(function(array) {
  console.log('logobj', inspect(array, { depth: 4, colors: true }));
  // => [ { commit: 
  //      { long_hash: '8ff80cfe54ca7fe4cb1fa780d146266c4145544d',
  //        short_hash: '8ff80cf' },
  //     tree: 
  //      { long_hash: '342c2b67449641ea2dd81e9f94851ab2decffaff',
  //        short_hash: '342c2b6' },
  //     author: 
  //      { name: 'xoorath',
  //        email: 'jared@xoorath.com',
  //        date: 
  //         { unix: '1449358043',
  //           relative: '16 hours ago',
  //           ISO: '2015-12-05 18:27:23 -0500',
  //           date_obj: Sun Dec 06 2015 10:28:57 GMT-0500 (EST) } },
  //     committer: 
  //      { name: 'xoorath',
  //        email: 'jared@xoorath.com',
  //        date: 
  //         { unix: '1449358043',
  //           relative: '16 hours ago',
  //           ISO: '2015-12-05 18:27:23 -0500',
  //           date_obj: Sun Dec 06 2015 10:28:57 GMT-0500 (EST) } },
  //     message: 
  //      { encoding: '',
  //        subject: 'in progress: building command string :cactus:',
  //        body: '',
  //        signature: { good: 'N', signer: '', key: '' } } } ]

    for(var  i = 0; i < array.length; ++i) {
      console.log('log.commit.short_hash', array[i].commit.short_hash);
      console.log('log.author.name', array[i].author.name);
      console.log('log.message.subject', array[i].message.subject);
      // => log.commit.short_hash 8ff80cf
      // => log.author.name xoorath
      // => log.message.subject in progress: building command string :cactus:
    }
}, 1)
# git-rev

access git revision state in node

# Example

``` js
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
  // [ [ '8ff80cfe54ca7fe4cb1fa780d146266c4145544d',
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
  // [ [ '8ff80cf', '8ff80cfe54ca7fe4cb1fa780d146266c4145544d' ],
  //   [ 'cfb8a8f', 'cfb8a8fb9bd311698a1ca4b451656c79a28272fc' ],
  //   [ '7f0439b', '7f0439b4f66c0cf2fd899ece0a036e63211c811f' ] ]
}, 3, ['%h', '%H'])

git.logobj(function(array) {
  console.log('logobj', inspect(array, { depth: 4, colors: true }));
  // [ { commit: 
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

```

# Methods

``` js 
var git = require('git-rev')
```

## .log(function (array) { ... }, limit, format)
return the git log of `process.cwd()` as an array.

#### param: limit
> default: `limit = undefined`

limits the number of logs to fetch. Default is no limit (limit === undefined).

#### param: format
> default: `format = ['%H', '%an', '%cr', '%s']`
 
An array of format strings (see: http://git-scm.com/docs/pretty-formats) for details.

#### log example
``` js
git.log(function (array) {
  console.log('log', array)
  // [ [ 'aefdd946ea65c88f8aa003e46474d57ed5b291d1',
  //     'add description',
  //     '7 hours ago',
  //     'Thomas Blobaum' ],
  //   [ '1eb9a6c8633a5a47a47487f17b17ae545d0e26a8',
  //     'first',
  //     '7 hours ago',
  //     'Thomas Blobaum' ],
  //   [ '7f85b750b908d28bfeb13ad6dba47d9d604508f9',
  //     'first commit',
  //     '2 days ago',
  //     'Thomas Blobaum' ] ]
}, 3)
```

## .logobj(function (array) { ... }, limit)
return the git log of `process.cwd()` as an array of objects.

The object returned has the following format
``` js
array[0].commit.long_hash; // '8ff80cfe54ca7fe4cb1fa780d146266c4145544d'
array[0].commit.short_hash; // '8ff80cf'

array[0].tree.long_hash; // '342c2b67449641ea2dd81e9f94851ab2decffaff'
array[0].tree.short_hash; // '342c2b6'

array[0].author.name; // 'xoorath'
array[0].author.email; // 'jared@xoorath.com'
array[0].author.date.unix; // '1449358043'
array[0].author.date.relative; // '16 hours ago'
array[0].author.date.ISO; // '2015-12-05 18:27:23 -0500'
array[0].author.date.date_obj; // new Date();

array[0].committer.name; // 'xoorath'
array[0].committer.email; // 'jared@xoorath.com'
array[0].committer.date.unix; // '1449358043'
array[0].committer.date.relative; // '16 hours ago'
array[0].committer.date.ISO; // '2015-12-05 18:27:23 -0500'
array[0].committer.date.date_obj; // new Date();

array[0].message.encoding; // ''
array[0].message.subject; // 'in progress: building command string :cactus:'
array[0].message.body; // ''
array[0].message.signature.good; // 'N';
array[0].message.signature.signer; // '';
array[0].message.signature.key; // '';
```

#### param: limit
> default: `limit = undefined`

limits the number of logs to fetch. Default is no limit (limit === undefined).

#### logobj example
``` js
git.logobj(function(array) {
  console.log('logobj', inspect(array, { depth: 4, colors: true }));
  // [ { commit: 
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
}, 1)
```

## .short(function (commit) { ... })
return the result of `git rev-parse --short HEAD`

## .long(function (commit) { ... })
return the result of `git rev-parse HEAD`

## .tag(function (tag) { ... })
return the current tag

## .branch(function (branch) { ... })
return the current branch

# Install

`npm install git-rev`

# License

(The MIT License)

Copyright (c) 2012 Thomas Blobaum <tblobaum@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
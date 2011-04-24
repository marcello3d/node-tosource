node-tosource
===========
Super simple function to convert JavaScript objects back to source code.

Examples
--------

The following code:

    var toSource = require('tosource')
    console.log(toSource(
        [ 4, 5, 6, "hello", {
            a:2,
            'b':3,
            '1':4,
            'if':5,
            'undefined':undefined,
            'null':null,
            foo: function(bar) {
                console.log("woo! a is "+a)
                console.log("and bar is "+bar)
            }
        },
        /we$/gi,
        new Date("Wed, 09 Aug 1995 00:00:00 GMT")]
    ))

Outputs:

    [ 4,
      5,
      6,
      "hello",
      { "1":4,
        a:2,
        b:3,
        "if":5,
        "undefined":undefined,
        "null":null,
        foo:function (bar) {
                console.log("woo! a is "+a)
                console.log("and bar is "+bar)
            } },
      /we$/gi,
      new Date(807926400000) ]

See [test.js][1] for more examples.

License
-------
toSource is open source software under the [zlib license][2].

[1]: https://github.com/marcello3d/node-tosource/blob/master/test.js
[2]: https://github.com/marcello3d/node-tosource/blob/master/LICENSE
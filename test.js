var toSource = require('./tosource')
var assert = require('assert')

// Various types
var date = new Date()
var a
var v = toSource(
  [4, 5, 6, 'hello', {
    a: 2,
    'b': 3,
    '1': 4,
    'if': 5,
    negzero: -0,
    yes: true,
    no: false,
    nan: NaN,
    infinity: Infinity,
    'undefined': undefined,
    'null': null,
    foo: function (bar) { console.log('woo! a is ' + a); console.log('and bar is ' + bar); }
  },
    /we$/gi,
    new RegExp('/w/e/', 'ig'),
    /\/w\/e\//mig,
    date,
    new Date('Wed, 09 Aug 1995 00:00:00 GMT'),
    new Set(),
    new Set([1, 'hello', {}]),
    new Map(),
    new Map([[{ hello: 'world' }, 'hello'], [1, [1, new Set()]]])
  ],
  null, false)

assert.equal(
  v,
  String.raw`[4,5,6,"hello",{"1":4,a:2,b:3,"if":5,negzero:-0,yes:true,no:false,nan:NaN,infinity:Infinity,"undefined":undefined,"null":null,foo:function (bar) { console.log('woo! a is ' + a); console.log('and bar is ' + bar); }},/we$/gi,/\/w\/e\//gi,/\/w\/e\//gim,new Date(${date.getTime()}),new Date(807926400000),new Set(),new Set([1,"hello",{}]),new Map(),new Map([[{hello:"world"},"hello"],[1,[1,new Set()]]])]`
)

// Filter parameter (applies to every object recursively before serializing)
assert.equal(
  toSource(
    [4, 5, 6, { bar: 3 }],
    function numbersToStrings(value) {
      return typeof value === 'number' ? '<' + value + '>' : value
    }
  ),
  '[ "<4>",\n' +
  '  "<5>",\n' +
  '  "<6>",\n' +
  '  { bar:"<3>" } ]'
)

// No indent
assert.equal(
  toSource([4, 5, 6, { bar: 3 }], null, false),
  '[4,5,6,{bar:3}]'
)

// Circular reference
var object = { a: 1, b: 2 }
object.c = object

assert.equal(
  toSource(object),
  '{ a:1,\n' +
  '  b:2,\n' +
  '  c:{$circularReference:1} }'
)

// Not a circular reference
var foo = {}
object = { a: foo, b: foo }

assert.equal(
  toSource(object),
  '{ a:{},\n' +
  '  b:{} }'
)

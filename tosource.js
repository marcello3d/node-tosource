// Objects where toSource is equal to toString
[Boolean, Function, Number, RegExp].forEach(function(constructor)
{
  var prototype = constructor.prototype;
  if(prototype.toSource == undefined)
     prototype.toSource = prototype.toString;
});


// Objects with a specific output for toSource
function initIndent(indent)
{
  return indent === undefined ? '  ' : (indent || '')
}

function join(elements, currentIndent) {
    var indent = initIndent(walk.indent)

    return indent.slice(1) + elements.join(','+(indent&&'\n')+currentIndent) +
           (indent ? ' ' : '');
}

var prototype;

prototype = Array.prototype;
if(prototype.toSource == undefined)
  prototype.toSource = function(currentIndent, seen)
  {
    var items = join(this.map(function(element){
        return walk(element, currentIndent, seen.slice())
    }),
    currentIndent)

    return '[' + items + ']'
  };

prototype = Date.prototype;
if(prototype.toSource == undefined)
  prototype.toSource = function()
  {
    return 'new Date('+this.getTime()+')'
  };

prototype = String.prototype;
if(prototype.toSource == undefined)
  prototype.toSource = function()
  {
    return JSON.stringify(this)
  };

prototype = Object.prototype;
if(prototype.toSource == undefined)
  prototype.toSource = function(currentIndent, seen)
  {
    var self = this;

    var keys = Object.keys(this)
    var items = ''
    if(keys.length)
    {
      items = join(keys.map(function (key) {
        var s_key = legalKey(key) ? key : JSON.stringify(key)
        var value = walk(self[key], currentIndent, seen.slice())

        return s_key + ':' + value
      }),
      currentIndent)
    }

    return '{' + items + '}'
  };


/* toSource by Marcello Bastea-Forte - zlib license */
function walk(object, currentIndent, seen) {
    var filter = walk.filter
    object = filter ? filter(object) : object

    var indent = initIndent(walk.indent)

    switch (typeof object) {
        case 'boolean':
        case 'function':
        case 'number':
        case 'string':    return object.toSource()
        case 'undefined': return 'undefined'
    }

    if (object === Math) return 'Math'
    if (object === null) return 'null'

    if (object instanceof RegExp) return object.toSource()
    if (object instanceof Date)   return object.toSource()

    if (seen.indexOf(object) >= 0) return '{$circularReference:1}'
    seen.push(object)

    return object.toSource(currentIndent + indent, seen);
}


module.exports = function(object, filter, indent, startingIndent) {
    walk.filter = filter
    walk.indent = initIndent(indent)

    var result = walk(object, startingIndent || '', [])

    delete walk.filter
    delete walk.indent

    return result
}

var KEYWORD_REGEXP = /^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/

function legalKey(string) {
    return /^[a-z_$][0-9a-z_$]*$/gi.test(string) && !KEYWORD_REGEXP.test(string)
}

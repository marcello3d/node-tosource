/* toSource by Marcello Bastea-Forte - zlib license */

var KEYWORD_REGEXP = /^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/

function legalKey(string) {
  return /^[a-z_$][0-9a-z_$]*$/gi.test(string) && !KEYWORD_REGEXP.test(string)
}

function walk(object, filter, indent, currentIndent, seen) {
  var nextIndent = currentIndent + indent
  object = filter ? filter(object) : object

  switch (typeof object) {
    case 'string':
      return JSON.stringify(object)
    case 'boolean':
    case 'number':
    case 'undefined':
      if (object === 0 && 1 / object < 0) {//check if negative zero
        return '-0';
      }
      return String(object)
    case 'function':
      return object.toString()
  }

  if (object === null) {
    return 'null'
  }
  if (object instanceof RegExp) {
    return object.toString();
  }
  if (object instanceof Date) {
    return 'new Date(' + object.getTime() + ')'
  }

  var seenIndex = seen.indexOf(object) + 1
  if (seenIndex > 0) {
    return '{$circularReference:' + seenIndex + '}'
  }
  seen.push(object)

  function join(elements) {
    return indent.slice(1) + elements.join(',' + (indent && '\n') + nextIndent) + (indent ? ' ' : '')
  }

  function joinArray(arr) {
    return join(arr.map(function (element) {
      return walk(element, filter, indent, nextIndent, seen.slice())
    }));
  }

  if (Array.isArray(object)) {
    return '[' + joinArray(object) + ']'
  }

  if (object instanceof Set) {
    //if has Set type => has Array.from
    return object.size < 1 ? 'new Set()' : 'new Set([' + joinArray(Array.from(object)) + '])'
  }

  if (object instanceof Map) {
    if (object.size < 1) {
      return 'new Map()'
    }
    var pairs = [];
    var iter = object.entries();
    var pair;
    while (!(pair = iter.next()).done) {
      pairs.push(pair.value);
    }
    return 'new Map([' + joinArray(pairs) + '])'
  }

  var keys = Object.keys(object)
  return keys.length ? '{' + join(keys.map(function (key) {
    return (legalKey(key) ? key : JSON.stringify(key)) + ':' + walk(object[key], filter, indent, nextIndent, seen.slice())
  })) + '}' : '{}'
}

module.exports = function (object, filter, indent, startingIndent) {
  return walk(object, filter, indent === undefined ? '  ' : (indent || ''), startingIndent || '', [])
}
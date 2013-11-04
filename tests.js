var checkVars = require('./index')
var assert = require('assert')

test('tracks new globals', function(){
  var r = checkVars('g = 1')
  assert.deepEqual(names(r.newGlobals), ['g'])
})

test('ignore locals though', function(){
  var r = checkVars([
    'var a, g',
    'g = 1'
  ].join('\n'))
  assert.deepEqual(r.newGlobals, [])
})

test('in function', function(){
  var r = checkVars([
    'function f(){',
    '  g = 1',
    '}'
  ].join('\n'))
  assert.deepEqual(names(r.newGlobals), ['g'])
})

test('in function ignore locals', function(){
  var r = checkVars([
    'function f(){',
    '  var g',
    '  g = 1',
    '}'
  ].join('\n'))
  assert.deepEqual(r.newGlobals, [])
})

test('in function but has inner function with var', function(){
  var r = checkVars([
    'function f(){',
    '  g = 1',
    '  function h(){',
    '    var g',
    '  }',
    '}'
  ].join('\n'))
  assert.deepEqual(names(r.newGlobals), ['g'])
})

test('in a parent scope', function(){
  var r = checkVars([
    'function f(){',
    '  var g',
    '  function h(){',
    '    g = 1',
    '  }',
    '}'
  ].join('\n'))
  assert.deepEqual(r.newGlobals, [])
})

test('in a function param', function(){
  var r = checkVars([
    'function f(g){',
    '  g = 1',
    '}'
  ].join('\n'))
  assert.deepEqual(r.newGlobals, [])
})

test('returns location info', function(){
  var r = checkVars([
    'function f(){',
    '  g = 1',
    '  f = 2',
    '}'
  ].join('\n'))
  assert.deepEqual(names(r.newGlobals), ['g', 'f'])
  assert.deepEqual(r.newGlobals[0].loc.start, {line: 2, column: 2})
  assert.deepEqual(r.newGlobals[1].loc.start, {line: 3, column: 2})
})


function names(arr){
  return arr.map(function(g){ return g.name })
}
var checkVars = require('./index')
var assert = require('assert')

test('tracks new globals', function(){
  var r = checkVars('g = 1')
  assert.deepEqual(r.newGlobals, ['g'])
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
  assert.deepEqual(r.newGlobals, ['g'])
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
  assert.deepEqual(r.newGlobals, ['g'])
})


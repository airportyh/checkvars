#! /usr/bin/env node

var fs = require('fs')
var filepath = process.argv[2]
var checkVars = require('./index')


fs.readFile(filepath, function(err, data){
  if (err) return console.error(err.message)
  var results = checkVars('' + data)

  if (results.newGlobals.length > 0){
    console.log("Possible accidental global variables:", 
      results.newGlobals.map(function(g){
        return "'" + g + "'"
      }).join(', '))
  }
})
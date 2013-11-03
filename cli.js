#! /usr/bin/env node

require('colors')
var fs = require('fs')
var filepath = process.argv[2]
var checkVars = require('./index')


fs.readFile(filepath, function(err, data){
  if (err) return console.error(err.message)
  var results = checkVars('' + data)

  if (results.newGlobals.length > 0){
    console.log("Possible accidental global variables:")

    console.log(results.newGlobals.map(function(g){
      return "  " + g.name.green + " on " + ("line " + g.loc.start.line + ", column " + g.loc.start.column).cyan
    }).join('\n'))
  }
})
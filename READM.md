Checkvars
=========

Checkvars is a simple static analysis tool to check your Javascripts for accidental globals and unused variables.

## Install

Install via `npm install checkvars`

## CLI Usage

    checkvars myscript.js

## API

```js
var checkVars = require('checkvars')

var results = checkVars(sourceCode)

console.log(results.newGlobals) // accidental globals introduced
```
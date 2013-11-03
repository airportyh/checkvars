var falafel = require('falafel')

module.exports = function checkVars(code){
  newGlobals = []
  falafel(code, {loc: true}, function(node){
    if (node.type === 'AssignmentExpression' && node.left.type === 'Identifier'){
      var func = parentFunction(node)
      var vars = varsDeclared(func.body)
      var idNode = node.left
      if (!vars[idNode.name]){
        //console.log(node)
        newGlobals.push({name: idNode.name, loc: idNode.loc})
      }
    }
  })
  return {
    newGlobals: newGlobals
  }
}

function parentFunction(node){
  var next = node;
  while(next.parent && next.type !== 'FunctionExpression' &&
    next.type !== 'FunctionDeclaration'){
    next = next.parent;
  }
  return next;
}

function varsDeclared(funNode){
  var vars = []
  walk(funNode, function(node){
    if (node.type === 'VariableDeclaration'){
      vars.push(node)
    }
    if (node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression'){
      return false
    }
  })
  var map = {}
  vars.forEach(function(vr){
    vr.declarations.forEach(function(dcl){
      map[dcl.id.name] = true
    })
  })
  return map
}

// Stolen from falafel
function walk (node, fun) {
    if (!node) return
    if (false === fun(node)) return
    Object.keys(node).forEach(function (key) {
        if (key === 'parent') return;
        
        var child = node[key];
        if (Array.isArray(child)) {
            child.forEach(function (c) {
                if (c && typeof c.type === 'string') {
                    walk(c, fun);
                }
            });
        }
        else if (child && typeof child.type === 'string') {
            walk(child, fun);
        }
    });
}
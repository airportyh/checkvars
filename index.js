var falafel = require('falafel')

module.exports = function checkVars(code){
  newGlobals = []
  falafel(code, {loc: true}, function(node){
    if (node.type === 'AssignmentExpression' && node.left.type === 'Identifier'){
      var idNode = node.left
      var varname = idNode.name
      if (!isVarDeclared(varname, node)){
        newGlobals.push({name: idNode.name, loc: idNode.loc})
      }
    }
  })
  return {
    newGlobals: newGlobals
  }
}

function parentFunction(node){
  var next = node.parent
  while(next &&
    next.parent &&
    next.type !== 'FunctionExpression' &&
    next.type !== 'FunctionDeclaration'){
    next = next.parent;
  }
  return next;
}

function varsDeclared(funNode){
  var vars = []
  var map = {}
  if (funNode.params){
    funNode.params.forEach(function(param){
      map[param.name] = true
    })
  }
  walk(funNode.body, function(node){
    if (node.type === 'VariableDeclaration'){
      vars.push(node)
    }
    if (node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression'){
      return false
    }
  })
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

function isVarDeclared(varname, node){
  var func = parentFunction(node)
  while (func){
    var vars = varsDeclared(func)
    if (varname in vars) return true
    func = parentFunction(func)
  }
  return false
}
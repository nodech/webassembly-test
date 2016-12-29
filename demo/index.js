if (typeof WebAssembly == "undefined") {
  alert('Your browser doesn\'t support WebAssembly')
}

var importObject = {
  mem : new WebAssembly.Memory({ init : 10, max : 100 })
}

fetch('./test.wasm').then(response => response.arrayBuffer())
.then(bytes => instantiate(bytes, importObject))
.then(instance => {
  console.log(instance.exports.test())
})

function instantiate(bytes, imports) {
  let compiled = WebAssembly.compile(bytes)

  console.log('compiled')
  return compiled.then(m => new WebAssembly.Instance(m, imports))
}

if (typeof WebAssembly == "undefined") {
  alert('Your browser doesn\'t support WebAssembly')
}

var importObject = { imports: { } };

fetch('./test.wasm').then(response => response.arrayBuffer())
.then(bytes => instantiate(bytes, importObject))
.then(instance => {
  console.log(instance.exports.test());
})

function instantiate(bytes, imports) {
  let compiled = WebAssembly.compile(bytes);

  console.log('compiled: ', compiled)
  return compiled.then(m => new WebAssembly.Instance(m, imports));
}

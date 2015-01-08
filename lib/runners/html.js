define(function() {
  function run(group, bite) {
    var content = bite.session.getValue();
    
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;

    resultDocument.body.innerHTML = '';

    if (content) {
      window.setTimeout(function() {
        resultDocument.body.innerHTML += bite.session.getValue();
      }, 20);
    }
  }

  return run;
});
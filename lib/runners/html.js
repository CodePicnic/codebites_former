define(function() {
  function run(group, bite) {
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;
    
    resultDocument.body.innerHTML = bite.session.getValue();
  }

  return run;
});
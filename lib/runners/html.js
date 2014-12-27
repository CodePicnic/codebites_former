define(function() {
  function run(group, bite) {
    var content = bite.session.getValue();

    if (content) {
      var result = group.container.querySelector('.bite-container-result'),
          resultDocument = result.contentDocument;
      
      resultDocument.body.innerHTML = bite.session.getValue();
    }
  }

  return run;
});
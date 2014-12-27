define(function() {
  function run(group, bite) {
    var content = bite.session.getValue();
    
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;

    resultDocument.body.innerHTML = '';

    require(group.libraries, function() {
      for (var i = 0; i < group.libraries.length; i++) {
        var library = group.libraries[i],
            scriptTag = resultDocument.createElement('script');
        
        scriptTag.src = library;
        resultDocument.body.appendChild(scriptTag);
      }

      if (content) {
        window.setTimeout(function() {
          resultDocument.body.innerHTML += bite.session.getValue();
        }, 20);
      }
    });
  }

  return run;
});
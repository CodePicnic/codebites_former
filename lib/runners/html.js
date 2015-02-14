define(function() {
  function loadScript(resultDocument, libraries, index, finalCallback) {
    var library = libraries[index];

    var scriptTag = resultDocument.createElement('script');

    if (library.indexOf('maps.google.com/maps/api/js') > -1) {
      library = library + '&callback=focus';
    }

    window.top.console.log('Loading ' + library);

    if (libraries[index + 1]) {
      scriptTag.onload = function() {
        window.top.console.log('Loaded: ' + library);
        
        loadScript(resultDocument, libraries, index + 1, finalCallback);
      };
    }
    else {
      scriptTag.onload = function() {
        window.top.console.log('Loaded: ' + library);
        finalCallback();
      };
    }

    scriptTag.src = library;

    resultDocument.body.appendChild(scriptTag);
  }

  function clearExternalScripts(resultDocument) {
    var scriptsTags = resultDocument.querySelectorAll('script[src]'),
        scripts = [];

    for (var i = 0; i < scriptsTags.length; i++) {
      var scriptTag = scriptsTags[i];
      
      scriptTag.parentElement.removeChild(scriptTag);
      
      scripts.push(scriptTag.src);
    }

    return scripts;
  }

  function run(group, bite) {
    var content = bite.session.getValue();
    
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;

    resultDocument.body.innerHTML = '';

    if (content) {
      window.setTimeout(function() {
        resultDocument.body.innerHTML += bite.session.getValue();

        var scripts = clearExternalScripts();

        loadScript(resultDocument, scripts, 0, function() {
          if (resultDocument.body.innerHTML.trim() === '') {
            result.style.display = 'none';
          }
          else {
            result.style.display = 'block';
          }
        });
      }, 0);
    }
  }

  return run;
});
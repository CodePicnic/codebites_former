define(function() {
  function loadScript(resultDocument, libraries, index, finalCallback) {
    var library = libraries[index];
    var scriptTag = resultDocument.createElement('script');

    window.top.console.log('Loading ' + library);

    if (libraries[index + 1]) {
      scriptTag.onload = function() {
        window.top.console.log('Loaded: ' + library);
        window.top.console.log(resultDocument, libraries, index + 1, finalCallback);
        
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

  function run(group, bite) {
    var content = bite.session.getValue();

    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;

    loadScript(resultDocument, group.libraries, 0, function() {
      if (content) {
        window.setTimeout(function() {
          var scriptTag = resultDocument.createElement('script');
          
          scriptTag.innerHTML = 'try { ' + content + ' }catch(e){ console.error(e.name + ": " + e.message); }';
          
          resultDocument.body.appendChild(scriptTag);
        }, 50);
      }
    });
  }

  return run;
});
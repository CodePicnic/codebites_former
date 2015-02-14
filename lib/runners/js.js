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

  function afterLoad(resultDocument, content) {
    if (content) {
      window.setTimeout(function() {
        var container = resultDocument.defaultView.frameElement.parentElement.parentElement,
            logPanel = container.querySelector('.bite-container-log'),
            resultFrame = resultDocument.defaultView.frameElement,
            logLines = logPanel.children;

        for (var i = 0; i < logLines.length; i++) {
          var logLine = logLines[i];

          logLine.classList.add('old');
        }

        var scriptTag = resultDocument.createElement('script');
        
        scriptTag.innerHTML = 'try { ' + content + ' }catch(e){ console.error(e.name + ": " + e.message); }';
        
        resultDocument.body.appendChild(scriptTag);

        var html = resultDocument.body.innerHTML,
            scripts = resultDocument.body.querySelectorAll('script');

        for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i].outerHTML;

          html = html.replace(script, '');
        }

        console.log(html);

        if (html.trim() === '') {
          resultFrame.parentElement.style.display = 'none';
          logPanel.classList.add('full');
        }
        else {
          resultFrame.parentElement.style.display = 'block';
          logPanel.classList.remove('full');
        }

        // if (logPanel.children.length === 0) {
        //   logPanel.style.display = 'none';
        //   resultFrame.classList.add('full');

        //   if (container.querySelector('.clear-bite')) {
        //     container.querySelector('.clear-bite').classList.add('conditional-hidden');
        //   }
        // }
        // else {
        //   logPanel.style.display = 'block';
        //   resultFrame.classList.remove('full');

        //   if (container.querySelector('.clear-bite')) {
        //     container.querySelector('.clear-bite').classList.remove('conditional-hidden');
        //   }
        // }

        logPanel.scrollTop = logPanel.scrollHeight;
      }, 50);
    }
  }

  function run(group, bite) {
    var content = bite.session.getValue();

    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;

    if (group.libraries.length > 0) {
      loadScript(resultDocument, group.libraries, 0, function() {
        afterLoad(resultDocument, content);
      });
    }
    else {
      afterLoad(resultDocument, content);
    }
  }

  return run;
});
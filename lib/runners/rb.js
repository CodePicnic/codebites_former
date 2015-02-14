define([], function() {
  function run(group, bite) {
    var content = bite.session.getValue();

    if (content) {
      var result = group.container.querySelector('.bite-container-result'),
          resultDocument = result.contentDocument,
          resultWindow = result.contentWindow,
          scriptTagOpal = resultDocument.createElement('script'),
          scriptTagOpalParser = resultDocument.createElement('script'),
          scriptTag = resultDocument.createElement('script');

      scriptTagOpal.src = 'lib/runners/opal.min.js';
      resultDocument.head.appendChild(scriptTagOpal);

      scriptTagOpal.addEventListener('load', function() {
        scriptTagOpalParser.src = 'lib/runners/opal-parser.min.js';
        resultDocument.head.appendChild(scriptTagOpalParser);

        scriptTagOpalParser.addEventListener('load', function() {
          resultWindow.Opal.top.$puts = resultWindow.console.log;

          scriptTag.innerHTML = 'try { ' + resultWindow.Opal.compile(content) + ' }catch(e){ console.log(e.name + ": " + e.message); window.top.console.error(e) }';
          
          resultDocument.body.appendChild(scriptTag);
        });
      });
    }
  }

  return run;
});
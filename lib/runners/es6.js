define([], function() {
  function run(group, bite) {
    var content = bite.session.getValue();

    if (content) {
      var result = group.container.querySelector('.bite-container-result'),
          resultDocument = result.contentDocument,
          resultWindow = result.contentWindow,
          scriptTagES6 = resultDocument.createElement('script'),
          scriptTag = resultDocument.createElement('script');

      scriptTagES6.src = 'lib/runners/6to5.js';
      resultDocument.head.appendChild(scriptTagES6);

      scriptTagES6.addEventListener('load', function() {
        scriptTag.innerHTML = 'try { ' + resultWindow.to5.transform(content).code + ' }catch(e){ console.log(e.name + ": " + e.message); window.top.console.error(e) }';
        
        resultDocument.body.appendChild(scriptTag);
      });
    }
  }

  return run;
});
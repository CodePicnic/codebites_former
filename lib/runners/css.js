define(function() {
  function run(group, bite) {
    var content = bite.session.getValue();

    if (content) {
      var result = group.container.querySelector('.bite-container-result'),
          resultDocument = result.contentDocument,
          styleTag = resultDocument.createElement('style');
      
      styleTag.setAttribute('type', 'text/css');
      styleTag.innerHTML = bite.session.getValue();
      
      resultDocument.head.appendChild(styleTag);
    }
  }

  return run;
});
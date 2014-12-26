define(function() {
  function run(group, bite) {
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument,
        styleTag = resultDocument.createElement('style');
    
    style.setAttribute('type', 'text/css');
    style.innerHTML = bite.session.getValue();
    
    resultDocument.head.appendChild(styleTag);
  }

  return run;
});
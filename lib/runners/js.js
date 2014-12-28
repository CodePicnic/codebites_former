define(function() {
  function run(group, bite) {
    var content = bite.session.getValue();

    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;

    if (content) {
      window.setTimeout(function() {
        var scriptTag = resultDocument.createElement('script');
        
        scriptTag.innerHTML = 'try { ' + content + ' }catch(e){ console.error(e.name + ": " + e.message); }';
        
        resultDocument.body.appendChild(scriptTag);
      }, 50);
    }
  }

  return run;
});
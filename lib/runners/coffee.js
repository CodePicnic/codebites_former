define([
  'runners/coffee-script'], function(CoffeeScript) {
  function run(group, bite) {
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument,
        scriptTag = resultDocument.createElement('script');

    result.contentWindow.Opal = Opal;
    
    scriptTag.innerHTML = 'try { ' + CoffeeScript.compile(bite.session.getValue()) + ' }catch(e){ console.error(e.name + ": " + e.message); }';
    
    resultDocument.body.appendChild(scriptTag);
  }

  return run;
});
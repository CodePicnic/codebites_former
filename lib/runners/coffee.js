define([
  'runners/coffee-script'], function(CoffeeScript) {
  function run(group, bite) {
    var content = bite.session.getValue();

    if (content) {
      var result = group.container.querySelector('.bite-container-result'),
          resultDocument = result.contentDocument,
          scriptTag = resultDocument.createElement('script');

      scriptTag.innerHTML = 'try { ' + CoffeeScript.compile(bite.session.getValue()) + ' }catch(e){ console.error(e.name + ": " + e.message); }';
      
      resultDocument.body.appendChild(scriptTag);
    }
  }

  return run;
});
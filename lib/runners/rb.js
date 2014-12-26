define([
  'http://cdn.opalrb.org/opal/current/opal.min.js',
  'http://cdn.opalrb.org/opal/current/opal-parser.min.js'], function() {
  function run(group, bite) {
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument,
        scriptTag = resultDocument.createElement('script');

    result.contentWindow.Opal = Opal;
    
    scriptTag.innerHTML = 'try { ' + Opal.compile(bite.session.getValue()) + ' }catch(e){ console.error(e.name + ": " + e.message); }';
    
    resultDocument.body.appendChild(scriptTag);
  }

  return run;
});
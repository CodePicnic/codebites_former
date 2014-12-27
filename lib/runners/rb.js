define([
  'runners/opal.min',
  'runners/opal-parser.min'], function() {
  function run(group, bite) {
    var content = bite.session.getValue();

    if (content) {
      var result = group.container.querySelector('.bite-container-result'),
          resultDocument = result.contentDocument,
          scriptTag = resultDocument.createElement('script');

      result.contentWindow.Opal = Opal;
      
      scriptTag.innerHTML = 'try { ' + Opal.compile(content) + ' }catch(e){ console.error(e.name + ": " + e.message); }';
      
      resultDocument.body.appendChild(scriptTag);
    }
  }

  return run;
});
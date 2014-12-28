define('runner', function(require) {
  function runBite(group) {
    var editor = group.container.querySelector('.bite-container-editor'),
        result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument;

    editor.style.display = 'none';
    result.style.display = 'block';

    var runners = [];

    for (var i = 0; i < group.bites.length; i++) {
      var bite = group.bites[i];

      runners.push('runners/' + bite.lang);
    }

    require(group.libraries, function() {
      require(runners, function() {
        for (var i = 0; i < arguments.length; i++) {
          arguments[i](group, group.bites[i]);
        }
      });
    });
  }

  return {
    runBite: runBite
  }
});
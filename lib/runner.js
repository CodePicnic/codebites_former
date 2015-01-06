define('runner', function(require) {
  function runBite(group) {
    var editor = group.container.querySelector('.bite-container-editor'),
        result = group.container.querySelector('.bite-container-result'),
        resultTab = group.container.querySelector('#bite-result'),
        resultDocument = result.contentDocument;

    resultTab.click();

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

        var runEvent = new CustomEvent('bite:run', { detail: { group: group } });

        window.dispatchEvent(runEvent);
      });
    });
  }

  return {
    runBite: runBite
  }
});
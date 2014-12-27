define([
  'runners/sass.min'], function(Sass) {
  function run(group, bite) {
    var content = bite.session.getValue();

    if (content) {
      var result = group.container.querySelector('.bite-container-result'),
          resultDocument = result.contentDocument,
          styleTag = resultDocument.createElement('style');

      styleTag.setAttribute('type', 'text/css');

      var css = Sass.compile(content);

      if (typeof css === 'string') {
        styleTag.innerHTML = css;
      }

      resultDocument.head.appendChild(styleTag);
    }
  }

  return run;
});
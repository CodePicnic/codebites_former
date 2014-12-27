define([
  'runners/sass.min'], function(Sass) {
  function run(group, bite) {
    var result = group.container.querySelector('.bite-container-result'),
        resultDocument = result.contentDocument,
        styleTag = resultDocument.createElement('style');

    styleTag.setAttribute('type', 'text/css');

    var css = Sass.compile(bite.session.getValue());

    if (typeof css === 'string') {
      styleTag.innerHTML = css;
    }

    resultDocument.head.appendChild(styleTag);
  }

  return run;
});
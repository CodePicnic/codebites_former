require(['groups'], function(Groups) {
  var Bite = {},
      groups = {};

  function initBites() {
    var preTags = document.querySelectorAll('pre');

    for (var i = 0; i < preTags.length; i++) {
      var preTag = preTags[i],
          bite = {},
          groupName = preTag.dataset['group'] || 'bite-' + Date.now(),
          libraries = [];

      if (preTag.dataset['libs']) {
        libraries = preTag.dataset['libs'].split(';');
      }

      groups[groupName] = groups[groupName] || { name: groupName, bites: [], libraries: [] };

      bite.lang = preTag.dataset['lang'] || 'js';
      bite.name = preTag.dataset['name'];
      bite.preTag = preTag;
      bite.groupName = groupName;

      groups[groupName].bites.push(bite);
      groups[groupName].libraries = groups[groupName].libraries.concat(libraries);

      preTag.style.display = 'none';
    }

    var groupNames = Object.keys(groups);

    for (var i = 0; i < groupNames.length; i++) {
      var groupName = groupNames[i];

      Groups.initGroup(groups[groupName]);
    }
  }

  Bite.init = initBites;
  Bite.groups = groups;

  Bite.init();

  window.Bite = Bite;
});
require(['groups'], function(Groups) {
  var Bite = {},
      groups = {};

  function initBites() {
    var preTags = document.querySelectorAll('pre');

    for (var i = 0; i < preTags.length; i++) {
      var preTag = preTags[i],
          bite = {},
          groupName = preTag.dataset['group'] || 'bite-' + Date.now();

      groups[groupName] = groups[groupName] || { name: groupName, bites: [] };

      bite.lang = preTag.dataset['lang'] || 'js';
      bite.preTag = preTag;
      bite.groupName = groupName;

      groups[groupName].bites.push(bite);

      preTag.style.display = 'none';
    }

    var groupNames = Object.keys(groups);

    for (var i = 0; i < groupNames.length; i++) {
      var groupName = groupNames[i];

      Groups.initGroup(groups[groupName]);
    }
  }

  Bite.init = initBites;

  Bite.init();
});
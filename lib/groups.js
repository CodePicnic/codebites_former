define('groups', ['ui', 'lang_mappings', 'api'], function(UI, LangMappings, API) {
  function initGroup(group) {
    group.container = UI.buildUI(group);
    group.editor = UI.buildEditor(group);

    UI.bindEvents(group);

    var apiMethods = Object.keys(API);

    for (var i = 0; i < apiMethods.length; i++) {
      var apiMethod = apiMethods[i];
      
      group[apiMethod] = API[apiMethod];
    }

    var readyEvent = new CustomEvent('bite:ready', { detail: { group: group } });
    
    window.dispatchEvent(readyEvent);
  }

  return {
    initGroup: initGroup
  };
});
define('ui', ['lang_mappings'], function(LangMappings) {
  function buildUI(group) {
    var fragment = document.createDocumentFragment(),
        fragmentRoot = document.createElement('div');

    fragmentRoot.className = 'bite-container';
    fragmentRoot.id = 'bite-container-' + group.name;
    fragmentRoot.innerHTML = '<nav class="bite-container-tabs"></nav>';
    fragmentRoot.innerHTML += '<section class="bite-container-editor"></section>';
    fragmentRoot.innerHTML += '<iframe class="bite-container-result"></iframe>';
    fragmentRoot.innerHTML += '<ul class="bite-container-log"></ul>';
    
    var tabs = fragmentRoot.querySelector('.bite-container-tabs');

    for (var i = 0; i < group.bites.length; i++) {
      var bite = group.bites[i],
          biteMode = LangMappings[bite.lang] || bite.lang;
      
      tabs.innerHTML += '<a href="#" class="bite-container-tab" data-mode="' + biteMode + '">' + biteMode + '</a>';
    }

    // tabs.innerHTML += '<a href="#" class="bite-container-tab" id="bite-add">+</a>';
    tabs.innerHTML += '<a href="#" class="bite-container-tab" id="bite-result">Result</a>';
    // tabs.innerHTML += '<a href="#" class="bite-container-button right" id="bite-clear">Clear console</a>';
    tabs.innerHTML += '<a href="#" class="bite-container-button right" id="bite-run">Run</a>';
    // tabs.innerHTML += '<label for="live" class="right" id="bite-live"><input type="checkbox" id="live"> Live preview?</label>';

    fragment.appendChild(fragmentRoot);

    var container = fragment.firstChild.cloneNode(true);

    var firstBite = group.bites[0],
        firstBitePreTag = firstBite.preTag,
        firstBitePreTagParent = firstBitePreTag.parentElement;

    firstBitePreTagParent.insertBefore(container, firstBitePreTag);

    fragment = null;

    return container;
  }

  function buildEditor(group) {
    var firstBite = group.bites[0];

    var editor = group.container.querySelector('.bite-container-editor'),
        aceEditor = ace.edit(editor);

    aceEditor.setTheme('ace/theme/monokai');
    aceEditor.setOptions({ enableBasicAutocompletion: true });
    aceEditor.setShowPrintMargin(false);

    aceEditor.on('change', function(change) {
      var changeEvent = new Event('bite:change');

      window.dispatchEvent(changeEvent);
    });

    EditSession = window.ace.require('ace/edit_session').EditSession;

    for (var i = 0; i < group.bites.length; i++) {
      var bite = group.bites[i];

      bite.session = new EditSession(bite.preTag.textContent, 'ace/mode/' + (LangMappings[bite.lang] || bite.lang));
      bite.session.setTabSize(2);
      bite.session.setUseSoftTabs(true);
      bite.session.setValue(bite.preTag.textContent || '');
    }

    aceEditor.setSession(firstBite.session);

    return aceEditor;
  }

  return {
    buildUI: buildUI,
    buildEditor: buildEditor
  };
});
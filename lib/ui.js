define('ui', ['lang_mappings'], function(LangMappings) {
  function buildModesList() {
    var listContent = '',
        modes = [
          'html',
          'css',
          'js',
          'coffee',
          'sass',
          'rb'
        ];

    for (var i = 0; i < modes.length; i++) {
      var mode = modes[i];

      listContent += '<li data-mode="' + mode + '">' + LangMappings.labels[mode] + '</li>';
    }

    return listContent;
  }

  function addTab(tabs, bite) {
    var biteMode = LangMappings.mappings[bite.lang] || bite.lang;

    tabs.innerHTML += '<a href="#" class="bite-container-tab" data-mode="' + biteMode + '">' + LangMappings.labels[bite.lang] + '</a>';
  }

  function addSession(EditSession, bite) {
    bite.session = new EditSession(bite.preTag.textContent, 'ace/mode/' + (LangMappings.mappings[bite.lang] || bite.lang));
    bite.session.setTabSize(2);
    bite.session.setUseSoftTabs(true);
    bite.session.setValue(bite.preTag.textContent || '');
  }

  function addBite(group, mode) {
    var bite = {},
        preTag = document.createElement('pre');

    preTag.dataset['lang'] = mode;
    preTag.dataset['group'] = group.name;
    preTag.style.display = 'none';

    bite.lang = mode;
    bite.preTag = preTag;
    bite.groupName = group.name;

    group.bites.push(bite);
    group.container.parentElement.appendChild(preTag);

    addTab(group.container.querySelector('.bite-container-tabs'), bite);
    addSession(window.ace.require('ace/edit_session').EditSession, bite);
  }

  function buildUI(group) {
    var fragment = document.createDocumentFragment(),
        fragmentRoot = document.createElement('div');

    fragmentRoot.className = 'bite-container';
    fragmentRoot.id = 'bite-container-' + group.name;
    fragmentRoot.innerHTML = '<nav class="bite-container-tabs"></nav>';
    fragmentRoot.innerHTML += '<section class="bite-container-editor"></section>';
    fragmentRoot.innerHTML += '<iframe class="bite-container-result"></iframe>';
    fragmentRoot.innerHTML += '<ul class="bite-container-log"></ul>';
    fragmentRoot.innerHTML += '<ul class="bite-container-modes-list">' + buildModesList() + '</ul>';
    
    var tabs = fragmentRoot.querySelector('.bite-container-tabs');

    for (var i = 0; i < group.bites.length; i++) {
      addTab(tabs, group.bites[i]);
    }

    tabs.innerHTML += '<a href="#" class="bite-container-tab right" id="bite-result">Result</a>';
    // tabs.innerHTML += '<a href="#" class="bite-container-button right" id="bite-clear">Clear console</a>';
    tabs.innerHTML += '<a href="#" class="bite-container-button right" id="bite-run">Run</a>';
    // tabs.innerHTML += '<label for="live" class="right" id="bite-live"><input type="checkbox" id="live"> Live preview?</label>';
    tabs.innerHTML += '<a href="#" class="bite-container-tab right" id="bite-add">+</a>';

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

      addSession(EditSession, bite);
    }

    aceEditor.setSession(firstBite.session);

    return aceEditor;
  }

  return {
    addTab: addTab,
    addSession: addSession,
    addBite: addBite,
    buildUI: buildUI,
    buildEditor: buildEditor
  };
});
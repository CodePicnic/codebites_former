define('ui', ['lang_mappings', 'console', 'runner'], function(LangMappings, Console, BiteRunner) {
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

  function buildLibrariesList() {
    var listContent = '',
        libraries = {
          'jQuery 2.1.3': 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
          'jQuery 2.1.1': 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
          'jQuery 2.1.0': 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js',
          'jQuery 2.0.3': 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js',
          'jQuery 2.0.2': 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js',
          'jQuery 2.0.1': 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.1/jquery.min.js',
          'jQuery 2.0.0': 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js',
          'jQuery 1.11.2': 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
          'jQuery 1.11.1': 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
          'jQuery 1.11.0': 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js',
          'jQuery 1.10.2': 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
          'jQuery 1.10.1': 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js',
          'jQuery 1.10.0': 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.0/jquery.min.js',
          'jQuery 1.9.1': 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
          'Prototype 1.7.2.0': 'http://ajax.googleapis.com/ajax/libs/prototype/1.7.2.0/prototype.js',
          'Prototype 1.7.1.0': 'http://ajax.googleapis.com/ajax/libs/prototype/1.7.1.0/prototype.js',
          'Prototype 1.7.0.0': 'http://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js',
          'Prototype 1.6.1.0': 'http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js',
          'Prototype 1.6.0.3': 'http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js',
          'Prototype 1.6.0.2': 'http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.2/prototype.js',
          'React 0.12.2': 'http://facebook.github.io/react/js/react.js',
          'React with Add-Ons 0.12.2': 'http://fb.me/react-with-addons-0.12.2.js',
          'React JSX Transformer 0.12.2': 'http://fb.me/JSXTransformer-0.12.2.js',
          'three.js r69': 'http://ajax.googleapis.com/ajax/libs/threejs/r69/three.min.js',
          'three.js r68': 'http://ajax.googleapis.com/ajax/libs/threejs/r68/three.min.js',
          'three.js r67': 'http://ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js',
          'Underscore.js 1.7.0': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js',
          'Underscore.js 1.6.0': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js',
          'Underscore.js 1.5.2': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js',
          'Underscore.js 1.5.1': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min.js',
          'Underscore.js 1.5.0': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.0/underscore-min.js',
          'Underscore.js 1.4.4': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
          'Underscore.js 1.4.3': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min.js',
          'Zepto 1.1.4': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.4/zepto.min.js',
          'Zepto 1.1.3': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.3/zepto.min.js',
          'Zepto 1.1.2': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.2/zepto.min.js',
          'Zepto 1.1.1': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.1.1/zepto.min.js',
          'Zepto 1.0': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js',
          'Zepto 0.8': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/0.8/zepto.min.js',
          'Zepto 0.7': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/0.7/zepto.min.js',
          'Zepto 0.6': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/0.6/zepto.min.js'
        },
        librariesNames = Object.keys(libraries);

    for (var i = 0; i < librariesNames.length; i++) {
      var libraryName = librariesNames[i],
          library = libraries[libraryName];

      listContent += '<li data-library="' + library + '">' + libraryName + '</li>';
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

    var addSessionEvent = new CustomEvent('bite:addsession', { detail: { group: group, bite: bite } });

    window.dispatchEvent(addSessionEvent);
  }

  function addLibrary(group, library) {
    group.libraries.push(library);

    var addLibraryEvent = new CustomEvent('bite:addlibrary', { detail: { group: group, library: library } });

    window.dispatchEvent(addLibraryEvent);
  }

  function buildUI(group) {
    var fragment = document.createDocumentFragment(),
        fragmentRoot = document.createElement('div');

    fragmentRoot.className = 'bite-container';
    fragmentRoot.id = 'bite-container-' + group.name;

    var fragmentRootHTML = '<nav class="bite-container-tabs"></nav>';
    fragmentRootHTML += '<section class="bite-container-editor"></section>';
    fragmentRootHTML += '<iframe class="bite-container-result"></iframe>';
    fragmentRootHTML += '<ul class="bite-container-log"></ul>';
    fragmentRootHTML += '<section class="bite-modal-overlay bite-container-add">';
    fragmentRootHTML += '<ul class="bite-container-modes-list">' + buildModesList() + '</ul>';
    fragmentRootHTML += '<ul class="bite-container-libraries-list">' + buildLibrariesList() + '</ul>';
    fragmentRootHTML += '</section>';

    fragmentRoot.innerHTML = fragmentRootHTML;
    
    var tabs = fragmentRoot.querySelector('.bite-container-tabs');

    for (var i = 0; i < group.bites.length; i++) {
      addTab(tabs, group.bites[i]);
    }

    tabs.innerHTML += '<a href="#" class="bite-container-tab right" id="bite-result">Result</a>';
    tabs.innerHTML += '<a href="#" class="bite-container-button right" id="bite-clear">Clear console</a>';
    tabs.innerHTML += '<a href="#" class="bite-container-button right" id="bite-run">Run</a>';
    tabs.innerHTML += '<label for="live" class="right" id="bite-live"><input type="checkbox" id="live"> Live preview?</label>';
    tabs.innerHTML += '<a href="#" class="bite-container-tab right" id="bite-add">+</a>';

    fragment.appendChild(fragmentRoot);

    var container = fragment.firstChild.cloneNode(true);

    var firstBite = group.bites[0],
        firstBitePreTag = firstBite.preTag,
        firstBitePreTagParent = firstBitePreTag.parentElement;

    firstBitePreTagParent.insertBefore(container, firstBitePreTag);

    var iframe = container.querySelector('iframe'),
        logPanel = container.querySelector('.bite-container-log');

    var consoleMethods = Object.keys(Console);

    for (var i = 0; i < consoleMethods.length; i++) {
      var consoleMethod = consoleMethods[i];

      iframe.contentWindow.console[consoleMethod] = function() {
        var logLine = document.createElement('li'),
            logLineContent = Console[consoleMethod].apply(iframe.contentWindow, arguments);
        
        logLine.innerHTML = logLineContent;
        logPanel.appendChild(logLine);

        return logLineContent;
      };
    }

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
      var changeEvent = new CustomEvent('bite:change', { detail: { group: group } });

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

  function bindEvents(group) {
    var editor = group.container.querySelector('.bite-container-editor'),
        result = group.container.querySelector('.bite-container-result'),
        tabs = group.container.querySelector('.bite-container-tabs'),
        liveCheck = group.container.querySelector('#live'),
        logPanel = group.container.querySelector('.bite-container-log'),
        addPanel = group.container.querySelector('.bite-container-add'),
        librariesList = group.container.querySelector('.bite-container-libraries-list'),
        modesList = group.container.querySelector('.bite-container-modes-list');

    tabs.children[0].classList.add('active');

    tabs.addEventListener('click', function(e) {
      if (e.target.classList.contains('bite-container-tab')) {
        e.preventDefault();

        switch(e.target.id) {
          case 'bite-add':
            addPanel.style.display = addPanel.style.display === 'block' ? 'none' : 'block';
          break;
          case 'bite-result':
            if (liveCheck.checked) {
              editor.style.display = null;
              result.style.display = null;
              logPanel.style.display = null;
            }
            else {
              editor.style.display = 'none';
              result.style.display = 'block';
              logPanel.style.display = 'block';
            }

            var otherTabs = e.target.parentElement.querySelectorAll('.bite-container-tab');

            for (var i = 0; i < otherTabs.length; i++) {
              otherTabs[i].classList.remove('active');
            }

            e.target.classList.add('active');
          break;
          default:
            var lang = e.target.dataset['mode'],
                bite = group.bites.filter(function(bite) { return lang === (LangMappings.mappings[bite.lang] || bite.lang); })[0];

            if (bite) {
              editor.style.display = 'block';
              result.style.display = 'none';
              logPanel.style.display = 'none';

              group.editor.setSession(bite.session);
              
              var otherTabs = e.target.parentElement.querySelectorAll('.bite-container-tab');

              for (var i = 0; i < otherTabs.length; i++) {
                otherTabs[i].classList.remove('active');
              }

              e.target.classList.add('active');

              var changeSessionEvent = new CustomEvent('bite:changesession', { detail: { group: group, bite: bite } });

              window.dispatchEvent(changeSessionEvent);
            }
          break;
        }
      }
      else if (e.target.classList.contains('bite-container-button')) {
        e.preventDefault();

        switch(e.target.id) {
          case 'bite-clear':
            logPanel.innerHTML = '';
          break;
          case 'bite-run':
            BiteRunner.runBite(group);
          break;
        }
      }
    });

    liveCheck.addEventListener('change', function(e) {
      editor.style.display = null;
      result.style.display = null;
      logPanel.style.display = null;

      if (e.target.checked) {
        group.container.classList.add('with-live-preview');
      }
      else {
        group.container.classList.remove('with-live-preview');
      }
    });

    logPanel.addEventListener('click', function(e) {
      e.preventDefault();

      var target = e.target,
          targetSibling = target.nextElementSibling;

      if (target.tagName === 'DT' && targetSibling.querySelector('dl')) {
        var dl = targetSibling.querySelector('dl');
        dl.style.display = (dl.style.display === 'none') ? 'block' : 'none';
      }
    });

    librariesList.addEventListener('click', function(e) {
      UI.addLibrary(group, e.target.dataset['library']);

      addPanel.style.display = 'none';
    });

    modesList.addEventListener('click', function(e) {
      UI.addBite(group, e.target.dataset['mode']);

      addPanel.style.display = 'none';
    });
  }

  return {
    addTab: addTab,
    addSession: addSession,
    addBite: addBite,
    addLibrary: addLibrary,
    buildUI: buildUI,
    buildEditor: buildEditor,
    bindEvents: bindEvents
  };
});
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

  function appendLibrariesList(list) {
    require(['libraries'], function(libraries) {
      var listContent = '',
          librariesNames = Object.keys(libraries);

      for (var i = 0; i < librariesNames.length; i++) {
        var libraryName = librariesNames[i],
            libraryGroup = libraries[libraryName],
            libraryVersions = Object.keys(libraryGroup);

        listContent += '<li>' + libraryName + '<ul>';

        for (var j = 0; j < libraryVersions.length; j++) {
          var libraryVersion = libraryVersions[j],
              libraryPath = libraryGroup[libraryVersion];

          listContent += '<li data-library="' + libraryPath + '">' + libraryVersion + '</li>';
        }

        listContent += '</ul></li>';
      }

      list.innerHTML = listContent;
    });
  }

  function addTab(tabs, bite) {
    var biteMode = LangMappings.mappings[bite.lang] || bite.lang,
        biteName = bite.name || LangMappings.labels[bite.lang];

    var tab = document.createElement('a');

    tab.href = '#';
    tab.className = 'bite-container-tab';
    tab.dataset.mode = biteMode;

    tab.innerHTML += '<span class="bite-tab-text">' + biteName + '</span><small class="bite-container-remove-tab" title="Cerrar">✖</small>';

    tabs.appendChild(tab);

    return tab;
  }

  function addSession(EditSession, bite) {
    bite.session = new EditSession(bite.preTag.textContent, 'ace/mode/' + (LangMappings.mappings[bite.lang] || bite.lang));
    bite.session.setTabSize(2);
    bite.session.setUseSoftTabs(true);
    bite.session.setValue(bite.preTag.textContent || '');
  }

  function addBite(group, options) {
    var bite = {},
        mode = options.mode,
        content = options.content,
        name = options.name,
        preTag = document.createElement('pre'),
        tabs = group.container.querySelector('.bite-container-tabs-left');

    preTag.dataset.lang = mode;
    preTag.dataset.group = group.name;
    preTag.dataset.name = name;
    preTag.style.display = 'none';
    preTag.textContent = content;

    bite.name = name;
    bite.lang = mode;
    bite.preTag = preTag;
    bite.groupName = group.name;

    group.bites.push(bite);
    group.container.parentElement.appendChild(preTag);

    var tab = addTab(tabs, bite);
    addSession(window.ace.require('ace/edit_session').EditSession, bite);

    var addSessionEvent = new CustomEvent('bite:addsession', { detail: { group: group, bite: bite } });

    window.dispatchEvent(addSessionEvent);

    if (tab) {
      tab.click();
    }
  }

  function removeBite(group, tab) {
    var biteTabs = group.container.querySelector('.bite-container-tabs-left').querySelectorAll('.bite-container-tab[data-mode]'),
        index = Array.prototype.indexOf.call(biteTabs, tab),
        bite = group.bites[index];

    if (biteTabs.length === group.bites.length) {
      if (bite.preTag.parentNode) {
        bite.preTag.parentNode.removeChild(bite.preTag);
      }

      group.bites.splice(index, 1);

      if (tab && tab.parentNode) {
        tab.parentNode.removeChild(tab);
      }

      var removeBiteEvent = new CustomEvent('bite:removebite', { detail: { group: group, bite: bite } }),
          changeEvent = new CustomEvent('bite:change', { detail: { group: group } });

      window.dispatchEvent(removeBiteEvent);
      window.dispatchEvent(changeEvent);

      var tabsContainer = group.container.querySelector('.bite-container-tabs-left');

      if (tabsContainer.children.length > 1) {
        tabsContainer.children[1].click();
      }
      else if (group.bites.length === 0) {
        group.container.querySelector('.bite-container-tabs-left').children[0].click();
      }
    }
  }

  function addLibrary(group, library) {
    group.libraries.push(library);
    var libs = group.bites[0].preTag.dataset['libs'] || '';

    libs = libs.split(';');

    if (libs.length === 1 && libs[0] === '') {
      libs.length = 0;
    }

    libs.push(library);

    group.bites[0].preTag.dataset['libs'] = libs.join(';');

    var addLibraryEvent = new CustomEvent('bite:addlibrary', { detail: { group: group, library: library } });

    window.dispatchEvent(addLibraryEvent);
  }

  function removeLibrary(group, library) {
    group.libraries.splice(group.libraries.indexOf(library), 1);

    var removeLibraryEvent = new CustomEvent('bite:removelibrary', { detail: { group: group, library: library } });

    window.dispatchEvent(removeLibraryEvent);
  }

  function buildUI(group) {
    var fragment = document.createDocumentFragment(),
        fragmentRoot = document.createElement('section');

    fragmentRoot.className = 'bite-container';
    fragmentRoot.id = 'bite-container-' + group.name;

    var fragmentRootHTML = '';

    fragmentRootHTML += '<aside class="bite-container-sidebar-container">';
    fragmentRootHTML += '<dl class="bite-container-sidebar"></dl>';
    fragmentRootHTML += '</aside>';
    fragmentRootHTML += '<aside class="bite-container-content">';
    fragmentRootHTML += '<nav class="bite-container-tabs"><aside class="bite-container-tabs-left"></aside><aside class="bite-container-tabs-right"></aside></nav>';
    fragmentRootHTML += '<section class="bite-container-tabpages">';
    fragmentRootHTML += '<div class="bite-container-editor"></div>';
    fragmentRootHTML += '<div class="bite-container-result-container">';
    fragmentRootHTML += '<input class="bite-container-result-location-bar" type="url">';
    fragmentRootHTML += '<iframe class="bite-container-result"></iframe>';
    fragmentRootHTML += '</div>';
    fragmentRootHTML += '<ul class="bite-container-log"></ul>';
    fragmentRootHTML += '</section>';
    fragmentRootHTML += '<section class="bite-modal-overlay bite-container-add">';
    fragmentRootHTML += '<div class="bite-modal-ribbon"><strong class="bite-modal-ribbon-content"><h2>Tipo de archivo</h2></strong></div>';
    fragmentRootHTML += '<ul class="bite-container-modes-list">' + buildModesList() + '</ul>';
    fragmentRootHTML += '<ul class="bite-container-libraries-list"></ul>';
    fragmentRootHTML += '</section>';
    fragmentRootHTML += '</aside>';

    fragmentRoot.innerHTML = fragmentRootHTML;
    
    var leftTabs = fragmentRoot.querySelector('.bite-container-tabs-left'),
        rightTabs = fragmentRoot.querySelector('.bite-container-tabs-right');

    leftTabs.innerHTML += '<a href="#" class="bite-container-tab" id="bite-add">✚</a>';

    for (var i = 0; i < group.bites.length; i++) {
      addTab(leftTabs, group.bites[i]);
    }

    rightTabs.innerHTML += '<label for="live" id="bite-live"><input type="checkbox" id="live"> ¿Vista previa?</label>';
    rightTabs.innerHTML += '<a href="#" class="bite-container-button" id="bite-run" title"Ejecutar bite">Ejecutar</a>';
    rightTabs.innerHTML += '<a href="#" class="bite-container-tab" id="bite-result" title="Mostrar resultado">Resultado</a>';
    rightTabs.innerHTML += '<a href="#" class="bite-container-button" id="bite-clear" title="Limpiar consola">Limpiar</a>';

    fragment.appendChild(fragmentRoot);

    var container = fragment.firstChild.cloneNode(true);

    appendLibrariesList(container.querySelector('.bite-container-libraries-list'));

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
        liveCheck = group.container.querySelector('#live'),
        aceEditor = ace.edit(editor);

    aceEditor.setTheme('ace/theme/monokai');
    aceEditor.setOptions({ enableBasicAutocompletion: true });
    aceEditor.setShowPrintMargin(false);

    aceEditor.on('change', function(change) {
      if (liveCheck.checked) {
        if (aceEditor.getSession().getMode().$id === 'ace/mode/javascript') {
          if (aceEditor.getSession().getAnnotations().filter(function(item) { return item.type !== 'info'; }).length === 0) {
            BiteRunner.runBite(group);
          }
        }
        else {
          BiteRunner.runBite(group);
        }
      }

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
        sidebar = group.container.querySelector('.bite-container-sidebar'),
        resultContainer = group.container.querySelector('.bite-container-result-container'),
        result = group.container.querySelector('.bite-container-result'),
        tabs = group.container.querySelector('.bite-container-tabs'),
        biteTabs = tabs.querySelector('.bite-container-tabs-left').querySelectorAll('.bite-container-tab[data-mode]'),
        liveCheck = group.container.querySelector('#live'),
        logPanel = group.container.querySelector('.bite-container-log'),
        addPanel = group.container.querySelector('.bite-container-add'),
        librariesList = group.container.querySelector('.bite-container-libraries-list'),
        modesList = group.container.querySelector('.bite-container-modes-list');

    biteTabs[0].classList.add('active');

    sidebar.addEventListener('click', function(e) {
      var target = e.target;

      if (target.tagName === 'DT') {
        if (target.parentElement.classList.contains('collapsed')) {
          target.parentElement.classList.remove('collapsed');
        }
        else {
          target.parentElement.classList.add('collapsed');
        }
      }
    });

    tabs.addEventListener('dblclick', function(e) {
      e.preventDefault();

      if (biteTabs.length === group.bites.length &&
        e.target.classList.contains('bite-tab-text') &&
        e.target.parentElement.dataset.mode) {
        
        var tabName = e.target,
            index = Array.prototype.indexOf.call(biteTabs, e.target.parentElement),
            bite = group.bites[index],
            editTabName = document.createElement('input');

        tabName.style.display = 'none';
        tabName.parentElement.insertBefore(editTabName, tabName);

        editTabName.focus();

        editTabName.addEventListener('keyup', function(e) {
          if (e.keyCode === 13) {
            var newName = editTabName.value;

            if (newName.trim() !== '') {
              if (newName.match('.' + bite.lang) === null) {
                newName += '.' + bite.lang;
              }

              bite.name = newName;
              bite.preTag.dataset.name = newName;

              tabName.textContent = newName;
            }

            tabName.style.display = null;
            editTabName.parentElement.removeChild(editTabName);
          }
        });
      }
    });

    tabs.addEventListener('click', function(e) {
      var target = e.target;

      if (target.classList.contains('bite-container-tab') || target.classList.contains('bite-tab-text')) {
        e.preventDefault();

        if (target.classList.contains('bite-tab-text')) {
          target = target.parentElement;
        }

        switch(target.id) {
          case 'bite-add':
            addPanel.style.display = addPanel.style.display === 'block' ? 'none' : 'block';
            target.textContent = target.textContent === '✚' ? '✖' : '✚';
          break;
          case 'bite-result':
            var tabPages = group.container.querySelector('.bite-container-tabpages').children,
                otherTabs = tabs.querySelector('.bite-container-tabs-left').querySelectorAll('.bite-container-tab');
            
            if (liveCheck.checked) {
              for (var i = 0; i < tabPages.length; i++) {
                tabPages[i].style.display = null;
              }
            }
            else {
              for (var i = 0; i < tabPages.length; i++) {
                tabPages[i].style.display = 'none';
              }

              resultContainer.style.display = 'flex';
              logPanel.style.display = 'block';
            }

            for (var i = 0; i < otherTabs.length; i++) {
              otherTabs[i].classList.remove('active');
            }

            target.classList.add('active');
          break;
          default:
            var biteTabs = tabs.querySelector('.bite-container-tabs-left').querySelectorAll('.bite-container-tab[data-mode]'),
                otherTabs = tabs.querySelector('.bite-container-tabs-left').querySelectorAll('.bite-container-tab'),
                tabPages = group.container.querySelector('.bite-container-tabpages').children;

            var lang = target.dataset['mode'],
                index = Array.prototype.indexOf.call(biteTabs, target),
                bite = group.bites[index];

            if (group.bites.length === biteTabs.length && bite) {
              if (liveCheck.checked) {
                editor.style.display = null;
                resultContainer.style.display = null;
                logPanel.style.display = null;
              }
              else {
                for (var i = 0; i < tabPages.length; i++) {
                  tabPages[i].style.display = 'none';
                }
                
                editor.style.display = 'block';
              }

              group.editor.setSession(bite.session);
              
              for (var i = 0; i < otherTabs.length; i++) {
                otherTabs[i].classList.remove('active');
              }

              tabs.querySelector('#bite-result').classList.remove('active');

              target.classList.add('active');

              var changeSessionEvent = new CustomEvent('bite:changesession', { detail: { group: group, bite: bite } });

              window.dispatchEvent(changeSessionEvent);
            }
          break;
        }
      }
      else if (target.classList.contains('bite-container-button') || target.parentElement.classList.contains('bite-container-button')) {
        e.preventDefault();

        if (!target.classList.contains('bite-container-button') && target.parentElement.classList.contains('bite-container-button')) {
          target = target.parentElement;
        }

        switch(target.id) {
          case 'bite-clear':
            logPanel.innerHTML = '';
          break;
          case 'bite-run':
            if (group.runner) {
              group.runner.runBite(group);
            }
            else {
              BiteRunner.runBite(group);
            }
          break;
        }
      }
      else if (target.classList.contains('bite-container-remove-tab')) {
        e.preventDefault();

        removeBite(group, target.parentElement);
      }
    });

    liveCheck.addEventListener('change', function(e) {
      editor.style.display = null;
      resultContainer.style.display = null;
      logPanel.style.display = null;

      if (e.target.checked) {
        group.container.classList.add('with-live-preview');
        BiteRunner.runBite(group);
      }
      else {
        group.container.classList.remove('with-live-preview');
      }

      group.editor.resize();

      var changeSessionEvent = new CustomEvent('bite:changelivepreview', { detail: { group: group, livepreview: e.target.checked } });

      window.dispatchEvent(changeSessionEvent);
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
      if (e.target.dataset['library']) {
        if (e.target.classList.contains('used')) {
          removeLibrary(group, e.target.dataset['library']);
          e.target.classList.remove('used');
        }
        else {
          addLibrary(group, e.target.dataset['library']);
          e.target.classList.add('used');
        }

        tabs.querySelector('#bite-add').textContent = '✚';
        addPanel.style.display = 'none';
      }
    });

    modesList.addEventListener('click', function(e) {
      if (e.target.dataset['mode']) {
        addBite(group, {
          mode: e.target.dataset['mode']
        });

        tabs.querySelector('#bite-add').textContent = '✚';
        addPanel.style.display = 'none';
      }
    });
  }

  return {
    addTab: addTab,
    addSession: addSession,
    addBite: addBite,
    addLibrary: addLibrary,
    removeBite: removeBite,
    removeLibrary: removeLibrary,
    buildUI: buildUI,
    buildEditor: buildEditor,
    bindEvents: bindEvents
  };
});
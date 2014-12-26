define('groups', ['lang_mappings', 'runner'], function(LangMappings, BiteRunner) {
  function initGroup(group) {
    var fragment = document.createDocumentFragment(),
        fragmentRoot = document.createElement('div');

    fragmentRoot.className = 'bite-container';
    fragmentRoot.id = 'bite-container-' + group.name;
    fragmentRoot.innerHTML = '<nav class="bite-container-tabs"></nav><section class="bite-container-editor"></section><iframe class="bite-container-result"></iframe>';
    
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

    group.container = fragment.firstChild.cloneNode(true);

    var firstBite = group.bites[0],
        firstBitePreTag = firstBite.preTag,
        firstBitePreTagParent = firstBitePreTag.parentElement;

    firstBitePreTagParent.insertBefore(group.container, firstBitePreTag);

    var editor = group.container.querySelector('.bite-container-editor'),
        result = group.container.querySelector('.bite-container-result'),
        tabs = group.container.querySelector('.bite-container-tabs'),
        aceEditor = ace.edit(editor),
        mode = LangMappings[firstBite.lang] || firstBite.lang;

    aceEditor.on('change', function(change) {
      var changeEvent = new Event('bite:change');

      window.dispatchEvent(changeEvent);
    });

    aceEditor.setTheme('ace/theme/monokai');
    aceEditor.setOptions({ enableBasicAutocompletion: true });
    aceEditor.setShowPrintMargin(false);

    EditSession = window.ace.require('ace/edit_session').EditSession;

    for (var i = 0; i < group.bites.length; i++) {
      var bite = group.bites[i];

      bite.session = new EditSession(bite.preTag.textContent, 'ace/mode/' + (LangMappings[bite.lang] || bite.lang));
      bite.session.setTabSize(2);
      bite.session.setUseSoftTabs(true);
      bite.session.setValue(bite.preTag.textContent || '');
    }

    aceEditor.setSession(firstBite.session);

    tabs.children[0].classList.add('active');

    tabs.addEventListener('click', function(e) {
      e.preventDefault();

      if (e.target.classList.contains('bite-container-tab')) {
        switch(e.target.id) {
          case 'bite-add':
          break;
          case 'bite-result':
            editor.style.display = 'none';
            result.style.display = 'block';

            var otherTabs = e.target.parentElement.querySelectorAll('.bite-container-tab');

            for (var i = 0; i < otherTabs.length; i++) {
              otherTabs[i].classList.remove('active');
            }

            e.target.classList.add('active');
          break;
          default:
            var lang = e.target.dataset['mode'];
            var bite = group.bites.filter(function(bite) { return lang === (LangMappings[bite.lang] || bite.lang); })[0];

            if (bite) {
              editor.style.display = 'block';
              result.style.display = 'none';
              
              aceEditor.setSession(bite.session);
              
              var otherTabs = e.target.parentElement.querySelectorAll('.bite-container-tab');

              for (var i = 0; i < otherTabs.length; i++) {
                otherTabs[i].classList.remove('active');
              }

              e.target.classList.add('active');
            }
          break;
        }
      }
      else if (e.target.classList.contains('bite-container-button')) {
        switch(e.target.id) {
          case 'bite-clear':
          break;
          case 'bite-run':
            BiteRunner.runBite(group);
          break;
        }
      }
    });

    group.editor = aceEditor;

    fragment = null;
  }

  return {
    initGroup: initGroup
  };
});
define('groups', ['ui', 'lang_mappings', 'runner'], function(UI, LangMappings, BiteRunner) {
  function initGroup(group) {
    group.container = UI.buildUI(group);
    group.editor = UI.buildEditor(group);

    var editor = group.container.querySelector('.bite-container-editor'),
        result = group.container.querySelector('.bite-container-result'),
        tabs = group.container.querySelector('.bite-container-tabs'),
        log = group.container.querySelector('.bite-container-log'),
        addPanel = group.container.querySelector('.bite-container-add'),
        librariesList = group.container.querySelector('.bite-container-libraries-list'),
        modesList = group.container.querySelector('.bite-container-modes-list');

    tabs.children[0].classList.add('active');

    tabs.addEventListener('click', function(e) {
      e.preventDefault();

      if (e.target.classList.contains('bite-container-tab')) {
        switch(e.target.id) {
          case 'bite-add':
            addPanel.style.display = addPanel.style.display === 'block' ? 'none' : 'block';
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
            var lang = e.target.dataset['mode'],
                bite = group.bites.filter(function(bite) { return lang === (LangMappings.mappings[bite.lang] || bite.lang); })[0];

            if (bite) {
              editor.style.display = 'block';
              result.style.display = 'none';

              group.editor.setSession(bite.session);
              
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
            log.innerHTML = '';
          break;
          case 'bite-run':
            BiteRunner.runBite(group);
          break;
        }
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
    initGroup: initGroup
  };
});
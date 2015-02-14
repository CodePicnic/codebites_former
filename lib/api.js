define('api', ['ui', 'lang_mappings', 'runner'], function(UI, LangMappings, BiteRunner) {
  function addBite(options) {
    UI.addBite(this, options);
  }

  function addTab(options) {
    var side = options.side || 'left',
        text = options.text,
        tabs = this.querySelector('.bite-container-tabs-' + side);

    var tab = document.createElement('a');

    tab.href = '#';
    tab.className = 'bite-container-tab';
    tab.className += ' ' + options.className;

    tab.innerHTML += '<span class="bite-tab-text">' + text + '</span><small class="bite-container-remove-tab" title="Cerrar">✖</small>';

    tabs.appendChild(tab);

    var tabPagesContainer = this.querySelector('.bite-container-tabpages'),
        tabPages = tabPagesContainer.children,
        otherTabs = tabs.children,
        tabPage = tabPagesContainer.querySelector('.bite-tabpage-' + options.className.split('-').pop());

    if (tabPage) {
      tab.addEventListener('click', function(e) {
        e.preventDefault();

        for (var i = 0; i < tabPages.length; i++) {
          tabPages[i].style.display = 'none';
        }

        for (var i = 0; i < otherTabs.length; i++) {
          otherTabs[i].classList.remove('active');
        }

        tabPage.style.display = 'block';
        tab.classList.add('active');
      });
    }
  }

  function removeBiteAt(index) {
    UI.removeBite(this, this.querySelectorAll('.bite-container-tab[data-mode]')[index]);
  }

  function biteExists(name) {
    for (var i = 0; i < this.bites.length; i++) {
      var bite = this.bites[i];

      if (bite.name !== undefined && bite.name === name) {
        return true;
      }
    }

    return false;
  }

  function addElement(element, events, parentElement) {
    if (parentElement !== undefined) {
      parentElement = this.container.querySelector('.bite-container-' + parentElement)
    }
    else {
      parentElement = this.container;
    }

    parentElement.appendChild(element);

    var eventNames = Object.keys(events || {});

    for (var i = 0; i < eventNames.length; i++) {
      (function(element, eventName, eventHandler) {
        element.addEventListener(eventName, eventHandler);
      })(element, eventNames[i], events[eventNames[i]]);
    }
  }

  function addModal(id, modalHTML) {
    var fragment = document.createDocumentFragment(),
        fragmentRoot = document.createElement('div');

    var fragmentRootHTML = '<section class="bite-modal-overlay ' + id + '-' + this.name + '">';
    fragmentRootHTML += modalHTML;
    fragmentRootHTML += '</section>';
    fragmentRoot.innerHTML = fragmentRootHTML;

    fragment.appendChild(fragmentRoot);
    var modal = fragment.querySelector('.bite-modal-overlay').cloneNode(true);

    this.container.appendChild(modal);

    var self = this;

    modal.addEventListener('click', function(e) {
      if (e.target.classList.contains(id + '-' + self.name)) {
        self.hideModal(id);
      }
    }, true);
  }

  function addSidebarElement(sidebarElementStructure, types, parentElement, fireEvent) {
    var parentElement = parentElement || this.container.querySelector('.bite-container-sidebar'),
        keys = Object.keys(sidebarElementStructure),
        types = types || {};

    if (fireEvent === undefined) {
      fireEvent = true;
    }

    for (var i = 0; i < keys.length; i++){
      var key = keys[i],
          value = sidebarElementStructure[key];

      if (typeof value === 'string') {
        if (types[value] && types[value].match('directory')) {
          var element = document.createElement('dl'),
            elementTitle = document.createElement('dt');

          elementTitle.textContent = key;
          elementTitle.dataset.path = value;
          elementTitle.classList.add('directory');

          element.appendChild(elementTitle);
        }
        else {
          var element = document.createElement('dd');
          
          element.textContent = key;
          element.dataset.path = value;
          element.classList.add('file');
        }
      }
      else if (typeof value === 'object') {
        var element = document.createElement('dl'),
            elementTitle = document.createElement('dt');

        elementTitle.textContent = key;
        elementTitle.classList.add('directory');

        if (!parentElement.classList.contains('bite-container-sidebar') && parentElement.querySelector('dt[data-path]')) {
          elementTitle.dataset.path = parentElement.querySelector('dt[data-path]').dataset.path + '/' + key;
        }
        else {
          elementTitle.dataset.path = key;
        }

        element.appendChild(elementTitle);

        addSidebarElement(value, types, element, false);
      }

      parentElement.appendChild(element);
    }

    if (fireEvent) {
      var addSidebarElementEvent = new CustomEvent('bite:addsidebarelement', { detail: { group: this, sidebarElement: sidebarElementStructure } });

      window.dispatchEvent(addSidebarElementEvent);
    }
  }

  function showModal(id) {
    this.container.querySelector('.' + id + '-' + this.name).style.display = 'block';
  }

  function hideModal(id) {
    this.container.querySelector('.' + id + '-' + this.name).style.display = 'none';
  }

  function querySelector(selector) {
    return this.container.querySelector(selector);
  }

  function querySelectorAll(selector) {
    return this.container.querySelectorAll(selector);
  }

  function toString() {
    return this.bites.map(function(bite) {
      bite.preTag.textContent = bite.session.getValue();
      
      return bite.preTag.outerHTML;
    }).join('\n');
  }

  return {
    addElement: addElement,
    addBite: addBite,
    addTab: addTab,
    biteExists: biteExists,
    removeBiteAt: removeBiteAt,
    addSidebarElement: addSidebarElement,
    addModal: addModal,
    showModal: showModal,
    hideModal: hideModal,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    toString: toString
  };
});
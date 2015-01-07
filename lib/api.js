define('api', ['ui', 'lang_mappings', 'runner'], function(UI, LangMappings, BiteRunner) {
  function addElement(element, events) {
    this.container.appendChild(element);

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
    addModal: addModal,
    showModal: showModal,
    hideModal: hideModal,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    toString: toString
  };
});
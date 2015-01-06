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

    fragmentRootHTML = '<section class="bite-modal-overlay ' + id + '-' + this.name + '">';
    fragmentRootHTML += modalHTML;
    fragmentRootHTML += '</section>';
    fragmentRoot.innerHTML = fragmentRootHTML;

    fragment.appendChild(fragmentRoot);
    var modal = fragment.querySelector('.bite-modal-overlay').cloneNode(true);

    this.container.appendChild(modal);
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

  return {
    addElement: addElement,
    addModal: addModal,
    showModal: showModal,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll
  };
});
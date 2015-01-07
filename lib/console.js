define('console', [], function() {
  function elementToSelector(element) {
    var selector = element.tagName.toLowerCase();

    if (element.id !== '') {
      selector += '#' + element.id
    }

    if (element.className !== '') {
      selector += '#' + element.className.replace(/ /g, '.');
    }

    return selector;
  }

  function objectKeys(object) {
    var keys;

    if (true) { //object instanceof HTMLElement
      keys = [];

      for (var i in object) {
        keys.push(i);
      }
    }
    else {
      if (Object.getOwnPropertyNames) {
        keys = Object.getOwnPropertyNames(object);
      }
      else if (Object.keys) {
        keys = Object.keys(object);
      }
      else {
        keys = [];

        for (var i in object) {
          keys.push(i);
        }
      }
    }

    return keys;
  }

  function preJSON(object) {
    var linearObject;

    if (
      (typeof object === 'string') ||
      (typeof object === 'number') ||
      (typeof object === 'boolean')
    ) {
      linearObject = object;
    }
    else if (
      (object instanceof this.String) ||
      (object instanceof this.Number) ||
      (object instanceof this.Boolean)
    ) {
      linearObject = object.constructor(object);
    }
    else if (typeof object === 'undefined') {
      linearObject = 'undefined';
    }
    else if (object === null) {
      linearObject = 'null';
    }
    else if (object instanceof this.Function) {
      linearObject = object.toString();
    }
    else if (object instanceof this.Date) {
      linearObject = object.toString();
    }
    else if (object instanceof this.Document) {
      linearObject = '#document';
    }
    else if (object instanceof this.Window) {
      linearObject = 'window';
    }
    else if (object instanceof this.Comment) {
      linearObject = '<!--' + object.nodeValue + '-->';
    }
    else if (object instanceof this.Text) {
      linearObject = object.nodeValue;
    }
    else if (object instanceof this.Attr) {
      linearObject = {};
      linearObject[object.name] = object.nodeValue;
    }
    else if (object instanceof this.HTMLElement) {
      linearObject = {};
      var keys = objectKeys(object);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        try {
          value = object[key]
        }catch(e) {
          value = undefined;
          window.top.console.log(e);
        }

        if (value instanceof this.HTMLElement) {
          value = elementToSelector(value);
        }

        linearObject[key] = preJSON(value);
      }
    }
    else if (
      (Array.isArray(object)) ||
      (object instanceof this.NodeList) ||
      (object instanceof this.HTMLCollection)
    ) {
      linearObject = [];

      for (var i = 0; i < object.length; i++) {
        var value = object[i];

        if (value instanceof HTMLElement) {
          value = elementToSelector(value);
        }

        linearObject.push(preJSON(value));
      }
    }
    else if (typeof object === 'object') {
      linearObject = {};
      var keys = objectKeys(object);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        linearObject[key] = preJSON(object[key]);
      }
    }

    return linearObject;
  }

  function inspectArray(array, rootClass) {
    var listClass = 'array';

    if (rootClass) {
      listClass = 'element_' + rootClass;
    }

    var listContent = '<dl class="' + listClass + ' object array">';

    for (var i = 0; i < array.length; i++) {
      listContent += '<dd>' + inspect(array[i]) + '</dd>';
    }

    listContent += '</dl>';

    return listContent;
  }

  function inspectObject(object, rootClass) {
    var listClass = 'object';

    if (rootClass) {
      listClass = 'element_' + rootClass;
    }

    var listContent = '<dl class="' + listClass + ' object">';

    var keys = Object.keys(object);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      listContent += '<dt class="collapsed">' + key + ':</dt>' +
                      '<dd class="collapsed">' + inspect(object[key]) + '</dd>';
    }

    listContent += '</dl>';

    return listContent;
  }

  function inspect(content, rootClass) {
    var inspectedContent;

    window.top.console.log(content);

    content = preJSON.call(this, content);

    window.top.console.log(content);

    if (content === 'undefined' || content === undefined) {
      inspectedContent = '<span class="undefined">' + content + '</span>';
    }
    else if (content === null) {
      inspectedContent = '<span class="null">' + content + '</span>';
    }
    else if (content.indexOf && content.indexOf('function') === 0) {
      inspectedContent = '<span class="function">' + content + '</span>';
    }
    else if (content[10] === 'T' && content[content.length - 1] === 'Z') {
      inspectedContent = '<span class="date">' + content + '</span>';
    }
    else if (typeof content === 'string') {
      try {
        var HTMLcontent = new DOMParser().parseFromString(content, 'text/html');

        if (HTMLcontent.nodeType === 9) {
          content = content.replace(/</g, '&lt;');
          content = content.replace(/>/g, '&gt;');
        }

        inspectedContent = '<span class="html">' + content + '</span>';
      }
      catch(e) {
        window.top.console.log(e);
      }
      finally {
        if (content === '') {
          content = '""';
        }

        inspectedContent = '<span class="string">' + content + '</span>';
      }
    }
    else if (typeof content === 'number') {
      inspectedContent = '<span class="number">' + content + '</span>';
    }
    else if (typeof content === 'boolean') {
      inspectedContent = '<span class="boolean">' + content + '</span>';
    }
    else if (Array.isArray(content)) {
      inspectedContent = inspectArray(content, rootClass);
    }
    else if (typeof content === 'object') {
      inspectedContent = inspectObject(content, rootClass);
    }
    else {
      // window.top.console.log(this, this.Object === Object);
    }

    return inspectedContent;
  }

  return {
    log: inspect,
    info: inspect,
    error: inspect,
    warn: inspect,
    dir: inspect
  };
});
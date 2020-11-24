window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      //创建div
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      //查找div
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }

  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }

  //api可以操作elements
  const api = Object.create(jQuery.prototype); //创建一个对象，这个对象的__proto__为括号里面的内容
  //const api= {__proto__: jQuery.prototype}
  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArrayOrTemplate.oldApi,
  });
  //api.elements = elements
  //api.oldApi = selectorOrArrayOrTemplate.oldApi
  return api;
};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jQuery: true,
  get(index) {
    return this.elements[index];
  },
  appendTo(node) {
    if (node instanceof Element) {
      this.each((el) => node.appendChild(el));
    } else if (node.jQuery === true) {
      this.each((el) => node.get(0).appendChild(el));
    }
  },
  //获取儿子
  append(children) {
    if (children instanceof Element) {
      this.get(0).appendChild(children);
    } else if (children instanceof HTMLCollection) {
      for (let i = 0; i < children.length; i++) {
        this.get(0).appendChild(children[i]);
      }
    } else if (children.jQuery === true) {
      children.each((node) => this.get(0).appendChild(node));
    }
  },
  find(selector) {
    let array = [];
    for (let i = 0; i < this.elements.length; i++) {
      const elements2 = Array.from(this.elements[i].querySelectorAll(selector));
      array = array.concat(this.elements2);
    }
    array.oldApi = this; //this 是 旧api
    return jQuery(array); //返回新的对象并操作这个对象
  },
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },
  parent() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
  },
  children() {
    const array = [];
    this.each((node) => {
      array.push(...node.children);
    });
    return jQuery(array);
  },
  print() {
    console.log(this.elements);
  },
  //闭包：函数访问外部的变量
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      const element = this.elements[i];
      element.classList.add(className);
    }
    return this;
  },
  end() {
    return this.oldApi; //this 是 新api
  },
};

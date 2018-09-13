export function hover(elem, overCallback, outCallback) {//实现hover事件
    var isHover = false;//判断是否悬浮在上方
    var preOvTime = new Date().getTime();//上次悬浮时间
    function unbind(elem,ev,callback) {
      if(typeof(callback)=="function")
      {
        if(document.all)
        {
          elem.detachEvent("on"+ev,callback);
        }else{
          elem.removeEventListener(ev,callback,false);
        }
      }else{
        if(document.all)
        {
          elem.detachEvent("on"+ev);
        }else{
          elem.removeEventListener(ev,false);
        }
      }
    }
    function bind(elem,ev,callback) {
      if(document.all)
      {
        elem.attachEvent("on"+ev,callback);
      }else{
        elem.addEventListener(ev,callback,false);
      }
    }
    function over(e) {
      var curOvTime = new Date().getTime();
      isHover = true;//处于over状态
      if (curOvTime - preOvTime > 10) {//时间间隔超过10毫秒，认为鼠标完成了mouseout事件
        overCallback(e, elem);
      }
      preOvTime = curOvTime;
    }
    function out(e) {
      var curOvTime = new Date().getTime();
      preOvTime = curOvTime;
      isHover = false;
      setTimeout(function () {
        if (!isHover) {
          outCallback(e, elem);
        }
      }, 10);
    }
  
    bind(elem, "mouseover", over);
    bind(elem, "mouseout", out);
  };
  
  export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }
  
  export function addClass(el, className) {
    if (hasClass(el, className)) {
      return
    }
  
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }
  
  export function removeClass(el, className) {
    if (!hasClass(el, className)) {
      return
    }
  
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g')
    el.className = el.className.replace(reg, ' ')
  }
  
  export function getData(el, name, val) {
    let prefix = 'data-'
    if (val) {
      return el.setAttribute(prefix + name, val)
    }
    return el.getAttribute(prefix + name)
  }
  
  export function getRect(el) {
    if (el instanceof window.SVGElement) {
      let rect = el.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    } else {
      return {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
    }
  }
  
  export function getScrollOffsets(w) {
    // 使用指定的窗口，如果不带参数则使用当前窗口
    w = w || window;
    // 对标准模式下的IE（或任何浏览器）
    var d = w.document;
    if (document.compatMode == "CSS1Compat")
      return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop };
  
  }
  
  
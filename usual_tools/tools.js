/**
 * Created by a369785853 on 2017/6/16.
 */
(function(){
    var tools = (function(){
        function toArray (curElem) {
            var arr = [];
            if (/MSIE (6|7|8)/i.test(window.navigator.userAgent)) {
                for (var i = 0; i < curElem.length; i++) {
                    arr[arr.length] = curElem[i]
                }
            } else {
                arr = Array.prototype.slice.call(curElem);
            }
            return arr;
        };

        function children (curElem,tagName) {
            var arr = [];
            if (/MSIE (6|7|8)/.test(window.navigator.userAgent)) {
                var childList = curElem.childNodes;
                for (var i = 0; i < childList.length; i++) {
                    var curChild = childList[i]
                    if (curChild.nodeType === 1) {
                        arr[arr.length] = curChild
                    }
                }
            } else {
                arr = Array.prototype.slice.call(curElem.children);
            }
            if (typeof tagName === "string") {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].nodeName.toLowerCase() !== tagName.toLowerCase()) {
                        arr.splice(i,1);
                        i--;
                    }
                }
            }
            return arr;
        }
        function prev (curElem) {
            var elem;
            if (/MSIE (6|7|8)/i.test(window.navigator.userAgent)) {
                elem = curElem.previousSibling;
                while (elem && elem.nodeType !== 1) {
                    elem = elem.previousSibling
                }
            } else {
                elem = curElem.previousElementSibling;
            }
            return elem
        }
        function prevAll (curElem) {
            var arr = [];
            var pre = prev(curElem);
            while (pre) {
                arr.unshift(pre);
                pre = prev(pre)
            }
            return arr;
        }
        function next (curElem) {
            var elem;
            if (/MSIE (6|7|8)/i.test(window.navigator.userAgent)) {
                var elem = curElem.nextSibling;
                while (elem && elem.nodeType !== 1) {
                    elem = elem.nextSibling;
                }
            } else {
                elem = curElem.nextElementSibling;
            }
            return elem;
        }
        function nextAll (curElem) {
            var arr = [];
            var nxt = next(curElem);
            while (nxt) {
                arr.push(nxt);
                nxt = next(nxt)
            }
            return arr;
        }
        function sibling (curElem) {
            var arr = [],nxt = next(curElem),pre = prev(curElem);
            arr.push(pre,nxt)
            return arr;
        }
        function siblings (curElem) {
            var arr = [],nxtAll = nextAll(curElem),preAll = prevAll(curElem)
            for (var i = 0; i < nxtAll.length; i++) {
                preAll.push(nxtAll[i]);
            }
            arr = preAll;
            return arr;
        }
        function index (curElem) {
            return prevAll(curElem).length;
        }
        function first (curElem) {
            return  children(curElem)[0];
        }
        function last (curElem) {
            var elem = children(curElem)
            return elem[elem.length-1]
        }
        function prepend (curElem,target) {
            if (children(curElem).length > 0) {
                curElem.insertBefore(target,first(curElem));
                return;
            }
            curElem.appendChild(target);
        }
        function insertAfter (curElem,target) {
            var parent = curElem.parentNode,nxt = next(curElem);
            if (nxt) {
                parent.insertBefore(target,nxt);
                return ;
            }
            parent.appendChild(target)
        }
        function hasClass (curElem,Class) {
            var arr = [],reg = /^ +| +$/g;
            arr = Class.replace(reg,'').split(/ +/g);

            for (var i = 0; i < arr.length; i++) {
                var reg1 = new RegExp("(^| +)" + arr[i] + "( +|$)","g"),flag = true;
                if (!reg1.test(curElem.className)) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        function addClass (curElem,target) {
            var arr = [],reg = /^ +| +$/g;
            arr = target.replace(reg,"").split(/ +/g);
            for (var i = 0; i < arr.length; i++) {
                if (!hasClass(curElem,arr[i])) {
                    curElem.className += " "+arr[i]
                }
            }
        }
        function removeClass (curElem,target) {
            var arr = [],reg = /^ +| +$/g;
            arr = target.replace(reg,"").split(/ +/g);
            for (var i = 0; i < arr.length; i++) {
                if (hasClass(curElem,arr[i])) {
                    var reg1 = new RegExp("(^| +)" + arr[i] + "( +|$)");
                    curElem.className = curElem.className.replace(reg1," ")
                }
            }
        }
        function getCss (curElem,attr) {
            var elem;
            if (window.getComputedStyle) {
                elem = window.getComputedStyle(curElem)[attr]
            } else {
                if (attr === "opacity") {
                    elem = curElem.currentStyle["filter"];
                    var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                    return elem.replace(reg,function(){
                        return arguments[1]/100;
                    });
                }
                elem = curElem.currentStyle[attr];
            }
            var reg1 = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/;
            return reg1.test(elem) ? parseFloat(elem) : elem;
        }
        function setCss (curElem,attr,value) {
            if (attr === "opacity") {
                curElem["style"]["opacity"] = value;
                curElem["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            }
            if (attr === "float") {
                curElem["style"]["cssFloat"] = value;
                curElem["style"]["styleFloat"] = value;
            }
            var reg = /^(width|height|left|top|right|bottom|((border|margin|padding)(Left|Top|Right|Bottom)?))$/
            if (reg.test(attr)) {
                if (!isNaN(value)) {
                    value += "px";
                }
            }
            curElem["style"][attr] = value;
        }
        function setGroupCss (curElem,options) {
            if (Object.prototype.toString.call(options) === '[object Object]') {
                for (var key in options) {
                    setCss(curElem,key,options[key])
                }
            }
        }
        function css (curElem) {
            if (typeof arguments[1] === "string") {
                if (typeof arguments[2] === "undefined") {
                    return getCss.apply(this,arguments);
                }
                setCss.apply(this,arguments)
            }
            if (Object.prototype.toString.call(arguments[1]) === "[object Object]") {
                setGroupCss.apply(this,arguments)
            }
        }
        function getElementsByClassName (context,Class) {
            var arr = [],arr1 = [],reg = /^ +| +$/g;
            arr = Class.replace(reg,'').split(/ +/g);
            context = context || document;
            if (/MSIE (6|7|8)/i.test(window.navigator.userAgent)) {
                var HtmlCollection = context.getElementsByTagName("*");
                for (var i = 0; i < HtmlCollection.length; i++) {
                    var flag = true;
                    for (var j = 0; j < arr.length; j++) {
                        var reg1 = new RegExp("(^| +)" + arr[j] + "( +|$)","g");
                        if (!reg1.test(HtmlCollection[i].className)) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        arr1.push(HtmlCollection[i])
                    }
                }
            } else {
                arr1 = toArray(context.getElementsByClassName(Class));
            }
            return arr1;
        }
        var anim = {
            linear : function (t,d,c,b){
                return t/d*c+b;
            }
        };
        function animate (curElem,target,duration,callback) {
            window.clearInterval(curElem.move)
            var time = 0;
            if (Object.prototype.toString.call(target) === "[object Object]") {
                var begin = {},change = {};
                for (var key in target) {
                    begin[key] = getCss(curElem,key);
                    change[key] = parseFloat(target[key])-begin[key];
                }
                curElem.move = window.setInterval(function(){
                    time += 10;
                    if (time >= duration) {
                        css(curElem,target);
                        window.clearInterval(curElem.move);
                        if (typeof callback === "function") {
                            callback.call(curElem);
                        }

                        return;
                    }
                    for (var key in target) {
                        a = anim.linear(time,duration,change[key],begin[key]);
                        css(curElem,key,a)
                    }
                },10)
            }
        }
        return {
            toArray : toArray,
            children : children,
            prev : prev,
            prevAll : prevAll,
            next : next,
            nextAll : nextAll,
            sibling : sibling,
            siblings : siblings,
            index : index,
            first : first,
            last : last,
            prepend: prepend,
            insertAfter : insertAfter,
            hasClass : hasClass,
            addClass : addClass,
            removeClass : removeClass,
            getCss : getCss,
            setCss : setCss,
            setGroupCss : setGroupCss,
            css : css,
            getElementsByClassName : getElementsByClassName,
            animate : animate
        };
    })()
    window.tools = tools;
})()
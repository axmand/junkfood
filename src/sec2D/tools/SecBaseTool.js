/**
*   定义tool类基类
*   @class Hmap.Tools.BaseTool
*   @abstract 
*   @author yellow  date:2013/9/8
*/
define(['EventListener','Hobject'], function (EventListener,Hobject) {

    var addListener = EventListener.AddListener,
        removeListener = EventListener.RemoveListener,
        isArray = Hobject.BaseFunc.isArray;

    var tools = [],
        //记录command个数（ui按钮个数）
        cmdNum = 0,
        menu = null,
        mariginPx = 105;  //边距单位

    var _menu = function (mapElement) {
        var menuDom = document.createElement("div"),
            style = menuDom.style;
        menuDom.id = "mapTool";
        menuDom.className = "button glow button-rounded";
        style.position = "absolute";
        style.marginRight = "9px";
        style.zIndex = 99;
        style.width = (mapElement.offsetWidth - 24) + 'px';
        style.height = "41px";
        style.opacity = 0.9;
        mapElement.insertBefore(menuDom, mapElement.firstChild);
        //添加commandItem到工具栏
        var add = function (item) {
            if (isArray(item)) {
                for (var i = 0, len = item.length; i < len; i++) {
                    menuDom.appendChild(item[i].btnDiv);
                }
            }
        }
        //移除commandItem工具
        var remove = function (item) {

        }
        return {
            add: add,
            remove: remove,
        };
    }

    var _childMenu = function (commands, names, iconNames) {

        var cMul = document.createElement('ul');
        cMul.style.marginLeft = '-40px';
        cMul.style.listStyleType = 'none';

        var _show = function () {
            cMul.style.display = '';
        }
        var _hide = function () {
            cMul.style.display = 'none';
        }

        for (var j = 0, len = commands.length; j < len; j++) {
            var li = document.createElement('li'),
                a = document.createElement('a'),
                i = document.createElement('i');
            //
            i.className = 'fa '+iconNames[j]+' fa-fw';
            a.appendChild(i);
            a.innerHTML += names[j];
            a.style.width = "80px";
            a.style.marginTop = '3px';
            a.className = 'button button-rounded button-flat-primary'; //primary , royal
            //
            (function (num) {
                addListener(a, 'click', function () {
                    commands[num].execute();
                });
            })(j);
            //
            li.appendChild(a);
            cMul.appendChild(li);
        }
        
        _hide();

        return {
            ul: cMul,
            show: _show,
            hide:_hide,
        }
    }

    /**
    *   Tool的基类，用于创建tool和管理tool位置
    */
    var _secBaseTool = function (args) {
        this.args = args || {};
        //用mapInfo把整个对象存起来
        this.mapInfo = args;
        //操作按钮集合
        this.cmds = [];
    }
    /**
    *   装载tool到toolDiv
    *   @abstract
    *   @method load
    */
    _secBaseTool.prototype.load = function (args) {
        this.merge(args);
        this._createTool();
        this._iniInteraction();
        tools.push(this);
    }
    /*
    *   创建tool操作
    *   @methotd _createTool
    */
    _secBaseTool.prototype._createTool = function () {

    }
    /**
    *   创建meun
    *   @method createMenu
    */
    _secBaseTool.prototype._createMenu = function () {
        menu = menu||new _menu(this.args.mapElement);
    }
    /*
    *   注册操作事件
    *   @method _iniInteraction
    */
    _secBaseTool.prototype._iniInteraction = function () {
        !!menu ? menu.add(this.cmds) : null;
    }
    /**
    *   从toolDiv remove tool
    *   @abstract
    *   @method remove
    */
    _secBaseTool.prototype.remove = function () {

    }
    /**
     * 更新tool状态
     */
    _secBaseTool.prototype.update = function () {

    }
    /**
    *   获取tool类型
    *   @abstract
    *   @method getType
    */
    _secBaseTool.prototype.getType = function () {
        return "SecBaseTool";
    }
    /**
    *   合并参数
    *   @method merge
    */
    _secBaseTool.prototype.merge=function (args) {
        for (var item in args) {
            if (this.args[item] === undefined) {
                this.args[item] = args[item];
            }
        }
    }
    /**
    *   命名模式Command
    *   命令对象
    *   @class Command
    */
    var command = function (action) {
        this.action = action;
    }
    /**
    *   command唯一函数，执行action操作
    *  @method execute
    */
    command.prototype.execute = function () {
        this.action();
    }
    /**
    *   command事件的item项目,有事件交互功能
    *   单一item的command
    *   @class CommandItem
    */
    var _commandItem = function (name, command, iconName) {
        var icon = iconName || "fa-pencil";
        var btnDiv = document.createElement('div');
        btnDiv.style.position = "absolute";
        btnDiv.style.top = "3px";
        btnDiv.style.right = (cmdNum * mariginPx).toString().concat('px');//动态计算commandItem的距离
        btnDiv.style.width = "110px";
        btnDiv.style.height = "34px";
        btnDiv.style.zIndex = 99;

        cmdNum++;

        var cmdBtn = document.createElement("a");
        cmdBtn.className = "button button-rounded button-flat-primary";
        cmdBtn.style.width = "80px";
        cmdBtn.style.height = "34px";

        var i = document.createElement('i');
        i.className = "fa " + icon + " fa-fw";
        cmdBtn.appendChild(i);

        cmdBtn.innerHTML+= name;
        btnDiv.appendChild(cmdBtn);

        addListener(cmdBtn, 'click', function (event) {
            command.execute();
        });

        var setText = function (text) {
            var str = cmdBtn.innerHTML;
            str = str.slice(0,str.length-name.length);
            name = text;
            str += name;
            cmdBtn.innerHTML = str;
        }

        var setIcon = function (iconText) {
            var str = cmdBtn.innerHTML;
            str = str.split(' ');
            str[2] = iconText;
            cmdBtn.innerHTML = str.join(' ');
        }

        return {
            btnDiv: btnDiv,
            setText: setText,
            setIcon:setIcon,
        }
    }
    /**
    *   创建一个带下拉功能的command button
    *   @multiCommandItem
    *   @param name {String} 下拉菜单按钮名称
    *   @param names {Array} 下拉菜单子项名集合
    *   @param commands {Array}
    *   @param iconNames {Array} 下拉菜单图标集合
    */
    var _multiCommandItem = function (name, names, commands, iconNames) {
        var flag = false;
        var dropDownCommand = new command(function () {
            if (!flag) {
                childMenu.show();
                flag = true;
            } else {
                childMenu.hide();
                flag = false;
            }
        });
        //点击后显示子菜单项
        var dropDrownCommandItem = new _commandItem(name, dropDownCommand,'fa-toggle-down');

        var childMenu = new _childMenu(commands, names,iconNames);
        
        dropDrownCommandItem.btnDiv.appendChild(childMenu.ul);

        return {
            btnDiv: dropDrownCommandItem.btnDiv,
        }

    }

    return {
        self: _secBaseTool,
        Command: command,
        CommandItem: _commandItem,
        MultiCommandItem:_multiCommandItem,
    }

});
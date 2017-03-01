/**
 *  提供简单的UI
 *  @class Hmap.Core.Hui
 */

define(function () {

    //#region 进度条 processbar

    var _processCircle = function () {
        this._init();
    }

    _processCircle.prototype._init = function () {
        var i, len = 10, rootId = 'blockG', tId;
        //
        this.circularG = document.createElement('div');
        this.circularG.id = 'facebookG';
        this.circularG.style.zIndex = 10000;
        this.circularG.style.position = 'absolute';
        //
        for (i = 1; i <= len; i++) {
            var childNode = document.createElement('div');
            childNode.id = rootId + '_' + i.toString();
            childNode.className = 'facebook_blockG';
            this.circularG.appendChild(childNode);
        }
    }

    _processCircle.prototype.setMapObj = function (domElement) {
        this.mapObj = domElement || window.HTMLBodyElement;
        this.circularG.style.display = 'none';
        this.mapObj.appendChild(this.circularG);
    }

    _processCircle.prototype.setPosition = function (top, left) {
        this.circularG.style.top = (top || 0).toString() + 'px';
        this.circularG.style.left = (left || 0).toString() + 'px';
    }

    _processCircle.prototype.show = function () {
        this.circularG.style.display = 'block';
    }

    _processCircle.prototype.hide = function () {
        this.circularG.style.display = 'none';
    }

    var mProcessBar = new _processCircle();

    //#endregion

    //#region 弹出对话框，弹出表单

    var _dialog = function () {
        this.modal = document.createElement('div');
        this.modal_dialog = document.createElement('div');
        this.modal_content = document.createElement('div');
        this.modal_header = document.createElement('div');
        this.modal_body = document.createElement('div');
        this.modal_footer = document.createElement('div');
        this._inilization();
        this._default();
    }

    _dialog.prototype._inilization = function () {
        this.modal.className = 'modal fade';
        this.modal_content.className = 'modal-content';
        this.modal_dialog.className = 'modal-dialog';
        this.modal_header.className = 'modal-header';
        this.modal_body.className = 'modal-body';
        this.modal_footer.className = 'modal-footer';
        //
        this.modal_content.appendChild(this.modal_header);
        this.modal_content.appendChild(this.modal_body);
        this.modal_content.appendChild(this.modal_footer);
        //
        this.modal_dialog.appendChild(this.modal_content);
        //
        this.modal.appendChild(this.modal_dialog);
    }

    _dialog.prototype._default = function () {
        var h4 = document.createElement('h4');
        h4.nodeValue = '标题栏';
        h4.className = 'modal-title';
        //
        this.modal_header.appendChild(h4);
    };



    _dialog.prototype.setMapObj = function (domElement) {
        this.mapObj = domElement || window.HTMLBodyElement;
        document.body.appendChild(this.modal);
    }

    //#endregion

    return {
        processCircle: mProcessBar,
        dialog:_dialog,
    }

});
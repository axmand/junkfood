
define(['Shape', 'Utils', 'Factory'], function (Shape, Utils, Factory) {

    var IMAGE = 'Image',
        Shape = Shape.self,
        Factory = Factory.self,
        extend=Utils.self.extend,
        SET = 'set';

    var _image = function (config) {
        this.___init(config);
    }

    _image.prototype = {
        ___init: function (config) {
            Shape.call(this, config);
            this.className = IMAGE;
        },
        _useBufferCanvas: function () {
            return (this.hasShadow() || this.getAbsoluteOpacity() !== 1) && this.hasStroke();
        },
        drawFunc: function (context) {
            var width = this.getWidth(),
                height = this.getHeight(),
                crop, cropWidth, cropHeight,
                params,
                image;

            //TODO: this logic needs to hook int othe new caching system

            // if a filter is set, and the filter needs to be updated, reapply
            if (this.getFilter() && this._applyFilter) {
                this.applyFilter();
                this._applyFilter = false;
            }

            // NOTE: this.filterCanvas may be set by the above code block
            // In that case, cropping is already applied.
            if (this.filterCanvas) {
                image = this.filterCanvas._canvas;
                params = [image, 0, 0, width, height];
            }
            else {
                image = this.getImage();

                if (image) {
                    crop = this.getCrop(),
                    cropWidth = crop.width;
                    cropHeight = crop.height;
                    if (cropWidth && cropHeight) {
                        params = [image, crop.x, crop.y, cropWidth, cropHeight, 0, 0, width, height];
                    } else {
                        params = [image, 0, 0, width, height];
                    }
                }
            }

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            context.fillStrokeShape(this);

            if (image) {
                context.drawImage.apply(context, params);
            }
        },
        drawHitFunc: function (context) {
            var width = this.getWidth(),
                height = this.getHeight(),
                imageHitRegion = this.imageHitRegion;

            if (imageHitRegion) {
                context.drawImage(imageHitRegion, 0, 0);
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                context.strokeShape(this);
            }
            else {
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                context.fillStrokeShape(this);
            }
        },
        applyFilter: function () {
            var image = this.getImage(),
                width = this.getWidth(),
                height = this.getHeight(),
                filter = this.getFilter(),
                crop = this.getCrop(),
                filterCanvas, context, imageData;

            // Determine the region we are cropping
            crop.x = crop.x;
            crop.y = crop.y;
            crop.width = crop.width || width - crop.x;
            crop.height = crop.height || height - crop.y;

            // Make a filterCanvas the same size as the cropped image
            if (this.filterCanvas &&
                this.filterCanvas.getWidth() === crop.width &&
                this.filterCanvas.getHeight() === crop.height) {
                filterCanvas = this.filterCanvas;
                filterCanvas.getContext().clear();
            }
            else {
                filterCanvas = this.filterCanvas = new Kinetic.SceneCanvas({
                    width: crop.width,
                    height: crop.height,
                    pixelRatio: 1
                });
            }

            context = filterCanvas.getContext();

            try {
                // Crop the image onto the filterCanvas then apply
                // the filter to the filterCanvas
                context.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
                imageData = context.getImageData(0, 0, crop.width, crop.height);
                filter.call(this, imageData);
                context.putImageData(imageData, 0, 0);
            }
            catch (e) {
                this.clearFilter();
                Kinetic.Util.warn('Unable to apply filter. ' + e.message);
            }
        },
        clearFilter: function () {
            this.filterCanvas = null;
            this._applyFilter = false;
        },
        createImageHitRegion: function (callback) {
            var that = this,
                width = this.getWidth(),
                height = this.getHeight(),
                canvas = new Kinetic.SceneCanvas({
                    width: width,
                    height: height,
                    pixelRatio: 1
                }),
                _context = canvas.getContext()._context,
                image = this.getImage(),
                imageData, data, rgbColorKey, i, len;

            _context.drawImage(image, 0, 0);

            try {
                imageData = _context.getImageData(0, 0, width, height);
                data = imageData.data;
                len = data.length;
                rgbColorKey = Kinetic.Util._hexToRgb(this.colorKey);

                // replace non transparent pixels with color key
                for (i = 0; i < len; i += 4) {
                    if (data[i + 3] > 0) {
                        data[i] = rgbColorKey.r;
                        data[i + 1] = rgbColorKey.g;
                        data[i + 2] = rgbColorKey.b;
                    }
                }

                Kinetic.Util._getImage(imageData, function (imageObj) {
                    that.imageHitRegion = imageObj;
                    if (callback) {
                        callback();
                    }
                });
            }
            catch (e) {
                Kinetic.Util.warn('Unable to create image hit region. ' + e.message);
            }
        },
        clearImageHitRegion: function () {
            delete this.imageHitRegion;
        },
        getWidth: function () {
            var image = this.getImage();
            return this.attrs.width || (image ? image.width : 0);
        },
        getHeight: function () {
            var image = this.getImage();
            return this.attrs.height || (image ? image.height : 0);
        },
        destroy: function () {
            Kinetic.Shape.prototype.destroy.call(this);
            delete this.filterCanvas;
            delete this.attrs;
            return this;
        },
    }

    extend(_image,Shape);

    Factory.addFilterGetterSetter = function (constructor, attr, def) {
        this.addGetter(constructor, attr, def);
        this.addFilterSetter(constructor, attr);
    };
    Factory.addFilterSetter = function (constructor, attr) {
        var method = SET + Kinetic.Util._capitalize(attr);

        constructor.prototype[method] = function (val) {
            this._setAttr(attr, val);
            this._applyFilter = true;
        };
    };
    Factory.addGetterSetter(_image, 'image');
    Factory.addBoxGetterSetter(_image, 'crop', 0);
    Factory.addFilterGetterSetter(_image, 'filter');

    return {
        self:_image,
    }
});
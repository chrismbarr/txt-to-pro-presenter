var TxtToPp;
(function (TxtToPp) {
    TxtToPp.appModuleName = 'txtToProApp';
    var app = angular.module(TxtToPp.appModuleName, []);
    app.config(['$compileProvider', function ($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
        }]);
})(TxtToPp || (TxtToPp = {}));
var TxtToPp;
(function (TxtToPp) {
    var Interfaces;
    (function (Interfaces) {
        ;
        (function (SlideTypeEnum) {
            SlideTypeEnum[SlideTypeEnum["Title"] = 0] = "Title";
            SlideTypeEnum[SlideTypeEnum["Slide"] = 1] = "Slide";
            SlideTypeEnum[SlideTypeEnum["Quote"] = 2] = "Quote";
            SlideTypeEnum[SlideTypeEnum["Verse"] = 3] = "Verse";
        })(Interfaces.SlideTypeEnum || (Interfaces.SlideTypeEnum = {}));
        var SlideTypeEnum = Interfaces.SlideTypeEnum;
        ;
        ;
        ;
        ;
    })(Interfaces = TxtToPp.Interfaces || (TxtToPp.Interfaces = {}));
})(TxtToPp || (TxtToPp = {}));
var TxtToPp;
(function (TxtToPp) {
    var Controllers;
    (function (Controllers) {
        var fileExt = "pro5";
        var MainController = (function () {
            function MainController($window, proPresenterDocService) {
                var _this = this;
                this.$window = $window;
                this.proPresenterDocService = proPresenterDocService;
                this.displayConfig = true;
                this.fileContents = "#";
                this.fileName = "file." + fileExt;
                this.docConfig = undefined;
                this.slides = [
                    {
                        content: "Title Slide Content",
                        slideType: TxtToPp.Interfaces.SlideTypeEnum.Title,
                        title: "Title Slide Title"
                    },
                    {
                        content: "Standard Slide Conent",
                        slideType: TxtToPp.Interfaces.SlideTypeEnum.Slide,
                        title: "Standard Slide Title"
                    }
                ];
                this.slideTypes = [
                    {
                        key: TxtToPp.Interfaces.SlideTypeEnum.Slide,
                        text: "Standard Slide"
                    },
                    {
                        key: TxtToPp.Interfaces.SlideTypeEnum.Title,
                        text: "Title Slide"
                    },
                    {
                        key: TxtToPp.Interfaces.SlideTypeEnum.Quote,
                        text: "Quote Slide"
                    },
                    {
                        key: TxtToPp.Interfaces.SlideTypeEnum.Verse,
                        text: "Bible Verse"
                    }
                ];
                this.toggleConfig = function () {
                    _this.displayConfig = !_this.displayConfig;
                };
                this.addSlide = function () {
                    _this.slides.push({
                        content: "",
                        slideType: TxtToPp.Interfaces.SlideTypeEnum.Slide,
                        title: ""
                    });
                };
                this.removeSlide = function (slide) {
                    _this.slides.splice(_this.slides.indexOf(slide), 1);
                };
                this.generateFile = function () {
                    var ppFile = _this.proPresenterDocService.makeFile(_this.docConfig, _this.slides);
                    var blob = new Blob([ppFile], { type: 'text/xml' });
                    _this.fileContents = _this.$window.URL.createObjectURL(blob);
                    _this.fileName = _this.docConfig.title.replace(/\s/g, "-") + "." + fileExt;
                };
            }
            MainController.$inject = ["$window", "proPresenterDocService"];
            return MainController;
        }());
        Controllers.MainController = MainController;
        angular
            .module(TxtToPp.appModuleName)
            .controller("mainController", MainController);
    })(Controllers = TxtToPp.Controllers || (TxtToPp.Controllers = {}));
})(TxtToPp || (TxtToPp = {}));
var TxtToPp;
(function (TxtToPp) {
    var Services;
    (function (Services) {
        var creatorCode = "1349676880";
        var ProPresenterDocService = (function () {
            function ProPresenterDocService(rtfSvc, colorSvc) {
                var _this = this;
                this.rtfSvc = rtfSvc;
                this.colorSvc = colorSvc;
                this.makeFile = function (config, slides) {
                    var today = new Date();
                    var dateStr = today.toISOString().split(".")[0];
                    return "<RVPresentationDocument height=\"" + config.height + "\" width=\"" + config.width + "\" versionNumber=\"500\" docType=\"0\" creatorCode=\"" + creatorCode + "\" lastDateUsed=\"" + dateStr + "\" usedCount=\"0\" category=\"" + config.category + "\" resourcesDirectory=\"\" backgroundColor=\"0 0 0 1\" drawingBackgroundColor=\"0\" notes=\"\" artist=\"\" author=\"\" album=\"\" CCLIDisplay=\"0\" CCLIArtistCredits=\"\" CCLISongTitle=\"" + config.title + "\" CCLIPublisher=\"\" CCLICopyrightInfo=\"" + today.getFullYear() + "\" CCLILicenseNumber=\"\" chordChartPath=\"\">\n    <timeline timeOffSet=\"0\" selectedMediaTrackIndex=\"0\" unitOfMeasure=\"60\" duration=\"0\" loop=\"0\">\n        <timeCues containerClass=\"NSMutableArray\"></timeCues>\n        <mediaTracks containerClass=\"NSMutableArray\"></mediaTracks>\n    </timeline>\n    <bibleReference containerClass=\"NSMutableDictionary\"></bibleReference>\n    <arrangements containerClass=\"NSMutableArray\"></arrangements>\n    <_-RVProTransitionObject-_transitionObject transitionType=\"-1\" transitionDuration=\"1\" motionEnabled=\"0\" motionDuration=\"20\" motionSpeed=\"100\"></_-RVProTransitionObject-_transitionObject>\n    <groups containerClass=\"NSMutableArray\">\n        " + _this.getSlidesXmlString(config, slides) + "\n    </groups>\n</RVPresentationDocument>";
                };
                this.getSlidesXmlString = function (config, slides) {
                    var groupUuid = _this.generateUuid();
                    var slideGroup = "<RVSlideGrouping name=\"\" uuid=\"" + groupUuid + "\" color=\"0 1 1 1\" serialization-array-index=\"0\">\n            <slides containerClass=\"NSMutableArray\">";
                    for (var _i = 0, slides_1 = slides; _i < slides_1.length; _i++) {
                        var s = slides_1[_i];
                        slideGroup += _this.createSlide(config, s, groupUuid);
                    }
                    slideGroup += "</slides>\n</RVSlideGrouping>";
                    return slideGroup;
                };
                this.createSlide = function (config, slide, groupId) {
                    var bgColor = _this.colorSvc.rgbToFloatRgbaColor(config.bgColor);
                    var displaySlide = "<RVDisplaySlide backgroundColor=\"" + bgColor + "\" enabled=\"1\" highlightColor=\"0 0 0 0\" hotKey=\"\" label=\"\" notes=\"\" slideType=\"1\" sort_index=\"2\" UUID=\"" + _this.generateUuid() + "\" drawingBackgroundColor=\"1\" chordChartPath=\"\" serialization-array-index=\"0\">\n                    <cues containerClass=\"NSMutableArray\"></cues>\n                    <displayElements containerClass=\"NSMutableArray\">";
                    if (slide.title) {
                        displaySlide += _this.makeTextElement(config.displayElementConfigs.slideTitle, slide.title);
                    }
                    if (slide.content) {
                        displaySlide += _this.makeTextElement(config.displayElementConfigs.slideContent, slide.content);
                    }
                    displaySlide += "</displayElements>\n                    <_-RVProTransitionObject-_transitionObject transitionType=\"-1\" transitionDuration=\"1\" motionEnabled=\"0\" motionDuration=\"20\" motionSpeed=\"100\"></_-RVProTransitionObject-_transitionObject>\n                </RVDisplaySlide>\n                ";
                    return displaySlide;
                };
                this.makeTextElement = function (displayElementConfig, content) {
                    var rtfData = btoa(_this.rtfSvc.makeRtfData(displayElementConfig, content));
                    return "<RVTextElement displayDelay=\"0\" displayName=\"\" locked=\"0\" persistent=\"0\" typeID=\"0\" fromTemplate=\"0\" bezelRadius=\"0\" drawingFill=\"0\" drawingShadow=\"0\" drawingStroke=\"0\" fillColor=\"0 0 0 0\" rotation=\"0\" source=\"\" adjustsHeightToFit=\"1\" verticalAlignment=\"1\" RTFData=\"" + rtfData + "\" revealType=\"0\" serialization-array-index=\"0\">\n                <_-RVRect3D-_position x=\"" + displayElementConfig.posX + "\" y=\"" + displayElementConfig.posY + "\" z=\"0\" width=\"" + displayElementConfig.width + "\" height=\"" + displayElementConfig.height + "\" />\n                <_-D-_serializedShadow containerClass=\"NSMutableDictionary\">\n                    <NSMutableString serialization-native-value=\"{5, -5}\" serialization-dictionary-key=\"shadowOffset\" />\n                    <NSNumber serialization-native-value=\"0\" serialization-dictionary-key=\"shadowBlurRadius\" />\n                    <NSColor serialization-native-value=\"0 0 0 0.3333333432674408\" serialization-dictionary-key=\"shadowColor\" />\n                </_-D-_serializedShadow>\n                <stroke containerClass=\"NSMutableDictionary\">\n                    <NSColor serialization-native-value=\"0 0 0 1\" serialization-dictionary-key=\"RVShapeElementStrokeColorKey\" />\n                    <NSNumber serialization-native-value=\"1\" serialization-dictionary-key=\"RVShapeElementStrokeWidthKey\" />\n                </stroke>\n            </RVTextElement>";
                };
                this.generateUuid = function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                    }
                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                };
            }
            ProPresenterDocService.$inject = ["richTextFormatterService", "colorService"];
            return ProPresenterDocService;
        }());
        Services.ProPresenterDocService = ProPresenterDocService;
        angular
            .module(TxtToPp.appModuleName)
            .service("proPresenterDocService", ProPresenterDocService);
    })(Services = TxtToPp.Services || (TxtToPp.Services = {}));
})(TxtToPp || (TxtToPp = {}));
var TxtToPp;
(function (TxtToPp) {
    var Services;
    (function (Services) {
        var RichTextFormatterService = (function () {
            function RichTextFormatterService() {
                this.makeRtfData = function (displayElementConfig, content) {
                    return "{\\rtf1\\ansi\\ansicpg1252\\cocoartf1404\\cocoasubrtf340\n\\cocoascreenfonts1{\\fonttbl\\f0\\fnil\\fcharset0 " + displayElementConfig.fontName + ";}\n{\\colortbl;\\red" + displayElementConfig.color.r + "\\green" + displayElementConfig.color.g + "\\blue" + displayElementConfig.color.b + ";}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\pardirnatural\n\n\\f0\\fs180 \\cf1 " + content + "}";
                };
            }
            return RichTextFormatterService;
        }());
        Services.RichTextFormatterService = RichTextFormatterService;
        angular
            .module(TxtToPp.appModuleName)
            .service("richTextFormatterService", RichTextFormatterService);
    })(Services = TxtToPp.Services || (TxtToPp.Services = {}));
})(TxtToPp || (TxtToPp = {}));
var TxtToPp;
(function (TxtToPp) {
    var Services;
    (function (Services) {
        var ColorService = (function () {
            function ColorService() {
                var _this = this;
                this.hexToRgbColor = function (hex) {
                    hex = hex.replace('#', '');
                    return {
                        r: (parseInt(hex.substring(0, 2), 16) || 0),
                        g: (parseInt(hex.substring(2, 4), 16) || 0),
                        b: (parseInt(hex.substring(4, 6), 16) || 0)
                    };
                };
                this.rgbToHexColor = function (rgbColor) {
                    var r = ("0" + rgbColor.r.toString(16)).slice(-2);
                    var g = ("0" + rgbColor.g.toString(16)).slice(-2);
                    var b = ("0" + rgbColor.b.toString(16)).slice(-2);
                    return "#" + r + g + b;
                };
                this.rgbToFloatRgbaColor = function (rgbColor) {
                    return _this.byteToFloat(rgbColor.r) + " " + _this.byteToFloat(rgbColor.g) + " " + _this.byteToFloat(rgbColor.b) + " 1";
                };
                this.floatRgbaToRgbColor = function (rgbaFloatColor) {
                    var colorParts = rgbaFloatColor.split(" ");
                    return {
                        r: _this.floatToByte(parseFloat(colorParts[0])),
                        g: _this.floatToByte(parseFloat(colorParts[1])),
                        b: _this.floatToByte(parseFloat(colorParts[2]))
                    };
                };
                this.floatToByte = function (f) {
                    var f2 = Math.max(0, Math.min(1, f));
                    return Math.floor(f2 * 255);
                };
                this.byteToFloat = function (b) {
                    var b2 = Math.max(0, Math.min(255, b));
                    return b2 === 255 ? 1 : b2 / 255;
                };
            }
            return ColorService;
        }());
        Services.ColorService = ColorService;
        angular
            .module(TxtToPp.appModuleName)
            .service("colorService", ColorService);
    })(Services = TxtToPp.Services || (TxtToPp.Services = {}));
})(TxtToPp || (TxtToPp = {}));
var TxtToPp;
(function (TxtToPp) {
    var Widgets;
    (function (Widgets) {
        function documentConfigurationDirective($window, colorService) {
            var storageKey = "documentConfig";
            var db = $window.localStorage;
            function linkFn($scope) {
                var savedConfig = undefined;
                if (db) {
                    var savedFileConfigStr = db.getItem(storageKey);
                    if (savedFileConfigStr) {
                        savedConfig = JSON.parse(savedFileConfigStr);
                    }
                    $scope.$watch("config", function (val) {
                        if (val) {
                            db.setItem(storageKey, JSON.stringify(val));
                        }
                    }, true);
                }
                if (savedConfig) {
                    $scope.config = savedConfig;
                }
                else {
                    $scope.config = {
                        category: "Speaker Notes",
                        bgColor: { r: 8, g: 58, b: 119 },
                        displayElementConfigs: {
                            slideContent: {
                                color: { r: 255, g: 255, b: 255 },
                                fontName: "Futura-Medium",
                                height: 319.1484,
                                posX: 56.26352,
                                posY: 145,
                                width: 1182.772
                            },
                            slideTitle: {
                                color: { r: 255, g: 255, b: 255 },
                                fontName: "Futura-Medium",
                                height: 118.6807,
                                posX: 29.04599,
                                posY: 2,
                                width: 1221.908
                            }
                        },
                        height: 720,
                        title: "test",
                        width: 1280
                    };
                }
            }
            return {
                link: linkFn,
                restrict: "E",
                scope: {
                    config: "="
                },
                templateUrl: "app/widgets/document-configuration.tmpl.html"
            };
        }
        documentConfigurationDirective.$inject = ["$window", "colorService"];
        angular
            .module(TxtToPp.appModuleName)
            .directive("angDocumentConfiguration", documentConfigurationDirective);
    })(Widgets = TxtToPp.Widgets || (TxtToPp.Widgets = {}));
})(TxtToPp || (TxtToPp = {}));
var TxtToPp;
(function (TxtToPp) {
    var Widgets;
    (function (Widgets) {
        function colorPickerDirective($window, colorService) {
            function supportsColorInput() {
                var i = $window.document.createElement("input");
                i.setAttribute("type", "color");
                return i.type !== "text";
            }
            function linkFn($scope) {
                $scope.id = "color-" + Math.random().toString(36).substr(2, 5);
                $scope.hasColorSupport = supportsColorInput();
                var colorWatcher = $scope.$watch("color", function () {
                    $scope.hexColor = colorService.rgbToHexColor($scope.color);
                    colorWatcher();
                });
                $scope.$watch("hexColor", function (val) {
                    if (val) {
                        $scope.color = colorService.hexToRgbColor(val);
                    }
                });
            }
            return {
                link: linkFn,
                restrict: "E",
                scope: {
                    color: "=",
                    title: "@"
                },
                template: "<div class=\"form-group\">\n    <label ng-attr-for=\"{{::id}}\">{{title}}</label>\n    <div class=\"row\">\n        <div class=\"col-xs-6 col-sm-3\" ng-if=\"::hasColorSupport\">\n            <input type=\"color\" class=\"form-control\" ng-model=\"hexColor\" ng-attr-id=\"{{::id}}\">\n        </div>\n        <div ng-class=\"hasColorSupport ? 'col-xs-6 col-sm-9' : 'col-xs-12'\">\n            <input type=\"text\" class=\"form-control\" ng-model=\"hexColor\" ng-attr-id=\"{{::(hasColorSupport ? '' : id)}}\">\n        </div>    \n    </div>\n</div>"
            };
        }
        colorPickerDirective.$inject = ["$window", "colorService"];
        angular
            .module(TxtToPp.appModuleName)
            .directive("angColorPicker", colorPickerDirective);
    })(Widgets = TxtToPp.Widgets || (TxtToPp.Widgets = {}));
})(TxtToPp || (TxtToPp = {}));

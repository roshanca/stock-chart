var StockChart;
(function (StockChart) {
    var Chart = (function () {
        function Chart(options) {
            this.canvas = document.getElementById(options.id);
            this.width = options.width || document.body.clientWidth;
            this.height = options.height;
            this.textOffsetY = options.textOffsetY || 2;
            this.figureOffsetY = options.figureOffsetY || 20;
            this.volumeHeight = options.volumeHeight || 30;
            this.axisTextHeight = options.axisTextHeight || 10;
            this.figureWidth = this.width;
            this.figureHeight = this.height - this.volumeHeight - this.axisTextHeight;
            this.figureOffsetHeight = this.figureHeight - this.figureOffsetY;
            this.grid = options.grid;
            this.font = options.font || '10px Helvetica';
            this.textColor = options.textColor || 'rgba(138,138,138,1)';
            this.lineColor = options.lineColor || 'rgba(94,168,199,1)';
        }
        Chart.prototype.initContext = function () {
            var dpr = Math.max(window.devicePixelRatio || 1, 1);
            var ctx = this.canvas.getContext('2d');
            if (dpr !== 1) {
                ctx.scale(dpr, dpr);
            }
            this.ctx = ctx;
            this.dpr = dpr;
        };
        Chart.prototype.initialize = function () {
            this.initContext();
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';
            this.canvas.width = this.width * this.dpr;
            this.canvas.height = this.height * this.dpr;
        };
        Chart.prototype.drawLine = function (line, needStroke) {
            if (needStroke === void 0) { needStroke = true; }
            var _a = this, ctx = _a.ctx, dpr = _a.dpr;
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.size * dpr || 0;
            ctx.moveTo(line.startPoint[0] * dpr, line.startPoint[1] * dpr);
            line.points.forEach(function (point) {
                ctx.lineTo(point[0] * dpr, point[1] * dpr);
            });
            if (needStroke) {
                ctx.stroke();
            }
        };
        Chart.prototype.drawDashedLine = function (p1, p2, size) {
            if (size === void 0) { size = 2; }
            var _a = this, ctx = _a.ctx, dpr = _a.dpr;
            var diffX = p2[0] - p1[0];
            var diffY = p2[1] - p1[1];
            var dashes = Math.floor(Math.sqrt(diffX * diffX + diffY * diffY) / size);
            var dashX = diffX / dashes;
            var dashY = diffY / dashes;
            var q = 0;
            ctx.moveTo(p1[0] * dpr, p1[1] * dpr);
            while (q++ < dashes) {
                p1[0] += dashX;
                p1[1] += dashY;
                ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](p1[0] * dpr, p1[1] * dpr);
            }
            ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](p2[0] * dpr, p2[1] * dpr);
        };
        Chart.prototype.drawText = function (text, point, textColor) {
            if (textColor === void 0) { textColor = this.textColor; }
            var _a = this, ctx = _a.ctx, dpr = _a.dpr;
            ctx.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, function (matched, m1, m2) {
                return m1 * dpr + m2;
            });
            ctx.fillStyle = textColor;
            ctx.fillText(text, point[0] * dpr, point[1] * dpr);
        };
        Chart.prototype.drawRound = function (round) {
            var _a = this, ctx = _a.ctx, dpr = _a.dpr;
            ctx.beginPath();
            ctx.arc(round.point[0] * dpr, round.point[1] * dpr, round.radius * dpr, 0, 2 * Math.PI);
            ctx.closePath();
            if (round.isStroke) {
                ctx.strokeStyle = round.borderColor;
                ctx.stroke();
            }
            if (round.isFill) {
                ctx.fillStyle = round.fillColor;
                ctx.fill();
            }
        };
        return Chart;
    }());
    StockChart.Chart = Chart;
})(StockChart || (StockChart = {}));
var StockChart;
(function (StockChart) {
    function mixins(target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var output = Object(target);
        for (var index = 0; index < sources.length; index++) {
            var source = sources[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    }
    StockChart.mixins = mixins;
    function arrayObjectIndexOf(array, property, expectedValue) {
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (array[i][property] === expectedValue) {
                return i;
            }
        }
        return -1;
    }
    StockChart.arrayObjectIndexOf = arrayObjectIndexOf;
})(StockChart || (StockChart = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var StockChart;
(function (StockChart) {
    var Period;
    (function (Period) {
        Period[Period["Day"] = 0] = "Day";
        Period[Period["Week"] = 1] = "Week";
        Period[Period["Month"] = 2] = "Month";
    })(Period || (Period = {}));
    var MAColors;
    (function (MAColors) {
        MAColors[MAColors["Yellow"] = 0] = "Yellow";
        MAColors[MAColors["Blue"] = 1] = "Blue";
        MAColors[MAColors["Pink"] = 2] = "Pink";
        MAColors[MAColors["Green"] = 3] = "Green";
    })(MAColors || (MAColors = {}));
    var COLOR = {
        YELLOW: 'rgba(219,169,83,.5)',
        BLUE: 'rgba(99,179,243,.5)',
        PINK: 'rgba(223,140,201,.5)',
        GREEN: 'rgba(151,192,57,.5)'
    };
    var KLine = (function (_super) {
        __extends(KLine, _super);
        function KLine(options) {
            _super.call(this, options);
            this.ohlcPrices = options.ohlcPrices;
            this.volumes = options.volumes;
            this.dates = options.dates;
            this.dataCount = options.dataCount;
            this.volumeTopHeight = this.height - this.volumeHeight + this.textOffsetY;
            this.unitX = this.figureWidth / this.dataCount;
            this.riseColor = options.riseColor;
            this.fallColor = options.fallColor;
            this.period = options.period;
            this.maLists = options.maLists;
        }
        KLine.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.drawGrid();
            this.drawPriceBar();
            this.drawMaLines();
            this.drawVolumeBar();
            this.drawAxisYText();
        };
        KLine.prototype.drawGrid = function () {
            var _a = this, ctx = _a.ctx, grid = _a.grid, height = _a.height, figureWidth = _a.figureWidth, figureHeight = _a.figureHeight, figureOffsetHeight = _a.figureOffsetHeight, figureOffsetY = _a.figureOffsetY, volumeTopHeight = _a.volumeTopHeight;
            ctx.beginPath();
            this.drawLine({
                color: grid.color,
                startPoint: [0, this.figureHeight],
                points: [[figureWidth, figureHeight]]
            }, false);
            this.drawLine({
                color: grid.color,
                startPoint: [0, volumeTopHeight],
                points: [[figureWidth, volumeTopHeight]]
            }, false);
            this.drawLine({
                color: grid.color,
                startPoint: [0, 0],
                points: [[figureWidth, 0]]
            }, false);
            this.drawLine({
                color: grid.color,
                startPoint: [0, this.height],
                points: [[figureWidth, height]]
            });
            var gridY = figureOffsetHeight / grid.y;
            for (var i = 0; i < grid.y; i++) {
                ctx.beginPath();
                this.drawLine({
                    color: grid.color,
                    startPoint: [0, gridY * i + figureOffsetY],
                    points: [[figureWidth, gridY * i + figureOffsetY]]
                });
            }
            this.drawGridX();
        };
        KLine.prototype.drawPriceBar = function () {
            var _a = this, ctx = _a.ctx, ohlcPrices = _a.ohlcPrices, dataCount = _a.dataCount, figureHeight = _a.figureHeight, figureOffsetHeight = _a.figureOffsetHeight;
            var len = ohlcPrices.length;
            var count = Math.min(len, dataCount);
            var highPrices = ohlcPrices.map(function (price) {
                return price.h;
            });
            var lowPrices = ohlcPrices.map(function (price) {
                return price.l;
            });
            var maxPrice = Math.max.apply(null, highPrices);
            var minPrice = Math.min.apply(null, lowPrices);
            var unitX = this.unitX;
            var unitY = this.unitY = (figureOffsetHeight - 10) / (maxPrice - minPrice);
            this.roofPrice = maxPrice;
            this.floorPrice = minPrice;
            var calcY = this.calcY = function (price) {
                return Math.round(figureHeight - Math.abs(price - minPrice) * unitY - 10);
            };
            for (var i = 0; i < count; i++) {
                var openPrice = ohlcPrices[i].o;
                var highPrice = ohlcPrices[i].h;
                var lowPrice = ohlcPrices[i].l;
                var closePrice = ohlcPrices[i].c;
                var barX = unitX * i + unitX / 2;
                var barColor = this.getBarColor(ohlcPrices, i);
                ctx.beginPath();
                this.drawLine({
                    color: barColor,
                    size: 1,
                    startPoint: [barX, calcY(highPrice)],
                    points: [[barX, calcY(lowPrice)]]
                });
                ctx.beginPath();
                if (calcY(openPrice) === calcY(closePrice)) {
                    this.drawLine({
                        color: barColor,
                        size: 1,
                        startPoint: [barX - 2, calcY(openPrice)],
                        points: [[barX + 2, calcY(closePrice)]]
                    });
                }
                else {
                    this.drawLine({
                        color: barColor,
                        size: 4,
                        startPoint: [barX, calcY(openPrice)],
                        points: [[barX, calcY(closePrice)]]
                    });
                }
            }
        };
        KLine.prototype.drawVolumeBar = function () {
            var _a = this, ctx = _a.ctx, volumes = _a.volumes, ohlcPrices = _a.ohlcPrices, dataCount = _a.dataCount, height = _a.height, volumeHeight = _a.volumeHeight, textOffsetY = _a.textOffsetY, unitX = _a.unitX;
            var len = volumes.length;
            var count = Math.min(len, dataCount);
            var maxVolume = Math.max.apply(null, volumes);
            var minVolume = Math.min.apply(null, volumes);
            if (maxVolume === minVolume) {
                minVolume = maxVolume - 1;
            }
            var volumeUnitY = (volumeHeight - textOffsetY) / (maxVolume - minVolume);
            var currentVolumeHeight;
            for (var i = 0; i < count; i++) {
                var barX = unitX * i + unitX / 2;
                currentVolumeHeight = Math.round(height - (volumes[i] - minVolume) * volumeUnitY);
                if (currentVolumeHeight === height) {
                    currentVolumeHeight = height - 1;
                }
                ctx.beginPath();
                this.drawLine({
                    color: this.getBarColor(ohlcPrices, i),
                    size: 4,
                    startPoint: [barX, height],
                    points: [[barX, currentVolumeHeight]]
                });
            }
        };
        KLine.prototype.drawMaLines = function () {
            var _this = this;
            var maLists = this.maLists;
            if (!maLists.length) {
                return;
            }
            maLists.forEach(function (maList) {
                _this.drawMaLine(maList);
            });
            this.drawMaLegend();
        };
        KLine.prototype.drawMaLine = function (maList) {
            var _a = this, ctx = _a.ctx, unitX = _a.unitX, calcY = _a.calcY, roofPrice = _a.roofPrice;
            var len = maList.prices.length;
            var count = Math.min(len, this.dataCount);
            var points;
            var maColor;
            if (count === 0) {
                return;
            }
            maColor = this.getMaColor(maList);
            points = maList.prices.map(function (price, index) {
                return [unitX * index, price > roofPrice ? NaN : calcY(price)];
            });
            ctx.beginPath();
            this.drawLine({
                color: maColor,
                size: 1,
                startPoint: points.splice(0, 1)[0],
                points: points
            });
        };
        KLine.prototype.getMaColor = function (maList) {
            var maColor;
            if (typeof maList.color === 'undefined') {
                var index = StockChart.arrayObjectIndexOf(this.maLists, 'title', maList.title);
                maColor = COLOR[MAColors[index].toUpperCase()];
            }
            else if (typeof maList.color === 'number') {
                maColor = COLOR[MAColors[maList.color].toUpperCase()];
            }
            else {
                maColor = maList.color.toString();
            }
            return maColor;
        };
        KLine.prototype.drawMaLegend = function () {
            var _a = this, ctx = _a.ctx, dpr = _a.dpr, maLists = _a.maLists, figureWidth = _a.figureWidth, figureOffsetY = _a.figureOffsetY;
            var len = maLists.length;
            var dot = {
                radius: 3,
                paddingLeft: 10,
                paddingRight: 3
            };
            var text;
            var textWidth;
            var prices;
            var lastPrice;
            for (var i = len - 1, textWidth_1 = 0; i >= 0; i--) {
                var title = maLists[i].title;
                ctx.font = this.font;
                prices = maLists[i].prices.filter(function (price) {
                    return Boolean(price);
                });
                if (!prices.length) {
                    continue;
                }
                lastPrice = prices[prices.length - 1];
                text = title + "  " + lastPrice;
                textWidth_1 += ctx.measureText(text).width;
                this.drawText(text, [figureWidth - textWidth_1, figureOffsetY - 5]);
                this.drawRound({
                    point: [figureWidth - textWidth_1 - dot.radius - dot.paddingRight, figureOffsetY - 5 - dot.radius],
                    radius: dot.radius,
                    isFill: true,
                    fillColor: this.getMaColor(maLists[i])
                });
                textWidth_1 += dot.radius * 2 + dot.paddingLeft + dot.paddingRight;
            }
        };
        KLine.prototype.drawAxisYText = function () {
            this.drawText(this.roofPrice.toFixed(2), [0, this.figureOffsetY - this.textOffsetY]);
            this.drawText(this.floorPrice.toFixed(2), [0, this.figureHeight - this.textOffsetY]);
        };
        KLine.prototype.drawGridX = function () {
            var _this = this;
            var _a = this, ctx = _a.ctx, dataCount = _a.dataCount, period = _a.period;
            var dates = this.dates;
            var len = dates.length;
            var count = Math.min(len, dataCount);
            if (count <= 2) {
                return;
            }
            ctx.beginPath();
            switch (Period[period]) {
                case 'Week':
                    var uniqDates = [];
                    var weekDates = [];
                    for (var i = 2; i < count - 2; i++) {
                        if (dates[i] !== dates[i - 1]) {
                            uniqDates.push({
                                text: dates[i],
                                index: i
                            });
                        }
                    }
                    weekDates = uniqDates.filter(function (date, index) {
                        return !(index % 3);
                    });
                    if (!weekDates.length) {
                        return;
                    }
                    weekDates.forEach(function (date) {
                        _this.drawGridTextX(date.text, date.index);
                    });
                    break;
                case 'Month':
                    var monthDates = [];
                    dates = dates.map(function (date) {
                        return date.split('-')[0];
                    });
                    for (var i = 2; i < count - 2; i++) {
                        if (dates[i] !== dates[i - 1]) {
                            monthDates.push({
                                text: dates[i],
                                index: i
                            });
                        }
                    }
                    monthDates.forEach(function (date) {
                        _this.drawGridTextX(date.text, date.index);
                    });
                    break;
                default:
                    var dayDates = [];
                    for (var i = 2; i < count - 2; i++) {
                        if (dates[i] !== dates[i - 1]) {
                            dayDates.push({
                                text: dates[i],
                                index: i
                            });
                        }
                    }
                    for (var j = 1; j < dayDates.length; j++) {
                        if (dayDates[j].index - dayDates[j - 1].index < 7) {
                            dayDates.splice(j, 1);
                        }
                    }
                    dayDates.forEach(function (date) {
                        _this.drawGridTextX(date.text, date.index);
                    });
                    break;
            }
        };
        KLine.prototype.drawGridTextX = function (date, index) {
            var _a = this, grid = _a.grid, dataCount = _a.dataCount, height = _a.height, volumeHeight = _a.volumeHeight, figureWidth = _a.figureWidth, figureHeight = _a.figureHeight, figureOffsetY = _a.figureOffsetY;
            var unitX = figureWidth / dataCount;
            var axisY = height - volumeHeight;
            var barX = unitX * index + unitX / 2;
            this.drawText(date, [unitX * index - 15, axisY]);
            this.drawLine({
                color: grid.color,
                startPoint: [barX, figureOffsetY],
                points: [[barX, figureHeight]]
            });
        };
        KLine.prototype.getBarColor = function (bars, index) {
            var _a = this, riseColor = _a.riseColor, fallColor = _a.fallColor;
            var openPrice = bars[index].o;
            var closePrice = bars[index].c;
            if (closePrice > openPrice) {
                return riseColor;
            }
            else if (closePrice < openPrice) {
                return fallColor;
            }
            else {
                if (index === 0) {
                    return 'black';
                }
                else {
                    var preClosePrice = bars[index - 1].c;
                    return closePrice > preClosePrice ? riseColor : fallColor;
                }
            }
        };
        return KLine;
    }(StockChart.Chart));
    function drawKLine(options) {
        var defaultOptions = {
            dataCount: 50,
            grid: {
                y: 4,
                color: 'rgba(221,221,221,1)'
            },
            lineColor: 'rgba(94,168,199,1)',
            volumeColor: 'rgba(130,152,200,1)',
            riseColor: 'rgba(252,63,29,1)',
            fallColor: 'rgba(85,170,48,1)',
            period: 0
        };
        options = StockChart.mixins({}, defaultOptions, options);
        var kLine = new KLine(options);
        kLine.initialize();
    }
    StockChart.drawKLine = drawKLine;
})(StockChart || (StockChart = {}));
var StockChart;
(function (StockChart) {
    var TrendLine = (function (_super) {
        __extends(TrendLine, _super);
        function TrendLine(options) {
            _super.call(this, options);
            this.preClosePrice = options.preClosePrice;
            this.prices = options.prices;
            this.volumes = options.volumes;
            this.avgPrices = options.avgPrices;
            this.fillColor = options.fillColor;
            this.middleLineColor = options.middleLineColor;
            this.volumeColor = options.volumeColor;
            this.avgLineColor = options.avgLineColor;
            this.isIndex = options.isIndex;
        }
        TrendLine.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.drawGrid();
            this.drawPriceLine();
            this.drawMiddleLine();
            this.drawVolumeLine();
            this.drawAxisText();
        };
        TrendLine.prototype.drawGrid = function () {
            var _a = this, ctx = _a.ctx, grid = _a.grid, height = _a.height, figureWidth = _a.figureWidth, figureHeight = _a.figureHeight, figureOffsetHeight = _a.figureOffsetHeight, figureOffsetY = _a.figureOffsetY;
            ctx.beginPath();
            this.drawLine({
                color: grid.color,
                startPoint: [0, figureHeight],
                points: [[figureWidth, figureHeight]]
            }, false);
            this.drawLine({
                color: grid.color,
                startPoint: [0, 0],
                points: [[figureWidth, 0]]
            }, false);
            var gridX = figureWidth / grid.x;
            for (var i = 1; i < grid.x; i++) {
                this.drawLine({
                    color: grid.color,
                    startPoint: [gridX * i, figureOffsetY],
                    points: [[gridX * i, figureHeight]]
                }, false);
            }
            var gridY = figureOffsetHeight / grid.y;
            for (var j = 0; j < grid.y; j++) {
                this.drawLine({
                    color: grid.color,
                    startPoint: [0, gridY * j + figureOffsetY],
                    points: [[figureWidth, gridY * j + figureOffsetY]]
                }, false);
            }
            this.drawLine({
                color: grid.color,
                startPoint: [0, height],
                points: [[figureWidth, height]]
            });
        };
        TrendLine.prototype.drawPriceLine = function () {
            var _this = this;
            var _a = this, ctx = _a.ctx, dpr = _a.dpr, figureWidth = _a.figureWidth, figureHeight = _a.figureHeight, figureOffsetHeight = _a.figureOffsetHeight, figureOffsetY = _a.figureOffsetY;
            var _b = this, prices = _b.prices, preClosePrice = _b.preClosePrice, avgPrices = _b.avgPrices, isIndex = _b.isIndex;
            var isFlat = false;
            var isSuspended = false;
            var maxPrice = Math.max.apply(null, prices);
            var minPrice = Math.min.apply(null, prices);
            var maxDiff = Math.abs(maxPrice - preClosePrice);
            var minDiff = Math.abs(preClosePrice - minPrice);
            var unitX = this.unitX = figureWidth / (60 * 4);
            var unitY;
            var calcY = function (price) {
                if (isSuspended) {
                    return figureOffsetHeight / 2 + figureOffsetY;
                }
                else if (isFlat) {
                    return figureOffsetY;
                }
                else {
                    return figureHeight - Math.abs(price - _this.floorPrice) * unitY;
                }
            };
            var calcPercent = function (price) {
                return ((price - preClosePrice) / preClosePrice * 100).toFixed(2) + '%';
            };
            var fillBlock = function () {
                ctx.strokeStyle = _this.fillColor;
                ctx.fillStyle = _this.fillColor;
                ctx.lineTo((prices.length - 1) * unitX * dpr, figureHeight * dpr);
                ctx.lineTo(0, figureHeight * dpr);
                ctx.lineTo(0, calcY(prices[0]) * dpr);
                ctx.fill();
                ctx.stroke();
            };
            if (maxPrice === minPrice) {
                isFlat = true;
            }
            if (maxDiff >= minDiff) {
                if (maxPrice !== preClosePrice) {
                    unitY = figureOffsetHeight / ((maxPrice - preClosePrice) * 2);
                    this.roofPrice = maxPrice;
                    this.floorPrice = preClosePrice * 2 - maxPrice;
                }
                else {
                    this.roofPrice = preClosePrice * 1.02;
                    this.floorPrice = preClosePrice * 0.98;
                    isSuspended = true;
                }
            }
            else {
                unitY = figureOffsetHeight / ((preClosePrice - minPrice) * 2);
                this.roofPrice = (preClosePrice - minPrice) * 2 + minPrice;
                this.floorPrice = minPrice;
            }
            this.roofPercent = isSuspended ? '2.00%' : calcPercent(this.roofPrice);
            this.floorPercent = isSuspended ? '-2.00%' : calcPercent(this.floorPrice);
            var points = [];
            for (var i = 0; i < prices.length; i++) {
                points.push([i * unitX, calcY(prices[i])]);
            }
            ctx.beginPath();
            this.drawLine({
                color: this.lineColor,
                size: 1,
                startPoint: [0, calcY(prices[0])],
                points: points
            });
            fillBlock();
            if (!isIndex && avgPrices) {
                var avgPricesPoints = [];
                for (var i = 0; i < avgPrices.length; i++) {
                    avgPricesPoints.push([i * unitX, calcY(avgPrices[i])]);
                }
                ctx.beginPath();
                this.drawLine({
                    color: this.avgLineColor,
                    size: 1,
                    startPoint: avgPricesPoints[0],
                    points: avgPricesPoints.slice(1, avgPricesPoints.length)
                });
            }
        };
        TrendLine.prototype.drawAxisText = function () {
            var _a = this, height = _a.height, figureWidth = _a.figureWidth, figureHeight = _a.figureHeight, figureOffsetHeight = _a.figureOffsetHeight, figureOffsetY = _a.figureOffsetY, textOffsetY = _a.textOffsetY, volumeHeight = _a.volumeHeight;
            var _b = this, roofPrice = _b.roofPrice, floorPrice = _b.floorPrice, preClosePrice = _b.preClosePrice, roofPercent = _b.roofPercent, floorPercent = _b.floorPercent;
            var axisY = height - volumeHeight;
            var roofY = figureOffsetY - textOffsetY;
            var floorY = figureHeight - textOffsetY;
            this.drawText('09:30', [0, axisY]);
            this.drawText('10:30', [figureWidth / 4 - 13, axisY]);
            this.drawText('11:30/13:00', [figureWidth / 2 - 25, axisY]);
            this.drawText('14:00', [(figureWidth / 4) * 3 - 13, axisY]);
            this.drawText('15:00', [figureWidth - 27, axisY]);
            this.drawText(roofPrice.toFixed(2), [0, roofY]);
            this.drawText(floorPrice.toFixed(2), [0, floorY]);
            this.drawText(preClosePrice.toFixed(2), [0, figureOffsetHeight / 2 + roofY]);
            this.drawText(roofPercent, [figureWidth - 35, roofY]);
            this.drawText(floorPercent, [figureWidth - 40, floorY]);
            this.drawText('0.00%', [figureWidth - 30, figureOffsetHeight / 2 + roofY]);
        };
        TrendLine.prototype.drawMiddleLine = function () {
            var _a = this, ctx = _a.ctx, figureWidth = _a.figureWidth, figureOffsetHeight = _a.figureOffsetHeight, figureOffsetY = _a.figureOffsetY;
            var middleY = figureOffsetHeight / 2 + figureOffsetY;
            ctx.beginPath();
            ctx.strokeStyle = this.middleLineColor;
            this.drawDashedLine([0, middleY], [figureWidth, middleY], 4);
            ctx.stroke();
        };
        TrendLine.prototype.drawVolumeLine = function () {
            var _a = this, ctx = _a.ctx, volumes = _a.volumes, volumeHeight = _a.volumeHeight, height = _a.height, textOffsetY = _a.textOffsetY, unitX = _a.unitX;
            var maxVolume = Math.max.apply(null, volumes);
            var minVolume = Math.min.apply(null, volumes);
            var volumeUnitY = (volumeHeight - textOffsetY) / (maxVolume - minVolume);
            for (var i = 0; i < volumes.length; i++) {
                ctx.beginPath();
                this.drawLine({
                    color: this.volumeColor,
                    size: 1,
                    startPoint: [unitX * i, height],
                    points: [[unitX * i, height - (volumes[i] - minVolume) * volumeUnitY]]
                });
            }
        };
        return TrendLine;
    }(StockChart.Chart));
    function drawTrendLine(options) {
        var defaultOptions = {
            grid: {
                x: 4,
                y: 4,
                color: 'rgba(221,221,221,1)'
            },
            fillColor: 'rgba(187,226,246,.5)',
            middleLineColor: 'rgba(112,179,215,1)',
            volumeColor: 'rgba(130,152,200,1)',
            avgLineColor: 'rgba(169,77,180,.5)'
        };
        options = StockChart.mixins({}, defaultOptions, options);
        var trendLine = new TrendLine(options);
        trendLine.initialize();
    }
    StockChart.drawTrendLine = drawTrendLine;
})(StockChart || (StockChart = {}));

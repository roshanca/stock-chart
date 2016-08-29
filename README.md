# stock-chart

既然是沪深两市的股票，就没必要写英文文档了╮(╯_╰)╭

- 分时支持均线量线
- K 线支持 MA 均线（可自定义多条）
- 样式主要参考蚂蚁聚宝与支付宝中的股票行情图，可定制

![分时](http://ww1.sinaimg.cn/large/550f5a78gw1f7407y0yj3j208w0fmgmx.jpg)

![K 线](http://ww1.sinaimg.cn/large/550f5a78gw1f740886eutj208w0frabl.jpg)

## 使用的例子

http://h5.vstock.cairenhui.com/

## 用法

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui">
</head>
<body>
  <canvas id="trendLine"></canvas>
  <canvas id="kLine"></canvas>

  <script src="path/to/js/stock-chart.js">
  <script>
    // 分时
    StockChart.drawTrendLine({
      id: 'trendLine',
      width: document.body.clientWidth - 20,
      height: 180,
      prices: prices,
      volumes: volumes,
      avgPrices: avgPrices,
      preClosePrice: 9.66
    });

    // K 线
    StockChart.drawKLine({
      id: 'kLine',
      width: document.body.clientWidth - 20,
      height: 180,
      ohlcPrices: ohlcPrices,
      volumes: volumes,
      dates: dates,
      maLists: [
        {
          title: 'MA5',
          prices: ma5Prices
        },
        {
          title: 'MA10',
          prices: ma10Prices
        },
        {
          title: 'MA20',
          prices: ma20Prices
        }
      ],
      period: 0
    });
  <script>
</body>
</html>
```

## 配置说明

### id {string}

canvas 元素的 id

### width {number}

图表宽度，默认是 body 宽度：`document.body.clientWidth`

### height {number}

图表高度

### volumes {number[]}

量线数据，例如：`[415200, 1616900, 753646, 717437, ... ]`

### volumeHeight {number}

量线图高度，默认值为 30

### figureOffsetY {number}

图表顶部留白，用与显示坐标文字等，默认值为 20

### textOffsetY {number}

文字垂直方向上的间隔，默认值为 2

### axisTextHeight {number}

横座标文本区域高度，默认值为 10

### grid {object}

由三个属性组成：

- x {number}: 横向网格线条数，默认为 4
- y {number}: 纵向网格线条数， 默认为 4
- color {string}: 网格线颜色，默认为 `rgba(221,221,221,1)`

### textColor {string}

普通文本字色，默认值为 `rgba(138,138,138,1)`

### lineColor {string}

普通线条颜色，默认值为 `rgba(94,168,199,1)`

**以上是一些公共的配置**

---

分时特有配置：

### prices {number[]}

价格数据，例如：`[9.8, 9.79, 9.76, 9.92, 10.14, 10.2, 10.1, ... ]` 

### avgPrices {number[]}

均线数据

### preClosePrice {number}

股票昨收价

### fillColor {string}

分时图价格曲线与横座标之间的填充色，默认值为 `rgba(187,226,246,.5)`

### volumeColor {string}

量线颜色，这里使用单色，默认值为 `rgba(130,152,200,1)`

### avgLineColor {string}

均线颜色，默认值为 `rgba(169,77,180,.5)`

### middleLineColor {string}

中间虚线（代表昨收价）的颜色，默认值为 `rgba(112,179,215,1)`

### isIndex {boolean}

是否为指数型股票，比如上证指数、深证成指、创业板指等，指数型股票的分时图默认不显示均线

---

K 线特有配置：

### ohlcPrices {object[]}

一组蜡烛图价格数据，单个蜡烛图价格由以下四个部分组成：

- o {number}: 开盘价
- h {number}: 最高价
- l {number}: 最低价
- c {number}: 收盘价

### dates {string []}

蜡烛图对应的日期数据，一般为 `["2016-06", "2016-06", "2016-07", ... ]` 这种形式

### dataCount {number}

K 线数据往往比较多，这里的 dataCount 为实际画图采用的数据点数，默认值为 50。当然，对于一些新股，数据少于 dataCount 的，会自动忽视 dataCount

### period {number}

- 0 为日 K
- 1 为周 K
- 2 为月 K

这里应该只是对横座标的显示和网格线有所影响

### maLists {object[]}

```
maLists: [
  {
    title: 'MA5',
    prices: ma5Prices
  },
  {
    title: 'MA10',
    prices: ma10Prices
  },
  {
    title: 'MA20',
    prices: ma20Prices
  }
]
```

可自定义均线，这里的 `ma5Prices`， `ma10Prices`，`ma20Prices` 为用户传入的均线数据，格式同分时的 `prices`

### riseColor {string}

遇涨股票的颜色，默认值为 `rgba(252,63,29,1)`

### fallColor {string}

遇跌股票的颜色，默认值为 `rgba(85,170,48,1)`

## Todos

- [ ] 复权与不复权切换
- [ ] 大屏优化
- [ ] touch 交互支持
- [ ] 动态描点（分时）

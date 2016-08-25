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

## 参数说明

待整理

## Todos

- [ ] 复权与不复权切换
- [ ] 大屏优化
- [ ] touch 交互支持
- [ ] 动态描点（分时）

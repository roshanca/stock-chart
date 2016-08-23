# stock-chart

股票分时 K 线图

![分时](http://ww1.sinaimg.cn/large/550f5a78gw1f7407y0yj3j208w0fmgmx.jpg)

![K 线](http://ww1.sinaimg.cn/large/550f5a78gw1f740886eutj208w0frabl.jpg)

## Example

http://h5.vstock.cairenhui.com/

## Usage

```html
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
```

## Options

## TODO

- [ ] 复权与不复权切换
- [ ] 大屏优化
- [ ] touch 交互支持
- [ ] 动态描点（分时）

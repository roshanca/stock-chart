/// <reference path="chart.ts" />
/// <reference path="utils.ts" />

module StockChart {

  interface ITrendlineOptions extends IChartOptions {
    preClosePrice: number
    prices: number[]
    volumes: number[]
    avgPrices: number[]
    fillColor: string
    middleLineColor: string
    volumeColor: string
    avgLineColor: string
  }

  /**
   * TrendLine
   */
  class TrendLine extends Chart {
    preClosePrice: number
    prices: number[]
    volumes: number[]
    avgPrices: number[]
    fillColor: string
    middleLineColor: string
    volumeColor: string
    avgLineColor: string
    unitX: number
    unitY: number
    roofPrice: number
    floorPrice: number
    roofPercent: string
    floorPercent: string

    constructor(options?: ITrendlineOptions) {
      super(options)

      this.preClosePrice = options.preClosePrice
      this.prices = options.prices
      this.volumes = options.volumes
      this.avgPrices = options.avgPrices
      this.fillColor = options.fillColor
      this.middleLineColor = options.middleLineColor
      this.volumeColor = options.volumeColor
      this.avgLineColor = options.avgLineColor
    }

    initialize() {
      super.initialize()

      this.drawGrid()
      this.drawPriceLine()
      this.drawMiddleLine()
      this.drawVolumeLine()
      this.drawAxisText()
    }

    private drawGrid() {
      const {ctx, grid, height, figureWidth, figureHeight, figureOffsetHeight, figureOffsetY} = this

      ctx.beginPath()

      // 横轴基线
      this.drawLine({
        color: grid.color,
        startPoint: [0, figureHeight],
        points: [[figureWidth, figureHeight]]
      }, false)

      // 图表顶部线
      this.drawLine({
        color: grid.color,
        startPoint: [0, 0],
        points: [[figureWidth, 0]]
      }, false)

      // 纵向网格
      const gridX = figureWidth / grid.x
      for (let i = 1; i < grid.x; i++) {
        this.drawLine({
          color: grid.color,
          startPoint: [gridX * i, figureOffsetY],
          points: [[gridX * i, figureHeight]]
        }, false)
      }

      // 横向网格
      const gridY = figureOffsetHeight / grid.y
      for (let j = 0; j < grid.y; j++) {
        this.drawLine({
          color: grid.color,
          startPoint: [0, gridY * j + figureOffsetY],
          points: [[figureWidth, gridY * j + figureOffsetY]]
        }, false)
      }

      // 图表底部线
      this.drawLine({
        color: grid.color,
        startPoint: [0, height],
        points: [[figureWidth, height]]
      })
    }

    private drawPriceLine() {
      const {ctx, dpr, figureWidth, figureHeight, figureOffsetHeight, figureOffsetY} = this
      const {prices, preClosePrice, avgPrices, isIndex} = this

      let isFlat: boolean = false

      // 股票最高价和最低价
      const maxPrice: number = Math.max.apply(null, prices)
      const minPrice: number = Math.min.apply(null, prices)

      const maxDiff = Math.abs(maxPrice - preClosePrice)
      const minDiff = Math.abs(preClosePrice - minPrice)

      // 横座标和纵座标的单位尺寸
      let unitX = this.unitX = figureWidth / (60 * 4)
      let unitY

      // 计算当前价所在纵轴坐标位置
      const calcY = (price: number): number => {
        return figureHeight - Math.abs(price - this.floorPrice) * unitY
      }

      const calcPercent = (price: number): string => {
        return ((price - preClosePrice) / preClosePrice * 100).toFixed(2) + '%';
      }

      const fillBlock = () => {
        ctx.strokeStyle = this.fillColor
        ctx.fillStyle = this.fillColor

        ctx.lineTo((prices.length - 1) * unitX * dpr, figureHeight * dpr)
        ctx.lineTo(0, figureHeight * dpr)
        ctx.lineTo(0, calcY(prices[0]) * dpr)
        ctx.fill()
        ctx.stroke()
      }

      if (maxPrice === minPrice) {
        isFlat = true
      }

      if (maxDiff >= minDiff) {
        unitY = figureOffsetHeight / ((maxPrice - preClosePrice) * 2)
        this.roofPrice = maxPrice
        this.floorPrice = this.preClosePrice * 2 - maxPrice
      } else {
        unitY = this.figureOffsetHeight / ((preClosePrice - minPrice) * 2)
        this.roofPrice = (preClosePrice - minPrice) * 2 + minPrice
        this.floorPrice = minPrice
      }

      // 价格的最高涨幅和最低跌幅
      this.roofPercent = calcPercent(this.roofPrice)
      this.floorPercent = calcPercent(this.floorPrice)

      // 绘制分时
      let points: Point[] = []
      for (let i = 0; i < prices.length; i++) {
        points.push([i * unitX, isFlat ? figureOffsetY : calcY(prices[i])])
      }

      ctx.beginPath()
      this.drawLine({
        color: this.lineColor,
        size: 1,
        startPoint: [0, calcY(prices[0])],
        points: points
      })
      fillBlock()

      // 绘制均线
      if (!isIndex && avgPrices) {
        let avgPricesPoints: Point[] = []
        for (let i = 0; i < avgPrices.length; i++) {
          avgPricesPoints.push([i * unitX, calcY(avgPrices[i])])
        }

        ctx.beginPath()
        this.drawLine({
          color: this.avgLineColor,
          size: 1,
          startPoint: avgPricesPoints[0],
          points: avgPricesPoints.slice(1, avgPricesPoints.length)
        })
      }
    }

    private drawAxisText() {
      const {height, figureWidth, figureHeight, figureOffsetHeight, figureOffsetY, textOffsetY, volumeHeight} = this
      const {roofPrice, floorPrice, preClosePrice, roofPercent, floorPercent} = this

      const axisY = height - volumeHeight
      const roofY = figureOffsetY - textOffsetY
      const floorY = figureHeight - textOffsetY

      // 分时横座标
      this.drawText('09:30', [0, axisY])
      this.drawText('10:30', [figureWidth / 4 - 13, axisY])
      this.drawText('11:30/13:00', [figureWidth / 2 - 25, axisY])
      this.drawText('14:00', [(figureWidth / 4) * 3 - 13, axisY])
      this.drawText('15:00', [figureWidth - 27, axisY])

      // 价格纵座标
      this.drawText(roofPrice.toFixed(2), [0, roofY])
      this.drawText(floorPrice.toFixed(2), [0, floorY])
      this.drawText(preClosePrice.toFixed(2), [0, figureOffsetHeight / 2 + roofY])
      this.drawText(roofPercent, [figureWidth - 35, roofY])
      this.drawText(floorPercent, [figureWidth - 40, floorY])
      this.drawText('0.00%', [figureWidth - 30, figureOffsetHeight / 2 + roofY])
    }

    private drawMiddleLine() {
      const {ctx, figureWidth, figureOffsetHeight, figureOffsetY} = this

      const middleY = figureOffsetHeight / 2 + figureOffsetY
      ctx.beginPath();
      ctx.strokeStyle = this.middleLineColor
      this.drawDashedLine([0, middleY], [figureWidth, middleY], 4)
      ctx.stroke()
    }

    private drawVolumeLine() {
      const {ctx, volumes, volumeHeight, height, textOffsetY, unitX} = this

      // 最大最小成交量
      const maxVolume = Math.max.apply(null, volumes)
      const minVolume = Math.min.apply(null, volumes)

      // 成交量的单位高度
      const volumeUnitY = (volumeHeight - textOffsetY) / (maxVolume - minVolume)

      for (let i = 0; i < volumes.length; i++) {
        ctx.beginPath()
        this.drawLine({
          color: this.volumeColor,
          size: 1,
          startPoint: [unitX * i, height],
          points: [[unitX * i, height - (volumes[i] - minVolume) * volumeUnitY]]
        })
      }
    }
  }

  export function drawTrendLine(options) {
    const defaultOptions = {
      grid: {
        x: 4,
        y: 4,
        color: 'rgba(221,221,221,1)'
      },
      fillColor: 'rgba(187,226,246,.5)',
      middleLineColor: 'rgba(112,179,215,1)',
      volumeColor: 'rgba(130,152,200,1)',
      avgLineColor: 'rgba(169,77,180,.5)'
    }
    options = mixins({}, defaultOptions, options)

    const trendLine = new TrendLine(options)
    trendLine.initialize()
  }
}

/// <reference path="chart.ts" />
/// <reference path="utils.ts" />

module StockChart {

  interface IKLineOptions extends IChartOptions {
    ohlcPrices: CandleBar[]
    volumes: number[]
    dates: string[]
    dataCount: number
    riseColor: string
    fallColor: string
    period: Period,
    maLists: MAList[]
  }

  type CandleBar = {
    o: number
    h: number
    l: number
    c: number
  }

  type AxisDate = {
    text: string
    index: number
  }

  type MAList = {
    title: string,
    color?: string | number,
    prices: number[]
  }

  enum Period { Day, Week, Month }
  enum MAColors {
    Yellow,
    Blue,
    Pink,
    Green
  }

  const COLOR = {
    YELLOW: 'rgba(219,169,83,.5)',
    BLUE: 'rgba(99,179,243,.5)',
    PINK: 'rgba(223,140,201,.5)',
    GREEN: 'rgba(151,192,57,.5)'
  }

  class KLine extends Chart {
    ohlcPrices: CandleBar[]
    volumes: number[]
    dates: string[]
    volumeTopHeight: number
    fillColor: string
    volumeColor: string
    unitX: number
    unitY: number
    roofPrice: number
    floorPrice: number
    dataCount: number
    riseColor: string
    fallColor: string
    period: Period
    maLists: MAList[]
    calcY: (price: number) => number

    constructor(options?: IKLineOptions) {
      super(options)

      this.ohlcPrices = options.ohlcPrices
      this.volumes = options.volumes
      this.dates = options.dates
      this.dataCount = options.dataCount
      this.volumeTopHeight = this.height - this.volumeHeight + this.textOffsetY
      this.unitX = this.figureWidth / this.dataCount
      this.riseColor = options.riseColor
      this.fallColor = options.fallColor
      this.period = options.period
      this.maLists = options.maLists
    }

    initialize() {
      super.initialize()

      this.drawGrid()
      this.drawPriceBar()
      this.drawMaLines()
      this.drawVolumeBar()
      this.drawAxisYText()
    }

    private drawGrid() {
      const {ctx, grid, height, figureWidth, figureHeight, figureOffsetHeight, figureOffsetY, volumeTopHeight} = this
      ctx.beginPath()

      // 横轴基线
      this.drawLine({
        color: grid.color,
        startPoint: [0, this.figureHeight],
        points: [[figureWidth, figureHeight]]
      }, false)

      // 量图顶部线
      this.drawLine({
        color: grid.color,
        startPoint: [0, volumeTopHeight],
        points: [[figureWidth, volumeTopHeight]]
      }, false)

      // 图表顶部线
      this.drawLine({
        color: grid.color,
        startPoint: [0, 0],
        points: [[figureWidth, 0]]
      }, false)

      // 图表底部线
      this.drawLine({
        color: grid.color,
        startPoint: [0, this.height],
        points: [[figureWidth, height]]
      })

      // 横向网格
      const gridY = figureOffsetHeight / grid.y
      for (let i = 0; i < grid.y; i++) {
        ctx.beginPath()
        this.drawLine({
          color: grid.color,
          startPoint: [0, gridY * i + figureOffsetY],
          points: [[figureWidth, gridY * i + figureOffsetY]]
        })
      }

      this.drawGridX()
    }

    private drawPriceBar() {
      const {ctx, ohlcPrices, dataCount, figureHeight, figureOffsetHeight} = this

      const len = ohlcPrices.length
      const count = Math.min(len, dataCount)

      const highPrices = ohlcPrices.map((price: CandleBar) => {
        return price.h
      })

      const lowPrices = ohlcPrices.map((price: CandleBar) => {
        return price.l
      })

      let maxPrice = Math.max.apply(null, highPrices)
      let minPrice = Math.min.apply(null, lowPrices)

      const unitX = this.unitX
      const unitY = this.unitY = (figureOffsetHeight - 10) / (maxPrice - minPrice)

      this.roofPrice = maxPrice
      // this.floorPrice = (minPrice * unitY - 10) / unitY
      this.floorPrice = minPrice

      // 计算当前价所在纵轴坐标位置
      const calcY = this.calcY = (price: number): number => {
        return Math.round(figureHeight - Math.abs(price - minPrice) * unitY - 10)
      }

      // 绘制 K 线
      for (let i = 0; i < count; i++) {
        const openPrice = ohlcPrices[i].o
        const highPrice = ohlcPrices[i].h
        const lowPrice = ohlcPrices[i].l
        const closePrice = ohlcPrices[i].c
        const barX = unitX * i + unitX / 2
        const barColor = this.getBarColor(ohlcPrices, i)

        ctx.beginPath()
        this.drawLine({
          color: barColor,
          size: 1,
          startPoint: [barX, calcY(highPrice)],
          points: [[barX, calcY(lowPrice)]]
        })

        ctx.beginPath()
        if (calcY(openPrice) === calcY(closePrice)) {
          this.drawLine({
            color: barColor,
            size: 1,
            startPoint: [barX - 2, calcY(openPrice)],
            points: [[barX + 2, calcY(closePrice)]]
          })
        } else {
          this.drawLine({
            color: barColor,
            size: 4,
            startPoint: [barX, calcY(openPrice)],
            points: [[barX, calcY(closePrice)]]
          })
        }
      }
    }

    private drawVolumeBar() {
      const {ctx, volumes, ohlcPrices, dataCount, height, volumeHeight, textOffsetY, unitX} = this
      const len = volumes.length
      const count = Math.min(len, dataCount)

      let maxVolume = Math.max.apply(null, volumes)
      let minVolume = Math.min.apply(null, volumes)

      if (maxVolume === minVolume) {
        minVolume = maxVolume - 1
      }

      const volumeUnitY = (volumeHeight - textOffsetY) / (maxVolume - minVolume)

      let currentVolumeHeight
      for (let i = 0; i < count; i++) {
        const barX = unitX * i + unitX / 2
        currentVolumeHeight = Math.round(height - (volumes[i] - minVolume) * volumeUnitY)

        if (currentVolumeHeight === height) {
          currentVolumeHeight = height - 1
        }

        ctx.beginPath()
        this.drawLine({
          color: this.getBarColor(ohlcPrices, i),
          size: 4,
          startPoint: [barX, height],
          points: [[barX, currentVolumeHeight]]
        })
      }
    }

    private drawMaLines() {
      const {maLists} = this

      if (!maLists.length) {
        return
      }

      maLists.forEach((maList: MAList) => {
        this.drawMaLine(maList)
      })

      this.drawMaTooltip()
    }

    private drawMaLine(maList: MAList) {
      const {ctx, unitX, calcY, roofPrice} = this

      const len = maList.prices.length
      const count = Math.min(len, this.dataCount)

      let points: Point[]
      let maColor: string

      if (count === 0) {
        return
      }

      maColor = this.getMaColor(maList)

      points = maList.prices.map((price: number, index: number): Point => {
        return [unitX * index, price > roofPrice ? NaN : calcY(price)]
      })

      ctx.beginPath()
      this.drawLine({
        color: maColor,
        size: 1,
        startPoint: points.splice(0, 1)[0],
        points: points
      })
    }

    private getMaColor(maList) {
      let maColor

      if (typeof maList.color === 'undefined') {
        const index = arrayObjectIndexOf(this.maLists, 'title', maList.title)
        maColor = COLOR[MAColors[index].toUpperCase()]
      } else if (typeof maList.color === 'number') {
        maColor = COLOR[MAColors[maList.color].toUpperCase()]
      } else {
        maColor = maList.color.toString()
      }

      return maColor
    }

    private drawMaTooltip() {
      const {ctx, dpr, maLists, figureWidth, figureOffsetY} = this

      const len = maLists.length
      const dot = {
        radius: 3,
        paddingLeft: 10,
        paddingRight: 3
      }

      let text: string
      let textWidth: number
      let prices: number[]
      let lastPrice: number

      for (let i = len - 1, textWidth = 0; i >= 0; i--) {
        const title = maLists[i].title
        ctx.font = this.font

        // 去除空数据，这里的空数据指的是 NaN
        prices = maLists[i].prices.filter((price) => {
          return Boolean(price)
        })

        if (!prices.length) {
          continue
        }

        lastPrice = prices[prices.length - 1]
        text = `${title}  ${lastPrice}`
        textWidth += (ctx.measureText(text).width)

        this.drawText(text, [figureWidth - textWidth, figureOffsetY - 5])
        this.drawRound({
          point: [figureWidth - textWidth - dot.radius - dot.paddingRight, figureOffsetY - 5 - dot.radius],
          radius: dot.radius,
          isFill: true,
          fillColor: this.getMaColor(maLists[i])
        })
        textWidth += dot.radius * 2 + dot.paddingLeft + dot.paddingRight
      }
    }

    private drawAxisYText() {
      this.drawText(this.roofPrice.toFixed(2), [0, this.figureOffsetY - this.textOffsetY])
      this.drawText(this.floorPrice.toFixed(2), [0, this.figureHeight - this.textOffsetY])
    }

    private drawGridX() {
      const {ctx, dataCount, period} = this
      let {dates} = this

      const len = dates.length
      const count = Math.min(len, dataCount)

      // 最前两点不显示横座标，因为显示不下
      if (count <= 2) {
        return
      }

      // 重新开辟绘画路径，避免横向网格线变粗
      ctx.beginPath()

      switch (Period[period]) {

        // 周 K
        case 'Week':
          let uniqDates: AxisDate[] = []
          let weekDates: AxisDate[] = []
          for (let i = 2; i < count - 2; i++) {
            if (dates[i] !== dates[i - 1]) {
              uniqDates.push({
                text: dates[i],
                index: i
              })
            }
          }

          weekDates = uniqDates.filter((date, index) => {
            return !(index % 3)
          })

          if (!weekDates.length) {
            return
          }

          weekDates.forEach((date) => {
            this.drawGridTextX(date.text, date.index)
          })

          break

        // 月 K
        case 'Month':
          let monthDates: AxisDate[] = []
          dates = dates.map((date) => {
            return date.split('-')[0]
          })

          for (let i = 2; i < count - 2; i++) {
            if (dates[i] !== dates[i - 1]) {
              monthDates.push({
                text: dates[i],
                index: i
              })
            }
          }

          monthDates.forEach((date) => {
            this.drawGridTextX(date.text, date.index)
          })

          break

        // 默认 Period 为 'Day' 为日 K
        default:
          let dayDates: AxisDate[] = []
          for (let i = 2; i < count - 2; i++) {
            if (dates[i] !== dates[i - 1]) {
              dayDates.push({
                text: dates[i],
                index: i
              })
            }
          }

          for (let j = 1; j < dayDates.length; j++) {

            // 如果相隔太近（7个点内），也不显示横座标值
            if (dayDates[j].index - dayDates[j - 1].index < 7) {
              dayDates.splice(j, 1)
            }
          }

          dayDates.forEach((date) => {
            this.drawGridTextX(date.text, date.index)
          })

          break
      }
    }

    private drawGridTextX(date: string, index: number) {
      const {grid, dataCount, height, volumeHeight, figureWidth, figureHeight, figureOffsetY} = this

      const unitX = figureWidth / dataCount
      const axisY = height - volumeHeight
      const barX = unitX * index + unitX / 2

      this.drawText(date, [unitX * index - 15, axisY])
      this.drawLine({
        color: grid.color,
        startPoint: [barX, figureOffsetY],
        points: [[barX, figureHeight]]
      })
    }

    private getBarColor(bars: CandleBar[], index: number) {
      const {riseColor, fallColor} = this

      const openPrice = bars[index].o
      const closePrice = bars[index].c

      // 涨
      if (closePrice > openPrice) {
        return riseColor
      }

      // 跌
      else if (closePrice < openPrice) {
        return fallColor
      }

      // 不涨不跌
      else {
        if (index === 0) {
          return 'black'
        } else {
          const preClosePrice = bars[index - 1].c
          return closePrice > preClosePrice ? riseColor : fallColor
        }
      }
    }
  }

  export function drawKLine(options) {
    const defaultOptions = {
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
    }
    options = mixins({}, defaultOptions, options)

    const kLine = new KLine(options)
    kLine.initialize()
  }
}

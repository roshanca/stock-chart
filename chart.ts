module StockChart {

  export interface IChartOptions {
    id: string
    width: number
    height: number
    textOffsetY: number
    figureOffsetY: number
    volumeHeight: number
    axisTextHeight: number
    grid: Grid,
    font: string,
    textColor: string
    lineColor: string
    isIndex: boolean
  }

  export type Point = {
    length: number
    0: number
    1: number
  }

  export type Line = {
    color?: string,
    size?: number,
    startPoint: Point,
    points: Point[]
  }

  export type Round = {
    point: Point
    radius: number
    fillColor?: string
    borderColor?: string
    isFill?: boolean
    isStroke?: boolean
  }

  export type Grid = {
    color: string,
    x?: number
    y?: number
  }

  /**
   * Chart
   */
  export class Chart {
    canvas: HTMLCanvasElement
    width: number
    height: number
    figureWidth: number
    figureHeight: number
    figureOffsetHeight: number
    textOffsetY: number
    figureOffsetY: number
    volumeHeight: number
    axisTextHeight: number
    ctx: CanvasRenderingContext2D
    dpr: number
    grid: Grid
    font: string
    textColor: string
    lineColor: string
    isIndex: boolean

    constructor(options?: IChartOptions) {
      this.canvas = <HTMLCanvasElement> document.getElementById(options.id)
      this.width = options.width || document.body.clientWidth
      this.height = options.height
      this.textOffsetY = options.textOffsetY || 2
      this.figureOffsetY = options.figureOffsetY || 20
      this.volumeHeight = options.volumeHeight || 30
      this.axisTextHeight = options.axisTextHeight || 10
      this.figureWidth = this.width
      this.figureHeight = this.height - this.volumeHeight - this.axisTextHeight
      this.figureOffsetHeight = this.figureHeight - this.figureOffsetY
      this.grid = options.grid
      this.font = options.font || '10px Helvetica'
      this.textColor = options.textColor || 'rgba(138,138,138,1)'
      this.lineColor = options.lineColor || 'rgba(94,168,199,1)'
      this.isIndex = options.isIndex
    }

    initContext() {
      const dpr = Math.max(window.devicePixelRatio || 1, 1)
      const ctx = this.canvas.getContext('2d')

      // retina 屏幕优化
      if (dpr !== 1) {
        ctx.scale(dpr, dpr)
      }

      this.ctx = ctx
      this.dpr = dpr
    }

    initialize() {
      this.initContext()
      this.canvas.style.width = this.width + 'px'
      this.canvas.style.height = this.height + 'px'
      this.canvas.width = this.width * this.dpr
      this.canvas.height = this.height * this.dpr
    }

    drawLine(line: Line, needStroke: boolean = true) {
      const {ctx, dpr} = this

      ctx.strokeStyle = line.color
      ctx.lineWidth = line.size * dpr || 0
      ctx.moveTo(line.startPoint[0] * dpr, line.startPoint[1] * dpr)

      line.points.forEach((point: Point) => {
        ctx.lineTo(point[0] * dpr, point[1] * dpr)
      })

      if (needStroke) {
        ctx.stroke();
      }
    }

    drawDashedLine(p1: Point, p2: Point, size: number = 2) {
      const {ctx, dpr} = this

      const diffX = p2[0] - p1[0]
      const diffY = p2[1] - p1[1]
      const dashes = Math.floor(Math.sqrt(diffX * diffX + diffY * diffY) / size)
      const dashX = diffX / dashes
      const dashY = diffY / dashes

      let q = 0
      ctx.moveTo(p1[0] * dpr, p1[1] * dpr)
      while (q++ < dashes) {
        p1[0] += dashX
        p1[1] += dashY
        ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](p1[0] * dpr, p1[1] * dpr)
      }
      ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](p2[0] * dpr, p2[1] * dpr)
    }

    drawText(text: string, point: Point, textColor: string = this.textColor) {
      const {ctx, dpr} = this

      ctx.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, (matched, m1, m2) => {
        return m1 * dpr + m2
      })
      ctx.fillStyle = textColor
      ctx.fillText(text, point[0] * dpr, point[1] * dpr)
    }

    drawRound(round: Round) {
      const {ctx, dpr} = this

      ctx.beginPath()
      ctx.arc(round.point[0] * dpr, round.point[1] * dpr, round.radius * dpr, 0, 2* Math.PI)
      ctx.closePath()

      if (round.isStroke) {
        ctx.strokeStyle = round.borderColor
        ctx.stroke()
      }

      if (round.isFill) {
        ctx.fillStyle = round.fillColor
        ctx.fill()
      }
    }
  }

}

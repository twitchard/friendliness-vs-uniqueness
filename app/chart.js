import * as d3 from 'd3'
export default class {
    constructor (selector) {
        this.settings = {
            width: 600,
            height: 270,
            margin: {
                left: 30,
                top: 20,
                right: 30,
                bottom: 20
            },
            xmin: 0,
            xmax: 1E6,
            ymin: 0,
            ymax: 1,
            step: 15
        }
        this.attach(selector)
    }

    fn (val) {
        if (!arguments.length) return this.settings.fn
        this.settings.fn = val
        return this
    }

    width (val) {
        if (!arguments.length) return this.settings.width
        this.settings.width = val
        return this
    }

    height (val) {
        if (!arguments.length) return this.settings.height
        this.settings.height = val
        return this
    }

    xmax (val) {
        if (!arguments.length) return this.settings.xmax
        this.settings.xmax = val
        return this
    }

    xmin (val) {
        if (!arguments.length) return this.settings.xmin
        this.settings.xmin = val
        return this
    }

    ymax (val) {
        if (!arguments.length) return this.settings.ymax
        this.settings.ymax = val
        return this
    }

    ymin (val) {
        if (!arguments.length) return this.settings.ymin
        this.settings.ymin = val
        return this
    }


    margin (val) {
        if (!arguments.length) return this.settings.margin
        const {left, top, right, bottom} = val
        Object.assign(this.settings.margin, {left, top, right, bottom})
        return this.chart
    }
    
    attach (selector) {
        this.selector = selector
        this.svg = d3.select(this.selector)
            .append('svg')
            .attr('width', this.settings.width + this.settings.margin.right + this.settings.margin.left)
            .attr('height', this.settings.height + this.settings.margin.top + this.settings.margin.bottom)

        this.line = d3.line()
            .x(d => this.xScale(d[0]) + this.settings.margin.left)
            .y(d => this.yScale(d[1]) + this.settings.margin.top)
    }

    scale () {
        this.xScale = d3.scaleLinear()
            .domain([this.settings.xmin, this.settings.xmax])
            .range([0, this.settings.width])

        this.yScale = d3.scaleLinear()

            .domain([this.settings.ymin, this.settings.ymax])
            .range([this.settings.height, 0])

        this.xAxis = d3.axisBottom(this.xScale)
            .ticks(5)

        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(5)
    }

    graph () {
        const n = ~~(this.settings.width / this.settings.step)
        const data = [...Array(n).keys()]
            .map(x => ~~(x*this.settings.step * (this.settings.xmax / this.settings.width)))
            .map(x => [x, this.settings.fn(x)])

        this.scale()

        this.svg
            .append('path')
            .attr('class', 'line')
            .attr('d', this.line(data))

        this.svg.append('g')
            .attr('transform', `translate(${this.settings.margin.left}, ${this.settings.height + this.settings.margin.top})`)
            .call(this.xAxis)
            .attr('class', 'axis')

        this.svg.append('g')
            .attr('transform', `translate(${this.settings.margin.left}, ${this.settings.margin.top})`)
            .call(this.yAxis)
            .attr('class', 'axis')

    }

    replot () {
        const n = ~~(this.settings.width / this.settings.step)
        const data = [...Array(n).keys()]
            .map(x => ~~(x*this.settings.step * (this.settings.xmax / this.settings.width)))
            .map(x => [x, this.settings.fn(x)])

        this.svg
            .select('path')
            .attr('d', this.line(data))
    }
}

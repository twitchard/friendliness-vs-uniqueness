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
            axisLabelSize: 15,
            xAxisLabel: "",
            yAxisLabel: "",
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

    axisLabelSize (val) {
        if (!arguments.length) return this.settings.axisLabelSize
        this.settings.axisLabelSize = val
        return this
    }

    xAxisLabel (val) {
        if (!arguments.length) return this.settings.xAxisLabel
        this.settings.xAxisLabel = val
        return this
    }

    yAxisLabel (val) {
        if (!arguments.length) return this.settings.yAxisLabel
        this.settings.yAxisLabel = val
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
            .attr('width', this.settings.width + this.settings.margin.right + this.settings.margin.left + this.settings.axisLabelSize)
            .attr('height', this.settings.height + this.settings.margin.top + this.settings.margin.bottom + this.settings.axisLabelSize)

        this.line = d3.line()
            .x(d => this.xScale(d[0]) + this.settings.margin.left)
            .y(d => this.yScale(d[1]) + this.settings.margin.top)
    }

    graph () {
        this.svg
            .append('path')
            .attr('class', 'line')

        this._xAxis = this.svg.append('g')
            .attr('class', 'axis')

        this._yAxis = this.svg.append('g')
            .attr('class', 'axis')

        this._xAxisLabel = this.svg.append("text")
            .attr("class", "xaxislabel")

        this._yAxisLabel = this.svg.append("text")
            .attr("class", "yaxislabel")

    }

    plot () {
        const n = ~~(this.settings.width / this.settings.step)

        const data = [...Array(n).keys()]
            .map(x => ~~(x*this.settings.step * (this.settings.xmax / this.settings.width)))
            .map(x => [x, this.settings.fn(x)])

        this.xScale = d3.scaleLinear()
            .domain([this.settings.xmin, this.settings.xmax])
            .range([0, this.settings.width])

        this.yScale = d3.scaleLinear()
            .domain([this.settings.ymin, this.settings.ymax])
            .range([this.settings.height, 0])


        this.svg
            .select('path')
            .attr('d', this.line(data))
            .attr('transform', `translate(${this.settings.axisLabelSize}, 0)`)

        const xAxis = d3.axisBottom(this.xScale)
            .ticks(5)

        const yAxis = d3.axisLeft(this.yScale)
            .ticks(5)

        this._xAxis
            .attr('transform', `translate(${this.settings.margin.left + this.settings.axisLabelSize}, ${this.settings.height + this.settings.margin.top})`)
            .call(xAxis)

        this._yAxis
            .attr('transform', `translate(${this.settings.margin.left + this.settings.axisLabelSize}, ${this.settings.margin.top})`)
            .call(yAxis)


        this._xAxisLabel
            .attr("text-anchor", "end")
            .attr("x", this.settings.width)
            .attr("y", this.settings.height +
                       this.settings.margin.top +
                       this.settings.margin.bottom +
                       this.settings.axisLabelSize
            )
            .text(this.settings.xAxisLabel);

        this._yAxisLabel
            .attr("text-anchor", "end")
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(this.settings.yAxisLabel)
    }
}

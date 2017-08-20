import * as d3 from 'd3'
const alphanumerics = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
const excludeOptions = [
    { set: new Set('0123456789'), display: "Exclude Numbers" },
    { set: new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), display: "Exclude Capital Letters" },
    { set: new Set('abcdefghijklmnopqrstuvwxyz'), display: "Exclude Lowercase Letters" },
    { set: new Set('0Oo'), display: "Exclude 0, O, and o (they look alike)" },
    { set: new Set('1I'), display: "Exclude 1 and I (they look alike)" },
    { set: new Set('B8'), display: "Exclude B and 8 (they look alike)" },
    { set: new Set('S5'), display: "Exclude S and 5 (they look alike)" },
    { set: new Set('gq'), display: "Exclude g and q (they look alike)" },
    { set: new Set('1l'), display: "Exclude 1 and l (they look alike)" },
    { set: new Set('lI'), display: "Exclude l and I (they look alike)" },
    { set: new Set('Z2'), display: "Exclude Z and 2 (they look alike)" },
    { set: new Set('17'), display: "Exclude 1 and 7 (they look alike)" },
    { set: new Set('cCzZ'), display: "Exclude c/C and z/Z (they sound alike)" },
    { set: new Set('fFsS'), display: "Exclude f/F and s/S (they sound alike)" },
    { set: new Set('mMnN'), display: "Exclude m/M and n/N (they sound alike)" },
    { set: new Set('bBpP'), display: "Exclude b/B and p/P (they sound alike)" },
    { set: new Set('8aA'), display: "Exclude 8 and a/A (they sound alike)" },
]

function setMinus (a, b) {
    return new Set([...a].filter(x => !b.has(x)))
}

export default class {
    constructor(selector) {
        this.event = new Event('refresh')
        this.alphabet = alphanumerics
        this.selector = selector
        this.refreshSubscribers = []
        this.alphabetLengthSubscribers = []
    }

    onRefresh (f) {
        this.refreshSubscribers.push(f)
    }

    onAlphabetLength (f) {
        this.alphabetLengthSubscribers.push(f)
    }

    emitAlphabetLength () {
        const n = this.alphabet.size
        this.alphabetLengthSubscribers.map(f => f(n))
    }

    emitRefresh () {
        this.refreshSubscribers.map(f => f())
    }

    refresh (emit=true) {
        const self = this
        let alphabet = alphanumerics
        self.labels
            .selectAll('input')
            .each(function (x) {
                if (this.checked) {
                    alphabet = setMinus(alphabet, x.set)
                }
            })

        const extra = new Set(self.extraLabel.select('input').node().value)
        alphabet = setMinus(alphabet, extra)

        self.alphabet = alphabet
        self.alphabetList
            .text(Array.from(this.alphabet.values()).join(""))

        if (emit) {
            self.emitRefresh()
            this.emitAlphabetLength()
        }
    }

    render () {
        this.alphabetList = d3.select(this.selector)
            .append('div')

        this.labels = d3.select(this.selector)
            .selectAll('input')
            .data(excludeOptions)
            .enter()
            .append('label')
            .classed('alphabetChooser', true)

        this.labels
            .append('input')
            .attr('type', 'checkbox')
            .classed('alphabetChooser__checkbox', true)
            .on('change', () => this.refresh())

        this.labels
            .append('span')
            .classed('alphabetChooser__label', true)
            .text(x=>x.display)

        this.extraLabel = d3.select(this.selector)
            .append('label')

        this.extraLabel
            .append('input')
            .on('input', () => this.refresh())

        this.extraLabel
            .append('span')
            .text(x=>"Exclude additional characters")

        this.resetButton = d3.select(this.selector)
            .append('div')
            .append('button')
            .on('click', () => this.reset())
            .text('reset')

        this.refresh()
    }

    reset () {
        this.alphabet = alphanumerics
        this.labels.selectAll('input')
            .property('checked', false)

        this.extraLabel
            .select('input')
            .node()
            .value = ''

        this.refresh(false)
    }
}

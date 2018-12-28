import jss from 'jss'
import preset from 'jss-preset-default'
import Chart from './chart'
import Slider from './slider'
import AlphabetChooser from './alphabet_chooser'

const pCollision = (alphabetSize) => (identifierLength) => {
    const n = Math.pow(alphabetSize, identifierLength)
    return (k) => 1 - Math.exp(-(k*k)/(2*n))
}

const chart = new Chart('#chart')
    .xmax(10000000)
    .xAxisLabel("Number of identifiers")
    .yAxisLabel("Probability of collision")
    .fn(pCollision(26)(6))

chart.graph()
chart.plot()

const alphabetChooser = new AlphabetChooser('#alphabetChooser')
alphabetChooser.render()
alphabetChooser.onAlphabetLength(x => {
    alphabetSlider.value=x
    alphabetLabel.value=x
    refreshChart()
})

/**
 * Returns a function that calls `fn` if it has not
 * called fn within the last `delay` milliseconds,
 * and schedules `fn` to be called after `delay` if
 * it is not called between now and then.
 */
function Throttle (delay, fn) {
    let firedAt = Date.now()
    const throttledFn = function () {
        if (Date.now() - firedAt > delay) {
            firedAt = Date.now()
            fn.apply(null, arguments)
        }
    }
    setTimeout(throttledFn, delay)
    return fn
}

// Plot the function based on new parameters

let alphabetSlider
{
    const elm = document.getElementById('alphabetSlider')
    const options = { max: 64, min: 2, initialValue: 62 }
    alphabetSlider = Slider(elm, options)
}

let wordLengthSlider
{
    const elm = document.getElementById('wordLengthSlider')
    const options = { min: 1, max: 12, step: 1, initialValue: 6 }
    wordLengthSlider = Slider(elm, options)
}

let xmaxSlider
{
    const elm = document.getElementById('xmaxSlider')
    const options = { min: 1, max: 10, step: 1, initialValue: 6 }
    xmaxSlider = Slider(elm, options)
}

let ymaxSlider
{
    const elm = document.getElementById('ymaxSlider')
    const options = { min: 1, max: 100, step: 1, initialValue: 100 }
    ymaxSlider = Slider(elm, options)
}

const alphabetLabel   = document.getElementById('alphabetLabel')
const wordLengthLabel = document.getElementById('wordLengthLabel')
const xmaxLabel       = document.getElementById('xmaxLabel')
const ymaxLabel       = document.getElementById('ymaxLabel')

function refreshChart () {
    const xmax = Number(xmaxLabel.value)
    const ymax = Number(ymaxLabel.value)
    const alphabetLength = Number(alphabetLabel.value)
    const wordLength = Number(wordLengthLabel.value)

    chart.xmax(xmax)
    chart.ymax(ymax)

    chart.fn(
        pCollision
            (alphabetLength)
            (wordLength)
    )
    chart.plot()
}

alphabetSlider.addEventListener('input', Throttle(100, refreshChart))
alphabetSlider.addEventListener('change', ()=>alphabetChooser.reset())
alphabetSlider.addEventListener('change', refreshChart)

wordLengthSlider.addEventListener('input', Throttle(100, refreshChart))
wordLengthSlider.addEventListener('change', refreshChart)

xmaxSlider.addEventListener('input', Throttle(100, refreshChart))
xmaxSlider.addEventListener('change', refreshChart)

ymaxSlider.addEventListener('input', Throttle(100, refreshChart))
ymaxSlider.addEventListener('change', refreshChart)

alphabetLabel.addEventListener('input', Throttle(100, refreshChart))
alphabetLabel.addEventListener('change', refreshChart)

wordLengthLabel.addEventListener('input', Throttle(100, refreshChart))
wordLengthLabel.addEventListener('change', refreshChart)

xmaxLabel.addEventListener('input', Throttle(100, refreshChart))
xmaxLabel.addEventListener('change', refreshChart)

ymaxLabel.addEventListener('input', Throttle(100, refreshChart))
ymaxLabel.addEventListener('change', refreshChart)

{
    const label = alphabetLabel
    const slider = alphabetSlider
    const updateLabel = () => label.value = slider.value
    const updateSlider = () => slider.value = label.value
    updateLabel()
    slider.addEventListener('input', updateLabel)
    label.addEventListener('input', updateSlider)
}

{
    const label = wordLengthLabel
    const slider = wordLengthSlider
    const updateLabel = () => label.value = slider.value
    const updateSlider = () => slider.value = label.value
    updateLabel()
    slider.addEventListener('input', updateLabel)
    label.addEventListener('input', updateSlider)
}

{
    const label = xmaxLabel
    const slider = xmaxSlider
    const updateLabel = () => {
        label.value = Math.pow(10, slider.value)
    }
    const updateSlider = () => {
        slider.value = Math.log(label.value) / Math.log(10)
    }
    updateLabel()
    slider.addEventListener('input', updateLabel)
    label.addEventListener('input', updateSlider)
}

{
    const label = ymaxLabel
    const slider = ymaxSlider
    const updateLabel = () => label.value = ~~(1000 * (1 - Math.log(101 - slider.value)/Math.log(100))) / 1000
    const updateSlider = () => slider.value = 101 - Math.pow(100, 1 - label.value)
    updateLabel()
    slider.addEventListener('input', updateLabel)
    label.addEventListener('input', updateSlider)
}

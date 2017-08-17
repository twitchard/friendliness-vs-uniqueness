import jss from 'jss'
import preset from 'jss-preset-default'
import Chart from './chart'
import Slider from './slider'

console.log(Slider)
//jss.setup(preset())

const pCollision = (alphabetSize) => (identifierLength) => {
    const n = Math.pow(alphabetSize, identifierLength)
    return (k) => 1 - Math.exp(-(k*k)/(2*n))
}

const chart = new Chart('#chart')
    .xmax(10000000)
    .fn(pCollision(26)(6))

chart.graph()

/**
 * Returns a function that calls `fn`, only if it has not
 * called fn within the last `delay` milliseconds.
 */
function Throttle (delay, fn) {
    let firedAt = Date.now()
    return function () {
        if (Date.now() - firedAt > delay) {
            firedAt = Date.now()
            fn.apply(null, arguments)
        }
    }
}

// Plot the function based on new parameters

let alphabetSlider
{
    const elm = document.getElementById('alphabetSlider')
    const options = { max: 64, min: 2, initialValue: 26 }
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

function refreshChart () {
    chart.xmax(Math.pow(10, xmaxSlider.value))
    chart.fn(
        pCollision
            (alphabetSlider.value)
            (wordLengthSlider.value)
    )
    chart.scale()
    chart.replot()
}

alphabetSlider.addEventListener('input', Throttle(100, refreshChart))
alphabetSlider.addEventListener('change', refreshChart)

wordLengthSlider.addEventListener('input', Throttle(100, refreshChart))
wordLengthSlider.addEventListener('change', refreshChart)

{
    const label = document.getElementById('alphabetLabel')
    const slider = alphabetSlider
    const refresh = () => label.innerHTML = slider.value
    refresh()
    slider.addEventListener('input', refresh)
}

{
    const label = document.getElementById('wordLengthLabel')
    const slider = wordLengthSlider
    const refresh = () => label.innerHTML = slider.value
    refresh()
    slider.addEventListener('input', refresh)
}

{
    const label = document.getElementById('xmaxLabel')
    const slider = xmaxSlider
    const refresh = () => label.innerHTML = Math.pow(10, slider.value)
    refresh()
    slider.addEventListener('input', refresh)
}

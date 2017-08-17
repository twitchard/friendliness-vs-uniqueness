function Slider (elm, {step=1, min=0, max, initialValue, className}) {
    const type = 'range'
    return Object.assign(elm, {type, min, max, value: initialValue, className})
}

export default Slider

const startButton = document.getElementById('start')
const resetButton = document.getElementById('reset')
const chain = [
    ['milliseconds', 999, 3],
    ['seconds', 59, 2],
    ['minutes', 59, 2]
]

let arrowListeners = []
let lastValue = 0
let onMouseDownInterval = null
let countdownInterval = null
let isCountdownOn = false


function getNumberValue(type) {
    return +document.getElementById(`${type}Value`).innerText
}

function setNumberValue(type, value) {
    document.getElementById(`${type}Value`).innerText = value
}

function getFormattedValue(value, length) {
    while (value.length < length) {
        value = `0${value}`
    }
    return value
}

function isCountdownEmpty() {
    for (let i = 0; i < chain.length; ++i) {
        if (getNumberValue(chain[i][0])) {
            return false
        }
    }
    return true
}

function increase(type, max, length) {
    let value = getNumberValue(type)
    setNumberValue(type, getFormattedValue(value === max ? `0` : `${value + 1}`, length))
}

function decrease(type, max, length, delta = 1) {
    let value = getNumberValue(type)
    if (value === 0) {
        setNumberValue(type, getFormattedValue(`${max - delta + 1}`, length))
    } else if (value <= delta) {
        setNumberValue(type, getFormattedValue("0", length))
    } else {
        setNumberValue(type, getFormattedValue(`${value - delta}`, length))
    }
}

function setArrowListeners(type, max, length) {
    let upArrow = document.getElementById(type).getElementsByClassName('up')[0]
    let downArrow = document.getElementById(type).getElementsByClassName('down')[0]
    let onIncrease = () => { increase(type, max, length) }
    let onDecrease = () => { decrease(type, max, length) }
    let onStart = (callback) => {
        lastValue = getNumberValue(type)
        onMouseDownInterval = setInterval(callback, 100)
    }
    let onStop = (callback) => {
        if (onMouseDownInterval != null) {
            clearInterval(onMouseDownInterval)
            onMouseDownInterval = null
            if (getNumberValue(type) === lastValue) {
                callback()
            }
        }
    }
    arrowListeners.push([upArrow, 'mousedown', () => { onStart(onIncrease) }])
    arrowListeners.push([upArrow, 'mouseup', () => { onStop(onIncrease) }])
    arrowListeners.push([upArrow, 'mouseout', () => { onStop(onIncrease) }])
    arrowListeners.push([downArrow, 'mousedown', () => { onStart(onDecrease) }])
    arrowListeners.push([downArrow, 'mouseup', () => { onStop(onDecrease) }])
    arrowListeners.push([downArrow, 'mouseout', () => { onStop(onDecrease) }])
    arrowListeners.slice(-6).map((listener) => { listener[0].addEventListener(listener[1], listener[2]) })
}

function addArrowListeners() {
    setArrowListeners(chain[0][0], chain[0][1], chain[0][2])
    setArrowListeners(chain[1][0], chain[1][1], chain[1][2])
    setArrowListeners(chain[2][0], chain[2][1], chain[2][2])
}

function removeArrowListeners() {
    arrowListeners.map((listener) => { listener[0].removeEventListener(listener[1], listener[2]) })
    arrowListeners = []
}

function stop() {
    addArrowListeners()
    clearInterval(countdownInterval)
    startButton.innerText = 'START'
    isCountdownOn = false
}

function end() {
    stop()
    console.log('end');
}

function countdown(counter) {
    if (counter < chain.length) {
        decrease(chain[counter][0], chain[counter][1], chain[counter][2], counter ? 1 : 11)
        if (getNumberValue(chain[counter][0]) === chain[counter][1]) {
            countdown(counter + 1)
        }
    }
}

function reset() {
    if (isCountdownOn) {
        stop()
    }
    chain.map((element) => { setNumberValue(element[0], getFormattedValue("0", element[2])) })
}

function start() {
    if (isCountdownOn) {
        stop()
    } else {
        removeArrowListeners()
        countdownInterval = setInterval(() => {
            if (isCountdownEmpty()) {
                end()
            } else {
                countdown(0)
            }
        }, 11)
        startButton.innerText = 'STOP'
        isCountdownOn = true
    }
}

addArrowListeners()
resetButton.addEventListener('click', reset)
startButton.addEventListener('click', start)
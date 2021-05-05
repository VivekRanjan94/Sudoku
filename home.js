let timer
var seconds = 0
var minutes = 0
var hours = 0
var paused = true

const boardCont = document.querySelector('.board-cont')
const board = document.querySelector('#board')
createBoard()
const elements = document.querySelectorAll('.element')
const buttons = document.querySelectorAll('[data-number]')
const deleteButton = document.querySelector('[data-delete]')
const refresh = document.querySelector('.refresh')
const level = document.querySelector('#level')
const mistakesDisplay = document.querySelector('.mistakes')
const pausebtn = document.querySelector('.pause')
const endMessage = document.querySelector('.prompt')

let boardIndex = 0
var boardstr = ''
var solstr = ''
var sol = []
var mistakes = 0

newGame()

function newGame() {
  endMessage.innerText = ''
  endMessage.classList.remove('win')
  endMessage.classList.remove('loss')
  paused = true
  pausebtn.innerText = 'Play'
  window.clearInterval(timer)
  boardCont.style.display = 'none'
  seconds = 0
  minutes = 0
  hours = 0
  buttons.forEach((button) => {
    button.classList.remove('finished')
    button.classList.add('fcolor')
  })
  // let selectedLevel = level.value
  mistakes = 0
  boardIndex = Math.floor(Math.random() * 475)

  boardstr = boards.medium[boardIndex][0]
  solstr = boards.medium[boardIndex][1]
  // switch(parseInt(selectedLevel)) {
  //     case 1:
  //         boardstr = boards.easy[boardIndex][0]
  //         solstr = boards.easy[boardIndex][1]
  //         break
  //     case 2:
  //         boardstr = boards.medium[boardIndex][0]
  //         solstr = boards.medium[boardIndex][1]
  //         break
  //     case 3:
  //         boardstr = boards.hard[boardIndex][0]
  //         solstr = boards.hard[boardIndex][1]
  //         break
  //     case 4:
  //         boardstr = boards.expert[boardIndex][0]
  //         solstr = boards.expert[boardIndex][1]
  //         break
  //     default:
  //         boardstr = boards.random[boardIndex][0]
  //         console.log("Default")
  //         break
  // }
  console.log(boardstr)
  console.log(solstr)
  setBoard()
  setSol()
}

//write the html code to generate a board
function createBoard() {
  for (let i = 0; i < 9; i++) {
    let text = ''
    text += '<div>'
    for (let j = 0; j < 9; j++) {
      let inputClass = ''
      if (i % 3 == 0) {
        inputClass += 'top-'
      } else if (i % 3 == 1) {
        inputClass += 'mid-'
      } else {
        inputClass += 'bot-'
      }

      if (j % 3 == 0) {
        inputClass += 'left'
      } else if (j % 3 == 1) {
        inputClass += 'mid'
      } else {
        inputClass += 'right'
      }

      if (i == 0 && j == 0) {
        inputClass += ' top-left-corner'
      }
      if (i == 0 && j == 8) {
        inputClass += ' top-right-corner'
      }
      if (i == 8 && j == 0) {
        inputClass += ' bot-left-corner'
      }
      if (i == 8 && j == 8) {
        inputClass += ' bot-right-corner'
      }
      let square = parseInt(i / 3) * 3 + parseInt(j / 3)
      text +=
        '<input data-square="' +
        square +
        '" data-num="" type="number" value="" id="num' +
        i +
        '-' +
        j +
        '"class="element ' +
        inputClass +
        '"' +
        ' readonly>'
    }
    text += '</div>'
    board.innerHTML += text
  }
}

//Set the board with initially filled values
function setBoard() {
  let boardArr = boardstr.split('')
  mistakesDisplay.innerText = '0'

  let i = 0
  let elements = document.querySelectorAll('.element')
  elements.forEach((element) => {
    element.dataset.num = ''
    element.classList.remove('wrong')
    element.classList.remove('selected')
    element.classList.add('fcolor')
    if (boardArr[i] != '.') {
      element.value = boardArr[i]
      element.classList.add('set-board')
      element.dataset.num = boardArr[i].toString()
    } else {
      element.value = ''
      element.classList.remove('set-board')
    }
    i++
  })
}

//Set the solution array
function setSol() {
  sol = []
  let solArr = solstr.split('')
  let count = 0

  for (let j = 0; j < 9; j++) {
    sol.push([])
    for (let k = 0; k < 9; k++) {
      sol[j].push(parseInt(solArr[count]))
      count++
    }
  }
}

//Function to fill the board (used after 3 mistakes)
function fillBoard() {
  let elements = document.querySelectorAll('.element')
  let i = 0
  elements.forEach((element) => {
    element.value = sol[element.id.charAt(3)][element.id.charAt(5)]
    if (!element.classList.contains('set-board')) {
      element.classList.remove('Wrong')
      element.classList.remove('Right')
      element.classList.remove('fcolor')
      element.classList.add('crt')
    }
    i++
  })
}

//Function to update the value in an element[data-coor]
function updateValue(element, value) {
  if (!element.classList.contains('set-board')) {
    element.value = value
    if (
      parseInt(sol[element.id.charAt(3)][element.id.charAt(5)]) ===
      parseInt(value)
    ) {
      element.classList.remove('Wrong')
      element.classList.remove('fcolor')
      element.classList.add('Right')
      element.dataset.num = value
    } else {
      element.classList.remove('fcolor')
      // element.classList.add('wrong')
      // console.log('id: ' + element.id);
      mistakes++
      // console.log(mistakes);
      element.classList.add('Wrong')
    }
  }
  for (let number = 1; number <= 9; number++) {
    let str = '[data-num="' + number + '"]'
    if (document.querySelectorAll(str).length == 9) {
      buttons.forEach((btn) => {
        if (btn.classList.contains(number.toString())) {
          btn.classList.add('finished')
        }
      })
    }
  }
  //Highlight new corresponding elements
  highlight(element)

  //Check for mistakes
  // mistakes = document.querySelectorAll('.wrong').length

  mistakesDisplay.innerText = mistakes
  if (mistakes >= 3) {
    fillBoard()
    endMessage.classList.add('loss')
    endMessage.innerText = `You have made too many mistakes!!`
  }

  checkComplete()
}

//Function to highlight all cells related to certain element
function highlight(element) {
  elements.forEach((square) => {
    square.classList.remove('selected')
    if (sameRowColSquareNum(element, square)) {
      square.classList.add('selected')
    }
  })
}

//Function to check whether two elements are in same row, col, square or have same number
function sameRowColSquareNum(element, square) {
  //check rows
  if (square.id.charAt(3) == element.id.charAt(3)) {
    return true
  }
  //check cols
  if (square.id.charAt(5) == element.id.charAt(5)) {
    return true
  }
  //check same 3x3square
  if (square.dataset.square == element.dataset.square) {
    return true
  }
  //check same number
  if (square.dataset.num == element.dataset.num && element.dataset.num != '') {
    return true
  }

  //if none returned true then its false
  return false
}

var selectedElement

elements.forEach((element) => {
  element.addEventListener('click', () => {
    selectedElement = document.activeElement
    highlight(selectedElement)
  })
})

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    // console.log('hmm: ' + button.innerText)
    // selectedElement = document.activeElement
    if (selectedElement !== undefined)
      updateValue(selectedElement, button.innerText)
  })
})

deleteButton.addEventListener('click', () => {
  if (!selectedElement.classList.contains('set-board')) {
    selectedElement.value = ''
  }
})
document.addEventListener('keydown', function (event) {
  var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  if (nums.includes(event.key)) {
    updateValue(selectedElement, event.key)
  }
})

//When refresh is clicked, start a new game
refresh.addEventListener('click', () => {
  refresh.classList.add('hidden')
  pausebtn.classList.add('only-play')
  newGame()
})

// level.addEventListener('change', () => {
//     newGame()
// })

//Function to change value in stopwatch
function stopWatch() {
  seconds++
  if (seconds / 60 == 1) {
    seconds = 0
    minutes++
    if (minutes / 60 == 1) {
      minutes = 0
      hours++
    }
  }
  let secondsstr = seconds < 10 ? '0' + seconds : seconds
  let minutesstr = minutes < 10 ? '0' + minutes : minutes
  let hoursstr = hours < 10 ? '0' + hours : hours
  let timestr =
    hours == 0
      ? minutesstr + ':' + secondsstr
      : hoursstr + ':' + minutesstr + ':' + secondsstr
  document.querySelector('.timer').innerText = 'Time - ' + timestr
}

function checkComplete() {
  buttons.forEach((button) => {
    if (button.classList.contains('finished')) {
      button.style.color = 'transparent'
    }
  })
  let empty = document.querySelectorAll('[data-num=""]').length

  if (empty == 0) {
    clearInterval(timer)
    let secondsstr = seconds < 10 ? '0' + seconds : seconds
    let time =
      hours == 0
        ? minutes == 0
          ? `${seconds} seconds`
          : `${minutes}:${secondsstr}`
        : hours + ':' + minutes + ':' + secondsstr
    let mistakesstr = mistakes == 1 ? 'mistake' : 'mistakes'
    endMessage.classList.add('win')
    endMessage.innerText = `Congratulations! You have completed the puzzle in ${time} with ${mistakes} ${mistakesstr}`
  }
}

pausebtn.addEventListener('click', () => {
  refresh.classList.remove('hidden')
  pausebtn.classList.remove('only-play')
  paused = !paused
  if (paused) {
    boardCont.style.display = 'none'
    pausebtn.innerText = 'Play'
  } else {
    boardCont.style.display = 'block'
    pausebtn.innerText = 'Pause'
  }

  if (!paused) {
    timer = window.setInterval(stopWatch, 1000)
  } else {
    window.clearInterval(timer)
  }
})

function dark() {
  let body = document.getElementById('body')
  body.classList.toggle('dark')
  if (body.classList.contains('dark'))
    document.getElementById('mode').innerHTML = 'Light:'
  else document.getElementById('mode').innerHTML = 'Dark:'
}

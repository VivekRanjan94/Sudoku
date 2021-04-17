const board = document.querySelector('#board')
const boardstr = '0 1 5 0 7 0 0 0 0 4 0 0 8 0 0 7 5 0 0 0 8 0 0 9 0 1 6 9 6 4 1 0 7 0 3 0 0 8 2 3 9 0 5 0 0 5 0 0 0 0 4 0 9 0 0 2 0 4 1 0 8 0 0 0 0 1 7 0 3 9 0 4 0 0 0 9 2 0 0 6 5'
const solstr =   '3 1 5 6 7 2 4 8 9 4 9 6 8 3 1 7 5 2 2 7 8 5 4 9 3 1 6 9 6 4 1 5 7 2 3 8 1 8 2 3 9 6 5 4 7 5 3 7 2 8 4 6 9 1 6 2 9 4 1 5 8 7 3 8 5 1 7 6 3 9 2 4 7 4 3 9 2 8 1 6 5'
createBoard()
setBoard()
var sol = []
setSol()
var mistakes = 0

const elements = document.querySelectorAll('.element')
const buttons = document.querySelectorAll('[data-number]')


function createBoard() {
  for(let i = 0; i<9; i++) {
    text = "";
    text += "<div>"
    for(let j = 0; j<9; j++) {
        inputClass = "";
        if(i%3 == 0) {
            inputClass += "top-"
        } else if(i%3 == 1) {
            inputClass += "mid-"
        } else {
            inputClass += "bot-"
        }

        if(j%3 == 0) {
            inputClass += "left"
        } else if(j%3 == 1) {
            inputClass += "mid"
        } else {
            inputClass += "right"
        }

        if(i == 0 && j == 0) {
            inputClass += " top-left-corner"
        }
        if(i == 0 && j == 8) {
            inputClass += " top-right-corner"
        }
        if(i == 8 && j == 0) {
            inputClass += " bot-left-corner"
        }
        if(i == 8 && j == 8) {
            inputClass += " bot-right-corner"
        }
        text += '<input type="number" value="" id="num' + i + "-" + j+ '"class="element ' + inputClass + '"' + ' readonly>'
    }
    text += "</div>"
    board.innerHTML += text
  }
}

function setBoard() {
    let boardArr = boardstr.split(' ')

    let i = 0
    let elements = document.querySelectorAll('.element')
    elements.forEach(element => {
        if(boardArr[i] != 0) {
            element.value = boardArr[i]
            element.classList.add('set-board')
        } else {
            element.value = ''
            element.classList.remove('set-board')
            element.classList.remove('user-input')
            element.classList.remove('incorrect')
        }
        i++
    })

}

function setSol() {
    let solArr = solstr.split(' ')
    let count = 0;
    for(let j = 0; j <9; j++) {
        sol.push([])
        for(let k = 0; k<9; k++) {
            sol[j].push(parseInt(solArr[count]))
            count++
        }
        
    }
}

function idToCoordinate(idstr) {
    return [parseInt(idstr.charAt(3)), parseInt(idstr.charAt(5))]
}

var selectedElement

elements.forEach(element => {
    element.addEventListener('click', () => {
        selectedElement = document.activeElement

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if(!selectedElement.classList.contains('set-board')) {
                    selectedElement.value = button.innerText
                    if(parseInt(sol[idToCoordinate(selectedElement.id.toString())[0]][idToCoordinate(selectedElement.id.toString())[1]]) == parseInt(button.innerText)) {
                        selectedElement.classList.add('user-input')
                        selectedElement.classList.remove('incorrect')
                    } else {
                        selectedElement.classList.add('incorrect')
                    }
                    
                }
            })
        })
    })
})
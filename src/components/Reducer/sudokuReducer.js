export default function sudokuReducer(sudoku, action) {
  switch (action.type) {
    case 'set-board': {
      return {
        board: action.payload.board,
        mistakes: 0,
        completed: false,
        displayedNums: {
          one: true,
          two: true,
          three: true,
          four: true,
          five: true,
          six: true,
          seven: true,
          eight: true,
          nine: true,
        },
      }
    }
    case 'select': {
      const { x, y } = action.payload.target.dataset
      return {
        ...sudoku,
        board: sudoku.board.map((row, rowIndex) => {
          return row.map((element, colIndex) => {
            if (element.x === Number(x) && element.y === Number(y)) {
              return { ...element, selected: true }
            }
            return {
              ...element,
              selected: false,
              highlighted: shouldHighlight(action.payload.target, element),
            }
          })
        }),
        selectedElement: action.payload.target,
      }
    }
    case 'input': {
      let newBoard = [...sudoku.board]
      let rowIndex = newBoard.findIndex((row) =>
        row.some((element) => element.selected)
      )
      if (rowIndex >= 0) {
        let colIndex = newBoard[rowIndex].findIndex(
          (element) => element.selected
        )
        if (!newBoard[rowIndex][colIndex].setBoard) {
          newBoard[rowIndex][colIndex].value = action.payload.value
          let wasWrong =
            action.payload.value !== newBoard[rowIndex][colIndex].correct
          newBoard[rowIndex][colIndex].wrong = wasWrong

          let count = 0
          newBoard.forEach((row) => {
            row.forEach((element) => {
              if (element.value === action.payload.value) {
                count++
              }
            })
          })

          let newDisplayedNums = sudoku.displayedNums
          if (count === 9) {
            newDisplayedNums = {
              ...sudoku.displayedNums,
              [numstr(action.payload.value)]: false,
            }
          }
          return {
            ...sudoku,
            board: newBoard,
            mistakes: wasWrong ? sudoku.mistakes + 1 : sudoku.mistakes,
            complete: !newBoard.some((row) =>
              row.some((element) => element.value === undefined)
            ),
            displayedNums: newDisplayedNums,
          }
        }
      }

      return sudoku
    }
    case 'delete': {
      let newBoard = [...sudoku.board]
      let rowIndex = newBoard.findIndex((row) =>
        row.some((element) => element.selected)
      )
      if (rowIndex >= 0) {
        let colIndex = newBoard[rowIndex].findIndex(
          (element) => element.selected
        )
        if (!newBoard[rowIndex][colIndex].setBoard) {
          newBoard[rowIndex][colIndex].value = undefined
          newBoard[rowIndex][colIndex].wrong = false

          let count = 0
          newBoard.forEach((row) => {
            row.forEach((element) => {
              if (element.value === action.payload.value) {
                count++
              }
            })
          })

          let newDisplayedNums = sudoku.displayedNums
          if (count === 9) {
            newDisplayedNums = {
              ...sudoku.displayedNums,
              [numstr(action.payload.value)]: false,
            }
          }
          return {
            ...sudoku,
            board: newBoard,
            displayedNums: newDisplayedNums,
          }
        }
      }

      return sudoku
    }
    case 'deselect': {
      return {
        ...sudoku,
        board: sudoku.board.map((row) => {
          return row.map((element) => {
            return { ...element, selected: false, highlighted: false }
          })
        }),
      }
    }
    default: {
      return sudoku
    }
  }
}

function shouldHighlight(target, element) {
  //check rows
  if (Number(target.dataset.x) === element.x) {
    return true
  }
  //check cols
  if (Number(target.dataset.y) === element.y) {
    return true
  }
  //check same 3x3square
  if (Number(target.dataset.square) === element.square) {
    return true
  }
  //check same number
  if (target.innerText && Number(target.innerText) === element.value) {
    return true
  }

  //if none returned true then its false
  return false
}

function numstr(num) {
  switch (num) {
    case 1: {
      return 'one'
    }
    case 2: {
      return 'two'
    }
    case 3: {
      return 'three'
    }
    case 4: {
      return 'four'
    }
    case 5: {
      return 'five'
    }
    case 6: {
      return 'six'
    }
    case 7: {
      return 'seven'
    }
    case 8: {
      return 'eight'
    }
    case 9: {
      return 'nine'
    }
    default: {
      console.log('default numstr case')
    }
  }
}

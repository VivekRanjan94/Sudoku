export default function sudokuReducer(sudoku, action) {
  switch (action.type) {
    case 'set-board': {
      return { board: action.payload.board, mistakes: 0, completed: false }
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

          return {
            ...sudoku,
            board: newBoard,
            mistakes: wasWrong ? sudoku.mistakes + 1 : sudoku.mistakes,
            complete: !newBoard.some((row) =>
              row.some((element) => element.value === undefined)
            ),
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
          return {
            ...sudoku,
            board: newBoard,
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

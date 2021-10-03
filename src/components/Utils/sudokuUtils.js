export const solveBoard = (board) => {
  if (board.length === 0) {
    return []
  }

  let _board = []

  for (let i = 0; i < 9; i++) {
    _board.push([])
    for (let j = 0; j < 9; j++) {
      _board[i].push(board[i][j])
    }
  }

  sudokoSolver(_board)
  return _board

  function isValid(board, row, col, k) {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3)
      const n = 3 * Math.floor(col / 3) + (i % 3)
      if (board[row][i] === k || board[i][col] === k || board[m][n] === k) {
        return false
      }
    }
    return true
  }

  function sudokoSolver(data) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (data[i][j] === 0) {
          for (let k = 1; k <= 9; k++) {
            if (isValid(data, i, j, k)) {
              data[i][j] = k
              if (sudokoSolver(data)) {
                return true
              } else {
                data[i][j] = 0
              }
            }
          }
          return false
        }
      }
    }
    return true
  }
}

function url(difficulty) {
  return `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`
}

export const getBoard = async (setIsLoading, dispatch, difficulty) => {
  setIsLoading(true)
  const response = await fetch(url(difficulty))
  const board = await response.json()
  const solution = solveBoard(board.board)
  dispatch({
    type: 'set-board',
    payload: {
      board: board.board.map((row, rowIndex) => {
        return row.map((element, colIndex) => {
          if (element === 0) {
            return {
              x: colIndex,
              y: rowIndex,
              value: undefined,
              correct: solution[rowIndex][colIndex],
              setBoard: false,
              square: parseInt(rowIndex / 3) * 3 + parseInt(colIndex / 3),
            }
          }
          return {
            x: colIndex,
            y: rowIndex,
            value: element,
            setBoard: true,
            square: parseInt(rowIndex / 3) * 3 + parseInt(colIndex / 3),
          }
        })
      }),
    },
  })
  setIsLoading(false)
}

export const classText = (col, row) => {
  let classText = ''
  if (row % 3 === 0) {
    classText += 'top-'
  } else if (row % 3 === 1) {
    classText += 'mid-'
  } else {
    classText += 'bot-'
  }

  if (col % 3 === 0) {
    classText += 'left'
  } else if (col % 3 === 1) {
    classText += 'mid'
  } else {
    classText += 'right'
  }

  if (row === 0 && col === 0) {
    classText += ' top-left-corner'
  }
  if (row === 0 && col === 8) {
    classText += ' top-right-corner'
  }
  if (row === 8 && col === 0) {
    classText += ' bot-left-corner'
  }
  if (row === 8 && col === 8) {
    classText += ' bot-right-corner'
  }

  return `${classText}`
}

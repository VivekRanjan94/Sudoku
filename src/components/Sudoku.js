import React, { useEffect, useState, useRef, useReducer } from 'react'
import Board from './Board'

import '../scss/styles.scss'
import Loading from './Loading'
import Paused from './Paused'
import useEventListener from '../hooks/useEventListener'
import sudokuReducer from './sudokuReducer.js'
import solveBoard from '../sudoku/solveBoard'

export default function Sudoku() {
  const [sudoku, dispatch] = useReducer(sudokuReducer, {
    board: [],
    mistakes: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [difficulty, setDifficulty] = useState('easy')
  const [isPaused, setIsPaused] = useState(true)

  const difficultySelectRef = useRef()

  async function getBoard() {
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

  // useEffect(() => {
  //   console.log(sudoku)
  // }, [sudoku])

  useEffect(() => {
    if (sudoku.mistakes === 3) {
      console.log('game over')
      getBoard()
    }
  }, [sudoku.mistakes])

  useEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      setIsPaused(!isPaused)
    }

    if (e.key >= 1 && e.key <= 9) {
      dispatch({
        type: 'input',
        payload: {
          value: e.key,
        },
      })
      dispatch({ type: 'deselect' })
    }

    if (e.code === 'Backspace') {
      dispatch({
        type: 'delete',
      })
    }
  })

  function handleDifficultyChange(e) {
    setIsLoading(true)
    setDifficulty(difficultySelectRef.current.value)
  }

  useEffect(() => {
    getBoard()
  }, [difficulty])

  if (isLoading) {
    return <Loading />
  } else {
    if (isPaused) {
      return (
        <>
          <Paused />
          <button
            onClick={() => {
              setIsPaused(false)
            }}
          >
            Play
          </button>
        </>
      )
    }

    return (
      <>
        <div>Mistakes: {sudoku.mistakes}</div>
        <Board sudoku={sudoku} dispatch={dispatch} />
        <select
          name='difficulty'
          id='difficulty'
          onChange={handleDifficultyChange}
          defaultValue='easy'
          ref={difficultySelectRef}
        >
          <option value='easy'>Easy</option>
          <option value='medium'>Medium</option>
          <option value='hard'>Hard</option>
          <option value='random'>Random</option>
        </select>
        <button onClick={() => setIsPaused(true)}>Pause</button>
      </>
    )
  }
}
function url(difficulty) {
  // console.log(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
  return `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`
}

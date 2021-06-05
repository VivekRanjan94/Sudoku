import React, { useEffect, useState, useRef, useReducer } from 'react'
import Board from './Board'

import '../scss/styles.scss'
import Loading from './Loading'
import Paused from './Paused'
import useEventListener from '../hooks/useEventListener'
import sudokuReducer from './sudokuReducer.js'
import solveBoard from '../sudoku/solveBoard'
import Time, { format } from './Time.js'
import ButtonInput from './ButtonInput.js'

export default function Sudoku() {
  const [sudoku, dispatch] = useReducer(sudokuReducer, {
    board: [],
    mistakes: 0,
    completed: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [difficulty, setDifficulty] = useState('easy')
  const [isPaused, setIsPaused] = useState(true)
  const [time, setTime] = useState(0)

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

  useEffect(() => {
    if (sudoku.completed) {
      alert(
        `You completed the board in ${format(time)} with ${
          sudoku.mistakes
        } mistakes`
      )
      getBoard()
    }
    if (sudoku.mistakes === 3) {
      alert('You made too many mistakes')
      getBoard()
    }
    console.log(sudoku)
  }, [sudoku])

  useEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      setIsPaused(!isPaused)
    }

    if (e.key >= 1 && e.key <= 9) {
      dispatch({
        type: 'input',
        payload: {
          value: Number(e.key),
        },
      })
      dispatch({ type: 'select', payload: { target: sudoku.selectedElement } })
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
        <div className='paused'>
          <Paused sudoku={sudoku} time={time} />
          <button
            onClick={() => {
              setIsPaused(false)
            }}
          >
            Play
          </button>
        </div>
      )
    }

    return (
      <>
        <div className='details'>
          <div>Mistakes: {sudoku.mistakes}</div>
          <Time time={time} />
        </div>

        <Board sudoku={sudoku} dispatch={dispatch} setTime={setTime} />
        <ButtonInput sudoku={sudoku} dispatch={dispatch} />
        <div className='controls'>
          <select
            name='difficulty'
            id='difficulty'
            onChange={handleDifficultyChange}
            defaultValue={difficulty}
            ref={difficultySelectRef}
          >
            <option value='easy'>Easy</option>
            <option value='medium'>Medium</option>
            <option value='hard'>Hard</option>
            <option value='random'>Random</option>
          </select>
          <button onClick={() => setIsPaused(true)}>Pause</button>
          <button onClick={() => getBoard()}>Refresh</button>
        </div>
      </>
    )
  }
}
function url(difficulty) {
  // console.log(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
  return `https://sugoku.herokuapp.com/board?difficulty=${difficulty}`
}

import React, { useEffect, useState, useRef, useReducer } from 'react'
import Board from './Board'

import { getBoard } from '../Utils/sudokuUtils'
import Loading from '../Loading'
import Paused from './Paused'
import useEventListener from '../hooks/useEventListener'
import sudokuReducer from '../Reducer/sudokuReducer'
import Time from './Time'
import { format } from '../Utils/timeUtils'
import ButtonInput from './ButtonInput'
import Modal from '../Modal'

export default function Sudoku() {
  const [sudoku, dispatch] = useReducer(sudokuReducer, {
    board: [],
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
  })
  const [isLoading, setIsLoading] = useState(true)
  const [difficulty, setDifficulty] = useState('easy')
  const [isPaused, setIsPaused] = useState(true)
  const [time, setTime] = useState(0)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailModal, setShowFailModal] = useState(false)

  const difficultySelectRef = useRef()

  useEffect(() => {
    if (sudoku.completed) {
      setShowSuccessModal(true)
      getBoard(setIsLoading, dispatch, difficulty)
      setTime(0)
    }
    if (sudoku.mistakes >= 3) {
      setShowFailModal(true)
      getBoard(setIsLoading, dispatch, difficulty)
      setTime(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    getBoard(setIsLoading, dispatch, difficulty)
    setTime(0)
  }, [difficulty])

  if (isLoading) {
    return <Loading />
  } else {
    if (isPaused) {
      return (
        <div className='paused'>
          <div className='title'>Sudoku</div>
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
        <div className='title'>Sudoku</div>
        <div className='details'>
          <div>Mistakes: {sudoku.mistakes}/3</div>
          <Time time={time} />
        </div>

        <Modal showModal={showSuccessModal} setShowModal={setShowSuccessModal}>
          You completed the board in {format(time)} with {sudoku.mistakes}
          {sudoku.mistakes === 1 ? 'mistake' : 'mistakes'}
        </Modal>

        <Modal showModal={showFailModal} setShowModal={setShowFailModal}>
          You made too many mistakes
        </Modal>

        <Board sudoku={sudoku} dispatch={dispatch} setTime={setTime} />
        <ButtonInput sudoku={sudoku} dispatch={dispatch} />
        <div className='controls'>
          <select
            name='difficulty'
            id='difficulty'
            onChange={handleDifficultyChange}
            value={difficulty}
            ref={difficultySelectRef}
          >
            <option value='easy'>Easy</option>
            <option value='medium'>Medium</option>
            <option value='hard'>Hard</option>
            <option value='random'>Random</option>
          </select>
          <button
            onClick={() => {
              setIsPaused(true)
            }}
          >
            Pause
          </button>
          <button
            onClick={() => {
              setTime(0)
              getBoard(setIsLoading, dispatch, difficulty)
            }}
          >
            Refresh
          </button>
        </div>
      </>
    )
  }
}

import { useEffect } from 'react'
import Element from './Element'

export default function Board({ sudoku, dispatch, setTime }) {
  function increment() {
    setTime((time) => time + 1)
  }

  useEffect(() => {
    const timeInterval = setInterval(increment, 1000)
    return () => {
      clearInterval(timeInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <div className='board'>
        {sudoku.board.map((row, rowIndex) => {
          return row.map((element, columnIndex) => {
            return (
              <Element
                key={rowIndex * 9 + columnIndex}
                element={element}
                dispatch={dispatch}
              />
            )
          })
        })}
      </div>
    </>
  )
}

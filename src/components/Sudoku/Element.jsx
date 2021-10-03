import React from 'react'
import { classText } from '../Utils/sudokuUtils'

export default function Element({
  element: { x, y, value, selected, square, highlighted, wrong, setBoard },
  dispatch,
}) {
  function handleClick(e) {
    dispatch({ type: 'select', payload: { target: e.target } })
  }

  return (
    <div
      className={`element ${classText(x, y)} ${selected ? 'selected' : ''} ${
        highlighted ? 'highlighted' : ''
      } ${wrong ? 'wrong' : ''} ${setBoard ? 'set' : ''}`}
      data-x={x}
      data-y={y}
      data-square={square}
      onClick={handleClick}
    >
      {value}
    </div>
  )
}

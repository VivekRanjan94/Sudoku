import React from 'react'

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

export function classText(col, row) {
  let inputClass = ''
  if (row % 3 === 0) {
    inputClass += 'top-'
  } else if (row % 3 === 1) {
    inputClass += 'mid-'
  } else {
    inputClass += 'bot-'
  }

  if (col % 3 === 0) {
    inputClass += 'left'
  } else if (col % 3 === 1) {
    inputClass += 'mid'
  } else {
    inputClass += 'right'
  }

  if (row === 0 && col === 0) {
    inputClass += ' top-left-corner'
  }
  if (row === 0 && col === 8) {
    inputClass += ' top-right-corner'
  }
  if (row === 8 && col === 0) {
    inputClass += ' bot-left-corner'
  }
  if (row === 8 && col === 8) {
    inputClass += ' bot-right-corner'
  }

  return `${inputClass}`
}

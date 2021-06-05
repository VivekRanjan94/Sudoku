import React from 'react'

export default function ButtonInput({ dispatch, sudoku }) {
  function handleInputClick(e) {
    if (!sudoku.selectedElement) {
      return
    }

    if (e.target.innerText === 'C') {
      return dispatch({
        type: 'delete',
      })
    }
    dispatch({
      type: 'input',
      payload: {
        value: Number(e.target.innerText),
      },
    })
    dispatch({
      type: 'select',
      payload: { target: sudoku.selectedElement },
    })
  }
  return (
    <div className='input'>
      <button onClick={handleInputClick}>1</button>
      <button onClick={handleInputClick}>2</button>
      <button onClick={handleInputClick}>3</button>
      <button onClick={handleInputClick}>4</button>
      <button onClick={handleInputClick}>5</button>
      <button onClick={handleInputClick}>6</button>
      <button onClick={handleInputClick}>7</button>
      <button onClick={handleInputClick}>8</button>
      <button onClick={handleInputClick}>9</button>
      <button onClick={handleInputClick}>C</button>
    </div>
  )
}

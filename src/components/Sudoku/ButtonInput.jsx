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
      <button onClick={sudoku.displayedNums.one ? handleInputClick : null}>
        1
      </button>
      <button onClick={sudoku.displayedNums.two ? handleInputClick : null}>
        2
      </button>
      <button onClick={sudoku.displayedNums.three ? handleInputClick : null}>
        3
      </button>
      <button onClick={sudoku.displayedNums.four ? handleInputClick : null}>
        4
      </button>
      <button onClick={sudoku.displayedNums.five ? handleInputClick : null}>
        5
      </button>
      <button onClick={sudoku.displayedNums.six ? handleInputClick : null}>
        6
      </button>
      <button onClick={sudoku.displayedNums.seven ? handleInputClick : null}>
        7
      </button>
      <button onClick={sudoku.displayedNums.eight ? handleInputClick : null}>
        8
      </button>
      <button onClick={sudoku.displayedNums.nine ? handleInputClick : null}>
        9
      </button>

      <button onClick={handleInputClick}>C</button>
    </div>
  )
}

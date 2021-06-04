import Element from './Element.js'

export default function Board({ sudoku, dispatch }) {
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

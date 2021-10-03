import { classText } from '../Utils/sudokuUtils'
import Time from './Time'

export default function Paused({ sudoku, time }) {
  return (
    <>
      <div className='details'>
        <div>Mistakes: {sudoku.mistakes}/3</div>
        <Time time={time} />
      </div>
      <div className='paused__board'>
        {sudoku.board.map((row, rowIndex) => {
          return row.map((element, columnIndex) => {
            return (
              <div
                key={rowIndex + columnIndex}
                className={`element ${classText(columnIndex, rowIndex)} `}
              ></div>
            )
          })
        })}
      </div>
    </>
  )
}

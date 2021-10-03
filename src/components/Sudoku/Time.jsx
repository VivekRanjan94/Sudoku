import React from 'react'
import { format } from '../Utils/timeUtils'

export default function Time({ time }) {
  return <div>Time: {format(time)}</div>
}

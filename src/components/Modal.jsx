import React, { useRef } from 'react'
import useEventListener from './hooks/useEventListener'
import ReactDOM from 'react-dom'

export default function Modal({ showModal, setShowModal, children }) {
  const backgroundRef = useRef()

  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showModal) {
      setShowModal(false)
    }
  })
  useEventListener('mousedown', (e) => {
    if (e.target === backgroundRef.current && showModal) {
      setShowModal(false)
    }
  })

  return ReactDOM.createPortal(
    <>
      {showModal && (
        <div ref={backgroundRef} className='modal'>
          <div className='modal__background'></div>
          <div className='modal__main'>
            <div className='modal__body'>{children}</div>
            <span
              className='modal__cross'
              onClick={() => setShowModal(false)}
            ></span>
          </div>
        </div>
      )}
    </>,
    document.querySelector('#portal')
  )
}

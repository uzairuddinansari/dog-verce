import React from 'react'
import { useDispatch } from 'react-redux'
import { toggleVideo } from '../store/uiSlice'
import gsap from 'gsap'

const Boxe = () => {
  const dispatch = useDispatch()

  const Click = () => {
    dispatch(toggleVideo())
  }

  const handleEnter = () => {
    gsap.to('#boxes2 i', {
      x: 10,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleLeave = () => {
    gsap.to('#boxes2 i', {
      x: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  return (
    <div className="boxes" id="boxes2">
      <i className="ri-arrow-right-s-line"></i>
      <button onClick={Click} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        Over Show
      </button>
    </div>
  )
}

export default Boxe

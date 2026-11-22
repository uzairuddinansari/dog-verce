import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setPreviousRoute } from '../store/uiSlice'

function Button() {
  const location = useLocation()
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(setPreviousRoute(location.pathname))
  }

  return (
    <div className="boxes" id="boxes3">
      <Link to="/page2" onClick={handleClick}>
        <button aria-label="Open menu">
          <i className="ri-menu-3-line" id="Click" role="side changing"></i>
        </button>
      </Link>
    </div>
  )
}

export default Button

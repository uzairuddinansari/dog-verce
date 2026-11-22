import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Page2button() {
  const previousRoute = useSelector((state) => state.ui.previousRoute) || '/'
  const targetRoute = previousRoute === '/page2' ? '/' : previousRoute

  return (
    <div className="nav-sec2">
      <Link to={targetRoute}>
        <button aria-label="Close menu">
          <i className="ri-close-large-line"></i>
        </button>
      </Link>
    </div>
  )
}

export default Page2button

import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeVideo } from '../store/uiSlice'
import gsap from 'gsap'

const Animate = () => {
  const isVideoOpen = useSelector((state) => state.ui.isVideoOpen)
  const dispatch = useDispatch()
  const modalRef = useRef(null)

  useEffect(() => {
    if (isVideoOpen) {
      gsap.to(modalRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        display: 'flex',
        ease: 'power3.out',
      })
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        display: 'none',
        ease: 'power3.in',
      })
    }
  }, [isVideoOpen])

  return (
    <div
      id="video"
      ref={modalRef}
      style={{
        position: 'fixed',
        top: '10%',
        left: '15%',
        width: '70vw',
        height: '75vh',
        zIndex: 99999,
        display: 'none',
        opacity: 0,
        flexDirection: 'column',
        backgroundColor: 'rgba(15, 15, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
          color: '#fff',
        }}
      >
        <span style={{ fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>
          Dogstudio Showreel
        </span>
        <button
          onClick={() => dispatch(closeVideo())}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div style={{ flex: 1, width: '100%', height: 'calc(100% - 50px)', borderRadius: '8px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video
          controls
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
        ></video>
      </div>
    </div>
  )
}

export default Animate

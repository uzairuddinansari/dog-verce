import React, { useState } from 'react'
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

const Line = () => {

  const line = ()=>{
    gsap.to(".line",{
    scaleX: 0.85,
    transformOrigin: "right",
    duration: 0.1,
    })
   }
   const line2 = ()=>{
    gsap.to(".line",{
    scaleX: 1,
    transformOrigin: "right",
    duration: 0.1,
    })
   }

  
  return (
    <div className="line-parrent" onMouseEnter={line} onMouseLeave={line2}><b><h4>Discover our values
    </h4></b><div className="line"></div></div>
  )
}

export default Line
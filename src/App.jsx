import './App.css'
import Dog2 from './component/Dog2'
import Mainfile from './component/Mainfile'
import { Route, Routes } from 'react-router-dom'
import Studio from './component/Studio'
import Cases from './component/Cases'
import Careers from './component/Careers'
import Values from './component/Values'
import Contact from './component/Contact'
import Animate from './component/Animate'

function App() {
  return (
    <>
      <Animate />
      <Routes>
        <Route path="/" element={<Mainfile />} />
        <Route path="/page2" element={<Dog2 />} />
        <Route path="/Studio/" element={<Studio />} />
        <Route path="/Studio" element={<Studio />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/values" element={<Values />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  )
}

export default App

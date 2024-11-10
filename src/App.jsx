import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { router } from './routes/Routes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <RouterProvider router={router}/>
        <ToastContainer
        position='top-center'
        />
      </div>
    </>
  )
}

export default App

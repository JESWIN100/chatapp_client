import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import { SocketContextProvider } from './config/socketContext.jsx';

createRoot(document.getElementById('root')).render(
  
    <SocketContextProvider>
   <App />
  
    </SocketContextProvider>
 
)

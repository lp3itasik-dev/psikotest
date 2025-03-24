import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './assets/css/custom.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Result from './pages/Result.jsx'
import Answer from './pages/admin/Answer.jsx'
import Register from './pages/auth/Register.jsx'
import Login from './pages/auth/Login.jsx'
import Question from './pages/Question.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/question",
    element: <Question />
  },
  // {
  //   path: "/criteria",
  //   element: <Criteria />
  // },
  // {
  //   path: "/upque",
  //   element: <Upque />
  // },
  {
    path: "/answer",
    element: <Answer />
  },
  {
    path: "/result",
    element: <Result />
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

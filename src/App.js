// App.js
import React, { useState } from 'react';
import { BrowserRouter,Switch,Route,Routes} from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Fragment } from 'react';
import Profile from './pages/Profile';
function App() {


  return (
    <AuthProvider>
    <BrowserRouter>

    <Navbar/>
    <Fragment>
      <Routes>
        <Route path="/" element={<PrivateRoute path="/" children={<Home/>}></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute path="/" children={<Profile/>}></PrivateRoute>} />
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/login" element={<Login/>}/>
      </Routes>
      </Fragment>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

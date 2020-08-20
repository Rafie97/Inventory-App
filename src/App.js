import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Pages/Dashboard';
import LoginPage from './Pages/LoginPage';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import firebase from 'firebase';
import {AuthProvider} from './Components/Auth_Components/Auth';
import PrivateRoute from './Components/Auth_Components/PrivateRoute';


class App extends Component {

  componentDidMount() {
    const config = {
        apiKey: "AIzaSyAwVQUWQfP18Lmai0-897ftQ3AwFOGwF88",
        authDomain: "bigproject-3043c.firebaseapp.com",
        databaseURL: "https://bigproject-3043c.firebaseio.com",
        projectId: "bigproject-3043c",
        storageBucket: "bigproject-3043c.appspot.com",
        messagingSenderId: "1070431489619",
        appId: "1:1070431489619:web:ccf28d925d4e9db7a7c0a6",
        measurementId: "G-STD67N7EY0"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    } 

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <AuthProvider>
            <Router>
              <Route path="/" exact component={LoginPage} />
              <PrivateRoute path="/Dashboard" component={Dashboard} />
            </Router>
          </AuthProvider>
        </header>
      </div>
    );
  }
}

export default App;

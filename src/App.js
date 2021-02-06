import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import LoginPage from "./Pages/LoginPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import firebase from "firebase";
import { AuthProvider } from "./Components/Auth_Components/Auth";
import PrivateRoute from "./Components/Auth_Components/PrivateRoute";
import config from "./hiddenConfig/config";

class App extends Component {
  componentDidMount() {
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

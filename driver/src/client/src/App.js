import React, { Component } from 'react';
import { Provider } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Configuration from './features/configuration/components/Configuration'

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store} >
        <Configuration></Configuration>
      </Provider >
    );
  }
}

export default App;

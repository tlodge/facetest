import React, { Component } from 'react';
import { Provider } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Physical from './features/physical/components/Physical'

class App extends Component {
  render() {
    return (
      <Provider store={this.props.store} >
        <Physical></Physical>
      </Provider >
    );
  }
}

export default App;

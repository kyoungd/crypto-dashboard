import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';

const CustomElement = styled.div`
font-size:3em;
`


class App extends Component {
  render() {
    return (
      <CustomElement>
        Hello
      </CustomElement>
    );
  }
}

export default App;

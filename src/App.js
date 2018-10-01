import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import AppBar from './AppBar';

const Content = styled.div`
`

const AppLayout=styled.div`
  padding: 40px;
`

const checkFirstVisit = () => {
  let cryptoDashData = localStorage.getItem("cryptoDash");
  if (!cryptoDashData) {
    return {
      firstVisit: true,
      page: 'SETTINGS'
    }
  }
}

class App extends Component {
  state = {
    page: 'DASHBOARD',
    ...checkFirstVisit()
  };
  displayInDashboard = () => this.state.page === 'DASHBOARD';
  displayInSettings = () => this.state.page === 'SETTINGS';
  firstVisitMessage = () => {
    if (this.state.firstVisit) {
      return <div>Welcome to the site.  Please select your favorite coins.</div>;
    }
  };
  confirmFavorites = ()=> {
    localStorage.setItem('cryptoDash', 'test');
    this.setState({firstVisit: false, page:'DASHBOARD'});
  };
  settingsContent = () => {
    return <div>
      { this.firstVisitMessage() }
      <div onClick={()=>this.confirmFavorites() }>
        Confirm Favorites
      </div>
    </div>
  }
  // {AppBar.call(this)}  -- bind this context to the AppBar method.
  // AppBar is an external method rathern than a component.
  render() {
    return (
      <AppLayout>
        {AppBar.call(this)}
        <Content>
          { this.displayInSettings() && this.settingsContent() }
        </Content>
      </AppLayout>      
    );
  }
}

export default App;

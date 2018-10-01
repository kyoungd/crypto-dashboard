import React, { Component } from 'react';
import './App.css';
import styled, {css} from 'styled-components';

const Logo = styled.div`
  font-size:1.5em;
`

const ControlButton = styled.div`
  cursor: pointer;
  ${props => props.active && css`
    text-shadow: 0px 0px 60px #03ff03;
    font-size:1.1em;
  `}
`

const Bar = styled.div`
  display:grid;
  grid-template-columns: 180px auto 100px 100px;
  margin-bottom: 40px;
`
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
  render() {
    return (
      <AppLayout>
        <Bar>
          <Logo>
            CRYPTO-DASH
          </Logo>
          <div></div>
          { !this.state.firstVisit && (
            <ControlButton active={this.displayInDashboard()} onClick={()=>{this.setState({page : 'DASHBOARD'})}}>
              DASHBOARD
            </ControlButton>
          )}
          <ControlButton active={this.displayInSettings()} onClick={()=>{this.setState({page : 'SETTINGS'})}}>
            SETTINGS
          </ControlButton>
        </Bar>
        <Content>
          { this.displayInSettings() && this.settingsContent() }
        </Content>
      </AppLayout>      
    );
  }
}

export default App;

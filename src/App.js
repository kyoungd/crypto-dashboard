import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import AppBar from './AppBar';
import CoinList from './CoinList';

const _ = require('lodash');
const cc = require('cryptocompare');
const config = require('./config.json');

// AppBar is a external method.  Not a seperate react component.  It preserves this reference.
// You don't always need to create a new react component.

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
      page: config.bar.settings
    }
  }
}

class App extends Component {
  state = {
    page: config.bar.settings,
    favorites: ['ETH', 'BTC', 'XMR', 'DOGE', 'EOS'],
    ...checkFirstVisit()
  };

  componentDidMount = () => {
    this.fetchCoin();
  }
  fetchCoin = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState( {coinList} );
    console.log('fetchCoin calling...', coinList);
  }
  displayInDashboard = () => this.state.page === config.bar.dashboard;
  displayInSettings = () => this.state.page === config.bar.settings;
  firstVisitMessage = () => {
    if (this.state.firstVisit) {
      return <div>Welcome to the site.  Please select your favorite coins.</div>;
    }
  };
  confirmFavorites = ()=> {
    localStorage.setItem('cryptoDash', 'test');
    this.setState({firstVisit: false, page:config.bar.dashboard});
  };
  settingsContent = () => {
    return <div>
      { this.firstVisitMessage() }
      <div onClick={()=>this.confirmFavorites() }>
        Confirm Favorites
      </div>
      { CoinList.call(this, true) }
      { CoinList.call(this) }
    </div>
  }
  loadingContent = () => {
    if (!this.state.coinList) {
      return <div>Coin List Loading...</div>
    }
  }
  addCoinToFavorite =(coin) => {
    console.log(' addCoinToFavorite: ' + coin);
    let favorites = [...this.state.favorites];
    if (!_.includes(favorites, coin))
    {
      favorites.push(coin);
      this.setState({favorites});
    }
  }
  isInFavorite = (coin) => _.includes(this.state.favorites, coin);
  removeCoinFromFavorite = (coin) => {
    console.log(' removeCoinFromFavorite: ' + coin)
    let favorites = [...this.state.favorites];
    this.setState({favorites: _.pull(favorites, coin)});
  }
  render() {
    return (
      <AppLayout>
        {
          // {AppBar.call(this)}  -- bind this context to the AppBar method.
          // AppBar is an external method rathern than a component.
          AppBar.call(this)
        }
        { this.loadingContent() || 
          <Content>
            { this.displayInSettings() && this.settingsContent() }
          </Content>
        }
        
      </AppLayout>      
    );
  }
}


export default App;

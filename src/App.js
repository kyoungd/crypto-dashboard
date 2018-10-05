import React, { Component } from 'react';
import './App.css';
import styled from 'styled-components';
import AppBar from './AppBar';
import CoinList from './CoinList';
import Search from './Search';
import { CenterDiv } from './CenterDiv';
import { ConfirmButton } from './Button';
import DashboardContent from './Dashboard';

const _ = require('lodash');
const cc = require('cryptocompare');
const fuzzy = require('fuzzy');
const config = require('./config.json');
const moment = require('moment'); 

// AppBar is a external method.  Not a seperate react component.  It preserves this reference.
// You don't always need to create a new react component.

const Content = styled.div`
`

const AppLayout=styled.div`
  padding: 40px;
`

const checkFirstVisit = () => {
  let cryptoFavorite = JSON.parse(localStorage.getItem("cryptoFavorite"));
  if (!cryptoFavorite) {
    return {
      firstVisit: true,
      page: config.bar.settings
    }
  }
  let {favorites, currentFavorite, timeInterval } = cryptoFavorite;
  return {favorites, currentFavorite, timeInterval };
}

class App extends Component {
  state = {
    page: config.bar.dashboard,
    favorites: ['ETH', 'BTC', 'EOS', 'XMR', 'DOGE'],
    ...checkFirstVisit()
  };
  componentDidMount = () => {
    this.fetchCoin();
    this.fetchPrice();
    this.fetchHistorical();
  }
  validatedCoinList = (coinList) => {
    let validCoinList = [];
    this.state.favorites.forEach(symbol => {
      if (coinList[symbol])
        validCoinList.push(symbol);
    })
    return validCoinList;
  }
  fetchCoin = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState( {coinList, favorites: this.validatedCoinList(coinList)} );
  }
  fetchPrice = async () => {
    if (this.state.firstVisit) return;
    let prices = await this.prices();
    this.setState({prices});
  }
  fetchHistorical = async() => {
    if (this.state.firstVisit) return;
    if (this.state.currentFavorite) {
      let ti = this.state.timeInterval;
      let symbol = this.state.currentFavorite;
      let results = await this.historical(symbol);
      let historical = [{
        name: this.state.currentFavorite,
        data: results.map((ticker, index) => [moment().subtract({[ti]: config.setup.time_unit - index }).valueOf(), ticker.USD] )
      }];
      this.setState({historical});
    }
  }
  historical = (symbol) => {
    let promises = [];
    let ti = this.state.timeInterval;
    for (let units = config.setup.time_unit; units >= 0; --units) {
      promises.push(cc.priceHistorical(symbol, ['USD'], moment().subtract({[ti]: units}).toDate()))
    }
    return Promise.all(promises);
  }
  prices = async() => {
    let validCoins = [];
    this.state.favorites.forEach(async (coin) => {
      try {
        let validCoin = await cc.priceFull(coin, "USD");
        validCoins.push(validCoin);
      } catch (e) {
        console.warn('prices() coin price fetch error: ', e);
      }
    });
    return validCoins;
  }
  displayInDashboard = () => this.state.page === config.bar.dashboard;
  displayInSettings = () => this.state.page === config.bar.settings;
  firstVisitMessage = () => {
    if (this.state.firstVisit) {
      return <div>Welcome to the site.  Please select your favorite coins.</div>;
    }
  };
  confirmFavorites = ()=> {
    let currentFavorite = this.state.favorites[0];
    this.setState({
      firstVisit: false, 
      page:config.bar.dashboard, 
      prices: null,
      historical: null,
      timeInterval: 'months',
      currentFavorite
    }, () => {
      this.fetchPrice();
      this.fetchHistorical();
      localStorage.setItem('cryptoFavorite', JSON.stringify({favorites: this.state.favorites, currentFavorite, timeInterval: this.state.timeInterval}));
    });
  };
  settingsContent = () => {
    return <div>
      { this.firstVisitMessage() }
      { Search.call(this) }
      { CoinList.call(this, true) }
      <CenterDiv>
        <ConfirmButton onClick={()=>this.confirmFavorites() }>
          Select Favorites
        </ConfirmButton>
      </CenterDiv>
      { CoinList.call(this) }
    </div>
  }
  loadingContent = () => {
    if (!this.state.coinList) {
      return <div>Coin List Loading...</div>
    }
    if (!this.state.firstVisit && !this.state.prices) {
      return <div>Coin Price Loading...</div>
    }
  }
  addCoinToFavorite =(coin) => {
    let favorites = [...this.state.favorites];
    if (!_.includes(favorites, coin))
    {
      favorites.push(coin);
      this.setState({favorites});
    }
  }
  isInFavorite = (coin) => _.includes(this.state.favorites, coin);
  removeCoinFromFavorite = (coin) => {
    let favorites = [...this.state.favorites];
    this.setState({favorites: _.pull(favorites, coin)});
  }
  handleFilter = _.debounce(inputValue => {
    let coinSymbols = Object.keys(this.state.coinList);
    let coinNames = coinSymbols.map((symbol) => this.state.coinList[symbol].CoinName);
    let allStringsToSearch = coinSymbols.concat(coinNames);
    let fuzzyResult = fuzzy.filter(inputValue, allStringsToSearch, {}).map(result=>result.string);
    let filteredCoins = _.pickBy(this.state.coinList, (result, symbol)=> {
      let coinName = result.CoinName;
      // if our fuzzy logic contains this symbol or the coinName
      return _.includes(fuzzyResult, symbol) || _.includes(fuzzyResult, coinName);
    } );
    this.setState({filteredCoins});
  }, 500);
  filterCoins = (e) => {
    let inputValue = _.get(e, 'target.value');
    if (!inputValue) {
      this.setState({filteredValue : null})
    }
    else
      this.handleFilter(inputValue);
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
            { this.displayInDashboard() && this.state.favorites.length > 0 && DashboardContent.call(this) }
            { this.displayInDashboard() && this.state.favorites.length <= 0 && 
            <div style={{padding: '20px'}}>
              NO FAVORITES SELECTED.  USE SETTING AND SELECT FAVORITES.
            </div>}
          </Content>
        }
        
      </AppLayout>      
    );
  }
}


export default App;

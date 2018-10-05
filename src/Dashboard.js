import React from 'react';
import { CoinGrid, CoinTile, CoinHeader, CoinSymbol } from './CoinList';
import styled, {css} from 'styled-components';
import { fontSizeBig, fontSize3, subtleBoxShadow, lightBlueBackground, backgroundColor2, fontSize2 } from './Style';
import highchartsConfig from './HighchartsConfig';
import highchartsTheme from './HighchartsTheme';

const ReactHighcharts = require('react-highcharts');
ReactHighcharts.Highcharts.setOptions(highchartsTheme);

const numberFormat = (number) => +(number + '').slice(0, 7);
const ChangePct = styled.div`
    color: green;
    ${props => props.red && css`
        color:red;
    `}
`

const TicketPrice = styled.div`
    ${fontSizeBig}
`

const CoinTileCompact = styled(CoinTile)`
    ${fontSize3}
    display-grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
    justify-items: right;
`

const PaddingBlue = styled.div`
    ${subtleBoxShadow}
    ${lightBlueBackground}
    padding:5px;
`
const ChartGrid = styled.div`
    display: grid;
    margin-top: 15px;
    grid-template-columns: 1fr 3fr;
    grid-gap:20px;
`

const ChartSelect = styled.select`
    ${backgroundColor2}
    color: #1163c9;
    border: 1px solid;
    ${fontSize2}
    margin: 5px;
    height: 25px;
    place-self: center left;
    float: right;
`
export default function() {
    return [<CoinGrid key={'coinGrid'}> {
        this.state.prices.map((coin, index) => {
            let symbol = Object.keys(coin)[0];
            let data = coin[symbol]['USD'];
            let tileProps = {
                key: symbol,
                dashboardFavorite: symbol === this.state.currentFavorite,
                onClick : () => {
                    this.setState({currentFavorite : symbol, historical: null}, this.fetchHistorical);
                    localStorage.setItem(
                        'cryptoFavorite', JSON.stringify(
                        {
                            ...JSON.parse(localStorage.getItem("cryptoFavorite")),
                            currentFavorite: symbol
                        }));
                }
            };
            return index < 5 ? 
            <CoinTile {...tileProps}> 
                <CoinHeader>
                    <div>{symbol}</div>
                    <CoinSymbol><ChangePct red={data.CHANGEPCT24HOUR < 0}>{numberFormat(data.CHANGEPCT24HOUR)}%</ChangePct></CoinSymbol>
                </CoinHeader>
                <TicketPrice>${numberFormat(data.PRICE)}</TicketPrice>
            </CoinTile> :

            <CoinTileCompact {...tileProps}>
                <div style={{justifySelf: 'left'}}>{symbol}</div>
                <CoinSymbol><ChangePct red={data.CHANGEPCT24HOUR < 0}>{numberFormat(data.CHANGEPCT24HOUR)}%</ChangePct></CoinSymbol>
                <div>${numberFormat(data.PRICE)}</div>
            </CoinTileCompact>
        })
    }
    </CoinGrid>,
    <ChartGrid key={'chartGrid'}>
        <PaddingBlue>
            <h2>{ this.state.coinList[this.state.currentFavorite].CoinName }</h2>
            {<img alt={this.state.currentFavorite} style={{height: '200px', display: 'block', margin:'auto'}} src={`http://www.cryptocompare.com/${this.state.coinList[this.state.currentFavorite].ImageUrl}`} />}
        </PaddingBlue>
        <PaddingBlue>
            <ChartSelect defaultValue={this.state.timeInterval} onChange={(e)=>{
                this.setState({timeInterval: e.target.value, historical: null}, () => {
                    localStorage.setItem(
                        'cryptoFavorite', JSON.stringify(
                        {
                            ...JSON.parse(localStorage.getItem("cryptoFavorite")),
                            timeInterval: this.state.timeInterval
                        }));
                    
                    this.fetchHistorical();
                });
                console.log(e.target.value);
            }}>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
            </ChartSelect>
            { 
                    this.state.historical ?
                        <div style={{overflow: 'hidden'}}>
                            <ReactHighcharts config={highchartsConfig.call(this)} /> 
                        </div> :
                        <div style={{padding: '10px'}}> LOADING HISTORICAL DATA.... </div>
            }
        </PaddingBlue>
    </ChartGrid>]
}

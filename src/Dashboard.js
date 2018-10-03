import React from 'react';
import { CoinGrid, CoinTile, CoinHeader, CoinSymbol } from './CoinList';
import styled, {css} from 'styled-components';
import { fontSizeBig, fontSize3, subtleBoxShadow, lightBlueBackground } from './Style';

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

const CoinTileCompact = CoinTile.extend`
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

export default function() {
    return [<CoinGrid> {
        this.state.prices.map((coin, index) => {
            let symbol = Object.keys(coin)[0];
            let data = coin[symbol]['USD'];
            let tileProps = {
                dashboardFavorite: symbol === this.state.currentFavorite,
                onClick : () => {
                    this.setState({currentFavorite : symbol});
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
    <ChartGrid>
        <PaddingBlue>
            <h2>{ this.state.coinList[this.state.currentFavorite].CoinName }</h2>
            {<img alt="nothing" style={{height: '200px', display: 'block', margin:'auto'}} src={`http://www.cryptocompare.com/${this.state.coinList[this.state.currentFavorite].ImageUrl}`} />}
        </PaddingBlue>
        <PaddingBlue>
            ...Chart goes here
        </PaddingBlue>
    </ChartGrid>]
}

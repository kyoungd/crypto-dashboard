import React from 'react';
import styled, {css} from 'styled-components';
import { subtleBoxShadow, lightBlueBackground, greenBoxShadow, redBoxShadow } from './Style';

export const CoinGrid = styled.div`
  display:grid;
  grid-gap: 15px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  ${props => props.count && css`
    grid-template-columns: repeat(${props.count > 10 ? 10 : (props.count > 5 ? props.count : 5)}, 1fr);
  `}
  margin-top: 40px;
`

export const CoinTile = styled.div`
    ${subtleBoxShadow}
    ${lightBlueBackground}
    padding: 10px;
    &:hover {
        cursor: pointer;
        ${greenBoxShadow}
    }
    ${props => props.favorite && css`
        &:hover {
            cursor: pointer; 
            ${redBoxShadow}
        }
    `}
    ${props => props.dashboardFavorite && css`
        ${greenBoxShadow}
        &:hover {
            pointer-events: none;
        }
    `}
    ${props => props.chosen && !props.favorite && css`
        &:hover {
            pointer-event:none;
            opacity: 0.4;
        }
    `}
    display:grid;
`

export const CoinHeader = styled.div`
    display:grid;
    grid-template-columns: 1fr 1fr;
`

export const CoinSymbol = styled.div`
    justify-self: right;
`

const DeleteIcon = styled.div`
    justify-self: right;
    display:none;
    ${CoinTile}:hover & {
        display:block;
        color: red;
    }
`
export default function(favorites = false) {
    let coinKeys = favorites ? this.state.favorites : 
        (this.state.filteredCoins && Object.keys(this.state.filteredCoins)) || Object.keys(this.state.coinList).slice(0, 100);
    return <CoinGrid count={favorites && this.state.favorites.length }>
        {coinKeys.map((coin) => {
            try {
                return <CoinTile chosen={this.isInFavorite(coin)} favorite={favorites} onClick={
                    favorites ? 
                    ()=> { this.removeCoinFromFavorite(coin) } :
                    ()=> { this.addCoinToFavorite(coin) } }>
                    <CoinHeader>
                        <div>{this.state.coinList[coin].CoinName}</div>
                        {
                            favorites ?
                            <DeleteIcon>X</DeleteIcon> :
                            <CoinSymbol>{this.state.coinList[coin].Symbol}</CoinSymbol>
                        }
                    </CoinHeader>
                    {<img alt="nothing" width="50px" src={`http://www.cryptocompare.com/${this.state.coinList[coin].ImageUrl}`} />}
                </CoinTile> 
            } catch (error) {
                return <CoinTile>
                    <CoinHeader>
                        <div>UNKNOWN SYMBOL</div>
                        <CoinSymbol>{coin}</CoinSymbol>
                    </CoinHeader>
                </CoinTile> 
            }
        } ) }
    </CoinGrid>
}

import React from 'react';
import styled from 'styled-components';
import { backgroundColor2, fontSize2 } from './Style';
import { WhiteText } from './Text';

const SearchContainer = styled.div`
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-gap: 20px;
`

const SearchInput = styled.input`
    justify-self: center left;
    ${backgroundColor2}
    color: #1163c9;
    border: 1px solid;
    ${fontSize2}
    margin: 5px;
    height: 25px;
    place-self: center left;
`

export default function() {
    return <SearchContainer>
        <WhiteText>Search All Coins</WhiteText>
        <SearchInput onKeyUp={this.filterCoins} />
    </SearchContainer>
}

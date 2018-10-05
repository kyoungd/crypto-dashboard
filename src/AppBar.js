import React from 'react';
import styled, {css} from 'styled-components';

const Logo = styled.div`
  font-size:1.5em;
`

const ControlButton = styled.div`
  cursor: pointer;
  ${props => props.active && css`
    text-shadow: 0px 0px 60px #03ff03;
    font-size:1.15em;
  `}
`

const Bar = styled.div`
  display:grid;
  grid-template-columns: 180px auto 100px 100px;
  margin-bottom: 40px;
`
// user function instead of arrow to maintain this context.
export default function () {
    return <Bar>
    <Logo>
      CRYPTO LIST
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
}

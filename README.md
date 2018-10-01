# Used create-react-app to initialize a template.
mkdir crypto-dash
cd crypto-dash
create-react-app .

# added styled-components
npm install styled-components

# select google font do-hyeon
https://fonts.google.com/specimen/Do+Hyeon


# you can run react code and inject css using the styled-components.
const ControlButton = styled.div`
  cursor: pointer;
  ${props => props.active && css`
    text-shadow: 0px 0px 60px #03ff03;
    font-size:1.1em;
  `}
`

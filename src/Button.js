import styled from 'styled-components';
import { fontSize1, greenBoxShadow, color3, subtleGreenBoxShadow } from './Style';

export const ConfirmButton = styled.div`
    margin: 20px;
    color: ${color3}
    ${fontSize1} 
    font-family: Exo 2, sans-serif;
    padding: 5px;
    ${subtleGreenBoxShadow}
    &:hover {
    ${greenBoxShadow} 
    cursor: pointer;
    }
`

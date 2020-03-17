import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin:0;
    padding:0;
    outline:0;
    box-sizing: border-box;
  }

  html, body, #root{
    min-height: 100%;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }

  body{
    background: #000014;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button{
    color: #fff;
    font-size: 12px;
    font-family: Arial, Helvetica, sans-serif;
  }

  button{
    cursor: pointer;
  }
`;

//기본 여백 모두 제거 
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    }
      *{ box-sizing:border-box; }
  html, body, #root { height:100%; }
  body{
    margin:0;
    font-family:"Pretendard GOV Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
    background:#fff;
    color:#1d1d1d;
  }
`;

export default GlobalStyle;
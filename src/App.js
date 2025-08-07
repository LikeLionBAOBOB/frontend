import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './routes'; //routes.js에서 작성한 모든 라우팅 정보 끌어옴 
import GlobalStyle from './styles/GlobalStyle'; //전역 스타일 추가(기본 여백 제거)

function App() {
  return (
    <Routes>
      {routes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ConcertList from './pages/ConcertList';
import ConcertDetail from './pages/ConcertDetail';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />

        {/* 콘서트 페이지 */}
        <Route path="/concert" element={<ConcertList />} />

        {/* 콘서트 상세 페이지 */}
        <Route path="/concert/:id" element={<ConcertDetail />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />
      </Route>

      {/* layout 적용되지 않는 페이지 */}
      <Route path="/admin" element={<div>관리자 페이지 (헤더 없음)</div>} />
    </Routes>
  );
}

export default App;
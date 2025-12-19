import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />

        {/* 콘서트 페이지 (예시) */}
        <Route path="/concert" element={<div className="text-center py-20">콘서트 목록 페이지</div>} />

        {/* 로그인 페이지 (예시) */}
        <Route path="/login" element={<div className="text-center py-20">로그인 페이지</div>} />
      </Route>

      {/* layout 적용되지 않는 페이지 */}
      <Route path="/admin" element={<div>관리자 페이지 (헤더 없음)</div>} />
    </Routes>
  );
}

export default App;
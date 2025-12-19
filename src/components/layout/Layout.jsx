// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더는 항상 위에 고정 */}
      <Header />
      
      {/* 여기가 바뀌는 부분 (페이지 내용) */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* 푸터는 항상 바닥에 */}
      <Footer />
    </div>
  );
};

export default Layout;
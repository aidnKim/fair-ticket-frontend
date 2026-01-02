// src/components/layout/Header.jsx
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* 1단: 로고, 검색창, 유저 메뉴 */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="text-3xl font-bold text-blue-600 tracking-tighter">
          FAIR Ticket
        </Link>

        {/* 검색창 (DaisyUI input 활용) */}
        <div className="flex-1 max-w-lg mx-8">
          <input
            type="text"
            placeholder="뮤지컬, 콘서트, 연극 등 검색"
            className="input input-bordered w-full h-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* 유저 메뉴 */}
        <div className="flex gap-4 text-sm text-gray-600 font-medium">
          <Link to="/login" className="hover:text-red-600">로그인</Link>
          <Link to="/mypage" className="hover:text-red-600">마이페이지</Link>
        </div>
      </div>

      {/* 2단: 네비게이션 메뉴 */}
      <nav className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-8 py-3 text-base font-bold text-gray-800">
            <li className={`cursor-pointer ${location.pathname === '/' ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'hover:text-red-600'}`}>
              <Link to="/">홈</Link>
            </li>
            <li className={`cursor-pointer ${location.pathname === '/concert' ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'hover:text-red-600'}`}>
              <Link to="/concert">콘서트</Link>
            </li>
            <li className="hover:text-red-600 cursor-pointer">뮤지컬</li>
            <li className="hover:text-red-600 cursor-pointer">스포츠</li>
            <li className="hover:text-red-600 cursor-pointer">전시/행사</li>
            <li className="hover:text-red-600 cursor-pointer">클래식/무용</li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
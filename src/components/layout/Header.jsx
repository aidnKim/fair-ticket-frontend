// src/components/layout/Header.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');

  // URL의 search 파라미터와 동기화
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchKeyword(urlSearch);
  }, [searchParams]);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/concert?search=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* 1단: 로고, 검색창, 유저 메뉴 */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="text-3xl font-bold text-blue-600 tracking-tighter">
          FAIR Ticket
        </Link>

        {/* 검색창 (DaisyUI input 활용) */}
        <div className="flex-1 max-w-lg mx-8 relative">
          <input
            type="text"
            placeholder="콘서트 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full h-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 pl-4 pr-10"
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

          </button>
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
            <li className={`cursor-pointer ${location.pathname.startsWith('/concert') ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'hover:text-red-600'}`}>
              <Link to="/concert">콘서트</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
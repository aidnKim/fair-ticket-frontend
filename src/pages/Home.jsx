// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


function Home() {
  // 가짜 카운팅 효과 (나중에 WebSocket 데이터로 교체)
  const [blockedCount, setBlockedCount] = useState(0);

  //공연 데이터를 담을 State 생성
  const [upcomingConcerts, setUpcomingConcerts] = useState([]);

  //로딩 상태와 에러 상태 관리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 페이지 로드 시 누적값 조회
    const fetchBlockedCount = async () => {
        try {
            const res = await api.get('/v1/admin/blocked-count');
            setBlockedCount(res.data.blockedCount);
        } catch (err) {
            console.error('차단 수 조회 실패:', err);
        }
    };
    fetchBlockedCount();

    const socket = new SockJS(`${window.location.origin}/ws`);
    const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            stompClient.subscribe('/topic/blocked-count', (message) => {
                const data = JSON.parse(message.body);
                setBlockedCount(data.blockedCount);
            });
        },
    });
    stompClient.activate();
    return () => stompClient.deactivate();
}, []);

  // 공연 데이터
  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const res = await api.get("/v1/concerts");
        setUpcomingConcerts(res.data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        setError("공연 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false); // 로딩 끝
      }
    }
    fetchConcert();
  }, [])

  // 로딩 중일 때 보여줄 화면
  if (loading) {
    return <div className="text-center py-20">데이터를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  const handleAttackSimulation = async () => {
    try {
        const res = await api.post('/v1/admin/simulate-attack');
        console.log('시뮬레이션 시작:', res.data);
    } catch (err) {
        console.error('시뮬레이션 실패:', err);
    }
  };


  return (
    <div className="w-full">
      {/* 안내 배너 */}
      <div className="bg-slate-800 text-gray-300 text-sm text-center py-2 px-4">
        ⚡ 본 서비스는 포트폴리오 프로젝트로, 무료 클라우드 서버에서 운영되어 응답이 다소 느릴 수 있습니다.
      </div>

      {/* 섹션 1: Hero Section (보안 대시보드 컨셉) */}
      <section className="relative bg-slate-900 text-white py-20 px-4 overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-slate-900 opacity-90 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            공정한 예매의 시작, <span className="text-red-500">FairTicket</span>
          </h1>
          <p className="text-gray-300 text-lg mb-12">
            AI 기반 매크로 탐지 시스템이 당신의 소중한 기회를 지킵니다.
          </p>

          {/* 대시보드 박스 */}
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-sm text-gray-400 mb-2 font-mono uppercase tracking-widest">
              Live Security Status
            </div>
            <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
              {/* 카운터 */}
              <div className="text-center">
                <div className="text-5xl font-black text-red-500 font-mono">
                  {blockedCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  🚫 실시간 차단된 비정상 접근
                </div>
              </div>

              <div className="hidden md:block w-px h-16 bg-gray-600"></div>

              {/* 상태 표시 */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 flex items-center gap-2 justify-center">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Active
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  Fair-Guard 시스템 가동 중
                </div>
                {/* 시뮬레이션 버튼 */}
                <button
                    onClick={handleAttackSimulation}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition"
                >
                    🔴 매크로 공격 시뮬레이션
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 2: 티켓 오픈 임박 (간단 리스트) */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">🔥 티켓 오픈 임박</h2>
          <Link to="/concert" className="text-sm text-gray-500 hover:text-red-600 font-medium">
            전체보기 &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {upcomingConcerts.map((concert) => (
            <Link to={`/concert/${concert.id}`} key={concert.id} className="group">
              <div key={concert.id} className="group cursor-pointer">
                {/* 포스터 이미지 */}
                <div className="relative overflow-hidden rounded-lg shadow-md aspect-[3/4] mb-3">
                  <img
                    src={concert.imageUrl}
                    alt={concert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                  {concert.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {concert.startDate.split('T')[0]} ~ {concert.endDate.split('T')[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ConcertDetail = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const navigate = useNavigate();
  
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null); // 선택된 회차 ID

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/v1/concerts/${id}`);
        setConcert(res.data);
      } catch (err) {
        alert("공연 정보를 불러오지 못했습니다.");
        navigate('/concert');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleBooking = () => {
    if (!selectedScheduleId) {
      alert("관람하실 회차를 선택해주세요!");
      return;
    }
    // 로그인 체크 후 예매 페이지로 이동
    const isLoggedIn = !!localStorage.getItem('accessToken');
    // 로그인 안 되어있으면 로그인 페이지로 + 현재 경로(또는 예매 경로) 전달
    if (!isLoggedIn) {
        if(window.confirm("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?")) {
            navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        }
        return;
    }

    // 선택된 스케줄 객체 찾기 (날짜 정보를 얻기 위해)
    const selectedSchedule = concert.schedules.find(s => s.id === selectedScheduleId);

    // 날짜와 시간을 보기 좋게 가공
    const dateObj = new Date(selectedSchedule.concertDate);
    const dateStr = dateObj.toLocaleDateString(); // 예: 2026. 1. 4.
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); // 예: 19:00

    navigate(`/queue/${selectedScheduleId}`, {
     state: {
        // 알고 있는 정보를 state 로 넘겨주면 Booking 페이지에서 API 로딩 전에 미리 보여줄 수 있음
        title: concert.title,
        date: `${dateStr} ${timeStr}`, // "2026. 1. 4. 19:00" 형태로 합쳐서 보냄
     }
    });
  };

  if (loading) return <div className="text-center py-40">로딩 중...</div>;
  if (!concert) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 상단: 공연 정보 & 예매 옵션 */}
      <div className="flex flex-col md:flex-row gap-10 mb-16">
        {/* 포스터 이미지 */}
        <div className="w-full md:w-1/3 shrink-0">
          <img 
            src={concert.imageUrl} 
            alt={concert.title} 
            className="w-full rounded-xl shadow-lg aspect-[3/4] object-cover"
          />
        </div>

        {/* 정보 및 옵션 선택 */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
              단독판매
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
              TEST DATA
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{concert.title}</h1>
            <p className="text-lg text-gray-600 mb-2">📍 {concert.venue}</p>
            <p className="text-gray-500">
                📅 {concert.startDate.split('T')[0]} ~ {concert.endDate.split('T')[0]}
            </p>
          </div>

          {/* 회차 선택 영역 */}
          <div className="flex-grow">
            <h3 className="text-lg font-bold mb-4">회차 선택</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {concert.schedules.map((schedule) => {
                // 날짜 포맷팅 (예: 2026-05-01 19:00)
                const dateObj = new Date(schedule.concertDate);
                const dateStr = dateObj.toLocaleDateString();
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <button
                    key={schedule.id}
                    onClick={() => setSelectedScheduleId(schedule.id)}
                    className={`p-4 rounded-lg border text-left transition-all
                      ${selectedScheduleId === schedule.id 
                        ? 'border-red-500 bg-red-50 ring-1 ring-red-500' 
                        : 'border-gray-200 hover:border-red-300'
                      }`}
                  >
                    <div className="font-bold text-gray-800">{dateStr}</div>
                    <div className="text-sm text-gray-500 mb-1">{timeStr}</div>
                    <div className="text-xs text-red-500 font-medium">
                        잔여 {schedule.availableSeats}석
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 예매 버튼 (하단 고정 느낌) */}
          <button 
            onClick={handleBooking}
            className="w-full bg-red-600 text-white text-xl font-bold py-5 rounded-xl hover:bg-red-700 transition-colors shadow-lg"
          >
            예매하기
          </button>
          <p className='text-gray-500'>
            ※ 본 상품은 테스트 상품으로 실제 예매가 진행되지 않습니다.
          </p>
        </div>
      </div>

      {/* 하단: 상세 이미지 (긴 설명) */}
      <div className="border-t border-gray-200 pt-10">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">공연 상세 정보</h3>
        <div className="w-full flex justify-center bg-gray-50 rounded-xl overflow-hidden p-4">
            {/* 이미지가 너무 크면 로딩이 오래 걸릴 수 있으니 loading="lazy" */}
            <img 
                src={concert.detailImageUrl} 
                alt="상세정보" 
                className="max-w-full"
                loading="lazy" 
            />
        </div>
      </div>
    </div>
  );
};

export default ConcertDetail;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MyPage = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 백엔드에서 내 예매 내역 가져오기
    const fetchReservations = async () => {
      try {
        const response = await api.get('/v1/reservations/my');
        setReservations(response.data);
      } catch (error) {
        console.error("예매 내역 조회 실패:", error);
        // alert("예매 내역을 불러오지 못했습니다.");
        // 에러 나도 일단 빈 배열로 둬서 화면이 깨지지는 않게 처리
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    // 1초마다 화면 갱신 (카운트다운용)
    const timer = setInterval(() => {
      setReservations(prev => [...prev]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 남은 시간 계산 (expireTime까지)
  const calculateRemainingTime = (expireTime) => {
    const now = new Date();
    const expire = new Date(expireTime);
    const diff = expire - now;
    if (diff <= 0) return null;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  };

  // 예매 취소 핸들러
  const handleCancel = async (reservationId) => {
    if (window.confirm("정말로 예매를 취소하시겠습니까?")) {
    try {
      await api.delete(`/v1/reservations/${reservationId}`);
      alert("예매가 취소되었습니다.");
      // 예매 내역 다시 불러오기
      const response = await api.get('/v1/reservations/my');
      setReservations(response.data);
    } catch (error) {
      console.error("예매 취소 실패:", error);
      alert("예매 취소에 실패했습니다.");
    }
  }
  };

  const goToPayment = (ticket) => {
    navigate('/payment', {
      state: {
        reservationId: ticket.reservationId,
        title: ticket.concertTitle,
        date: ticket.concertDate,
        seat: {
          grade: ticket.seatGrade,
          seatNum: ticket.seatNum,
          price: ticket.price
        },
        expireTime: ticket.expireTime
      }
    });
  };

  if (loading) {
    return <div className="text-center py-20">예매 내역을 불러오는 중...</div>;
  }

  // 상태별로 예매 분류
  const pendingReservations = reservations.filter(r => r.status === 'PENDING');
  const paidReservations = reservations.filter(r => r.status === 'PAID');
  const cancelledReservations = reservations.filter(r => r.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h2>
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
          
          {/* 결제 대기 중 (PENDING) */}
          {pendingReservations.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold border-b pb-4 mb-6 text-yellow-600">
                ⏳ 결제 대기 중 ({pendingReservations.length}건)
              </h3>
              <div className="space-y-4">
                {pendingReservations.map((ticket) => (
                  <div 
                    key={ticket.reservationId} 
                    className="border-2 border-yellow-400 bg-yellow-50 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center"
                  >
                    {/* 왼쪽: 공연 정보 */}
                    <div className="flex-1 space-y-2 text-center md:text-left mb-4 md:mb-0">
                      <h4 className="text-2xl font-bold text-gray-900">{ticket.concertTitle}</h4>
                      <p className="text-lg text-gray-700">{ticket.concertDate}</p>
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                          {ticket.seatGrade}석
                        </span>
                        <span className="text-gray-600 font-medium">{ticket.seatNum}</span>
                      </div>
                    </div>
                    {/* 오른쪽: 남은 시간 및 버튼 */}
                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[180px]">
                      {calculateRemainingTime(ticket.expireTime) ? (
                        <span className="text-red-500 font-bold text-lg">
                          ⏱ {calculateRemainingTime(ticket.expireTime)} 남음
                        </span>
                      ) : (
                        <span className="text-gray-500 font-bold text-lg">
                          ⏱ 만료됨
                        </span>
                      )}
                      <span className="text-xl font-bold text-gray-900">
                        {ticket.price?.toLocaleString()}원
                      </span>
                      {calculateRemainingTime(ticket.expireTime) ? (
                        <button
                          onClick={() => goToPayment(ticket)}
                          className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700"
                        >
                          결제하기
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-400 text-white font-bold py-3 px-6 rounded-lg cursor-not-allowed"
                        >
                          만료됨
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 예매 완료 (PAID) */}
          <div className="mb-8">
            <h3 className="text-xl font-bold border-b pb-4 mb-6">
              ✅ 예매 완료 ({paidReservations.length}건)
            </h3>
            
            {paidReservations.length === 0 ? (
              <div className="text-center text-gray-400 py-10">
                <p>예매 완료된 공연이 없습니다.</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 text-red-600 font-bold hover:underline"
                >
                  공연 보러 가기 &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paidReservations.map((ticket) => (
                  <div 
                    key={ticket.reservationId} 
                    className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition-shadow bg-white"
                  >
                    {/* 왼쪽: 공연 정보 */}
                    <div className="flex-1 space-y-2 text-center md:text-left mb-4 md:mb-0">
                      <div className="text-sm text-gray-500 mb-1">
                        No. {ticket.reservationId} | 예매일 {ticket.reservedAt}
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900">{ticket.concertTitle}</h4>
                      <p className="text-lg text-gray-700">{ticket.concertDate}</p>
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                          {ticket.seatGrade}석
                        </span>
                        <span className="text-gray-600 font-medium">{ticket.seatNum}</span>
                      </div>
                    </div>
                    {/* 오른쪽: 상태 및 버튼 */}
                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                        예매 완료
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {ticket.price?.toLocaleString()}원
                      </span>
                      <button
                        onClick={() => handleCancel(ticket.reservationId)}
                        className="text-sm text-gray-500 underline hover:text-red-600 transition-colors"
                      >
                        예매 취소
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 취소된 예매 (CANCELLED) - 접어두기 */}
          {cancelledReservations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold border-b pb-4 mb-6 text-gray-400">
                취소된 예매 ({cancelledReservations.length}건)
              </h3>
              <div className="space-y-4 opacity-60">
                {cancelledReservations.map((ticket) => (
                  <div 
                    key={ticket.reservationId} 
                    className="border rounded-lg p-6 bg-gray-50"
                  >
                    <div className="text-gray-500">
                      <span className="font-bold">{ticket.concertTitle}</span>
                      <span className="ml-2">{ticket.concertDate}</span>
                      <span className="ml-4 text-red-400">취소됨</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyPage;
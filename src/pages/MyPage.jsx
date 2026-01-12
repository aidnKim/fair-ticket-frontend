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

  if (loading) {
    return <div className="text-center py-20">예매 내역을 불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">마이페이지</h2>

        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
          <h3 className="text-xl font-bold border-b pb-4 mb-6">나의 예매 내역</h3>

          {reservations.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              <p>아직 예매한 공연이 없습니다.</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 text-red-600 font-bold hover:underline"
              >
                공연 보러 가기 &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reservations.map((ticket) => (
                // 티켓 카드 UI
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
                    <p className="text-lg text-gray-700">
                      {ticket.concertDate}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                        {ticket.seatGrade}석
                      </span>
                      <span className="text-gray-600 font-medium">
                        {ticket.seatNum}
                      </span>
                    </div>
                  </div>

                  {/* 오른쪽: 상태 및 버튼 */}
                  <div className="flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold 
                      ${ticket.status === 'CONFIRMED' || ticket.status === 'PAID'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'}`
                    }>
                      {ticket.status === 'PAID' ? '예매 완료' : '취소됨'}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {ticket.price.toLocaleString()}원
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
      </div>
    </div>
  );
};

export default MyPage;
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const Booking = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams(); // URL에서 스케줄 ID 가져오기
  const location = useLocation(); 
  
  // ConcertDetail에서 보낸 state가 있으면 사용하고, 없으면(새로고침 시) 기본 문구 표시
  const title = location.state?.title || "공연 정보 불러오는 중...";
  const date = location.state?.date || "날짜 정보 불러오는 중...";

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null); // 사용자가 선택한 좌석
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        // 백엔드에 "이 스케줄(scheduleId)의 좌석 정보를 다 줘!"라고 요청
        // 예: GET /v1/schedules/3/seats
        const response = await api.get(`/v1/concerts/${scheduleId}/seats`);
        
        // 받아온 데이터를 state에 저장
        setSeats(response.data); 
      } catch (error) {
        console.error("좌석 정보를 불러오는데 실패했습니다.", error);
        alert("좌석 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false); // 성공하든 실패하든 로딩 끝
      }
    };

    if (scheduleId) {
      fetchSeats();
    }
  }, [scheduleId]);

  // 좌석을 행별로 그룹화하는 함수
  const groupSeatsByRow = (seats) => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.seatRow]) {
        grouped[seat.seatRow] = [];
      }
      grouped[seat.seatRow].push(seat);
    });
    // 각 행 내에서 열 번호 순으로 정렬
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => a.seatCol - b.seatCol);
    });
    return grouped;
  };

  // 좌석 상태 확인 (AVAILABLE이 아니면 예약됨)
  const isReserved = (seat) => seat.status !== 'AVAILABLE';

  // 좌석 클릭 핸들러
  const handleSeatClick = (seat) => {
    if (isReserved(seat)) return; // 이미 팔린 좌석은 클릭 금지

    // 이미 선택된 좌석을 또 누르면 취소, 아니면 선택
    if (selectedSeat && selectedSeat.seatId === seat.seatId) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat(seat);
    }
  };

  // 결제하기 버튼 핸들러
  const handlePayment = async () => {
    if (!selectedSeat) {
      alert("좌석을 선택해주세요!");
      return;
    }

    try {
        // 1. 예약 생성 API 호출 (임시 점유)
        const response = await api.post('/v1/reservations', {
            scheduleId: scheduleId,
            seatId: selectedSeat.seatId
        });
        
        const reservationId = response.data; // 백엔드에서 반환한 예약 ID
        
        // 2. 결제 페이지로 이동 (reservationId 포함!)
        navigate('/payment', { 
            state: { 
                seat: selectedSeat,
                title: title,
                date: date,
                reservationId: reservationId  // 추가!
            } 
        });
    } catch (error) {
        alert(error.response?.data?.error || "좌석 선점에 실패했습니다.");
    }

  };

  if (loading) {
    return <div className="text-center py-20">좌석 정보를 불러오는 중입니다...</div>;
  }

  // 좌석을 행별로 그룹화
  const seatsByRow = groupSeatsByRow(seats);
  const rowKeys = Object.keys(seatsByRow).sort(); // A, B, C... 순서

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">{date} 회차 예매</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* 좌석 배치도 */}
          <div className="flex-1 bg-white p-8 rounded-xl shadow-lg">
            <div className="w-full bg-gray-800 text-white text-center py-2 mb-10 rounded-md text-sm">
              STAGE
            </div>
            
            {/* 좌석 그리드: 행별로 렌더링 */}
            <div className="space-y-2">
              {rowKeys.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  {/* 행 라벨 */}
                  <span className="w-6 text-center font-bold text-gray-600">{row}</span>
                  
                  {/* 해당 행의 좌석들 */}
                  <div className="flex gap-1">
                    {seatsByRow[row].map((seat) => (
                      <button
                        key={seat.seatId}
                        onClick={() => handleSeatClick(seat)}
                        disabled={isReserved(seat)}
                        className={`
                          w-8 h-8 rounded-t-lg text-xs font-bold transition-all
                          ${isReserved(seat)
                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed' 
                            : selectedSeat?.seatId === seat.seatId
                              ? 'bg-red-600 text-white transform scale-110 shadow-md' 
                              : seat.grade === 'VIP'
                                ? 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200'
                                : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                          }
                        `}
                        title={`${seat.grade}석 ${seat.seatLabel}`}
                      >
                        {seat.seatCol}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* 범례 */}
            <div className="flex justify-center gap-4 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 rounded-sm"></div> VIP
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-100 rounded-sm"></div> R석
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600 rounded-sm"></div> 선택중
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-sm"></div> 예매완료
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 */}
          <div className="w-full md:w-80">
            <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
              <h3 className="text-lg font-bold border-b pb-4 mb-4">선택 내역</h3>
              {selectedSeat ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">좌석 등급</span>
                    <span className="font-medium">{selectedSeat.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">좌석 번호</span>
                    <span className="font-bold text-red-600">{selectedSeat.seatLabel}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4 mt-4">
                    <span className="font-bold text-lg">결제 금액</span>
                    <span className="font-bold text-xl text-red-600">
                      {selectedSeat.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">좌석을 선택해주세요.</div>
              )}
              
              <button
                onClick={handlePayment}
                disabled={!selectedSeat}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${selectedSeat ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                예매하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Booking 페이지에서 넘겨준 데이터 받기
  // (좌석 정보, 공연 제목, 날짜 등)
  const { seat, title, date, reservationId, expireTime } = location.state || {};
  
  // 초기값을 즉시 계산하는 함수
  const calculateTimeLeft = (expireTime) => {
    if (!expireTime) return null;
    const now = new Date();
    const expire = new Date(expireTime);
    const diff = expire - now;
    
    if (diff <= 0) return null;
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  };
  // 초기값을 바로 계산해서 넣기!
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(expireTime));

  useEffect(() => {
    if (!expireTime) return;
    // 1초마다 업데이트
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expireTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [expireTime]);

  // 데이터가 없으면 예약 페이지로 쫓아냄 (잘못된 접근)
  useEffect(() => {
    if (!seat) {
      alert("잘못된 접근입니다.");
      navigate(-1);
    }
  }, [seat, navigate]);

  if (!seat) return null; // 렌더링 방지

  // 결제 요청 함수 (포트원 연동)
  const requestPay = async () => {
    if (!window.IMP) return; // 라이브러리 로딩 확인

    try {
      // 1. 백엔드에서 주문번호 받아오기
      const response = await api.get('/v1/payments/prepare');
      const merchantUid = response.data; // 백엔드가 준 주문번호 (예: ORD-dwq12...)

      console.log("서버에서 받은 주문번호:", merchantUid);

      const { IMP } = window;
      IMP.init('imp01626243');

      // 2. 받아온 merchantUid를 넣어서 결제 요청
      IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: merchantUid,
        name: `${title} - ${seat.grade}석`,
        amount: seat.price,
        buyer_email: 'test@portone.io',
        buyer_name: '홍길동',
        buyer_tel: '010-1234-5678',
      }, async (rsp) => {
        if (rsp.success) {
          // 결제 성공 시 로직
          console.log("결제 성공:", rsp);
          
          try {
            console.log("보내는 데이터:", {
                impUid: rsp.imp_uid,
                merchantUid: rsp.merchant_uid,
                reservationId: reservationId
            });

            // 1. 백엔드에 결제 검증 및 예매 저장 요청
            // rsp.imp_uid: 포트원 거래 고유 ID
            // rsp.merchant_uid: 우리가 만든 주문 ID
            await api.post('/v1/payments', {
              impUid: rsp.imp_uid,
              merchantUid: rsp.merchant_uid,
              reservationId: reservationId 
            });

            alert("결제가 완료되었습니다!");
            navigate('/mypage'); // 마이페이지로 이동

          } catch (error) {
            console.error("서버 저장 실패:", error);
            // BE 에서 결제 자동 취소 후 안내
            alert(error.response?.data?.error || error.response?.data?.message || "결제 처리 중 문제가 발생했습니다. 자동 환불됩니다.");
          }

        } else {
          // 결제 실패 시 로직
          alert(`결제에 실패하였습니다. 에러 내용: ${rsp.error_msg}`);
        }
      });

    } catch (error) {
      console.error("주문번호 생성 실패:", error);
      alert("결제를 시작할 수 없습니다. (주문번호 생성 실패)");
    }
  };

  // 테스트 결제 함수 (실제 결제 없이)
  const requestTestPay = async () => {
    try {
      // 백엔드 테스트 결제 API 호출
      await api.post('/v1/payments/test', {
        reservationId: reservationId
      });

      alert("테스트 결제가 완료되었습니다!");
      navigate('/mypage');

    } catch (error) {
      console.error("테스트 결제 실패:", error);
      alert(error.response?.data?.message || "테스트 결제에 실패했습니다.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-red-600 px-6 py-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">결제 확인</h2>
          {timeLeft ? (
            <span className="text-lg font-bold">⏱ {timeLeft}</span>
          ) : (
            <span className="text-lg font-bold">⏱ 만료됨</span>
          )}
        </div>

        {/* 주문 정보 요약 */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">공연 제목</p>
            <p className="text-lg font-bold text-gray-800">{title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">일시</p>
            <p className="text-gray-800">{date}</p>
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">선택 좌석</p>
              <p className="text-gray-800 font-medium">
                {seat.grade}석 / {seat.seatNum}
              </p>
            </div>
          </div>
        </div>

        {/* 최종 금액 및 버튼 */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-600 font-medium">최종 결제 금액</span>
            <span className="text-3xl font-bold text-red-600">
              {seat.price.toLocaleString()}원
            </span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-700">
            💡 <strong>안내:</strong> 결제를 완료하지 않고 나가셔도, 
            <strong>마이페이지</strong>에서 5분 이내에 이어서 결제하실 수 있습니다.
          </div>

          {/* 실제 결제 버튼 */}
          <button
            onClick={requestPay}
            disabled={!timeLeft}
            className={`w-full font-bold py-4 rounded-xl text-lg transition shadow-md
              ${timeLeft 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-400 text-white cursor-not-allowed'}`}
          >
            {timeLeft ? '결제하기' : '시간 만료'}
          </button>

          {/* 테스트 결제 버튼 */}
          <button
            onClick={requestTestPay}
            disabled={!timeLeft}
            className={`w-full mt-3 font-bold py-4 rounded-xl text-lg transition shadow-md
              ${timeLeft 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-gray-400 text-white cursor-not-allowed'}`}
          >
            {timeLeft ? '테스트 결제' : '시간 만료'}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            ※ 테스트 결제는 실제 결제가 진행되지 않습니다
          </p>
          
          <button
             onClick={() => navigate(-1)}
             className="w-full mt-3 text-gray-500 text-sm underline hover:text-gray-700"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
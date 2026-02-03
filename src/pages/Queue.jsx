import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../api';

const Queue = () => {

  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [canEnter, setCanEnter] = useState(false);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  // 사용자 이메일 (JWT에서 추출 또는 저장된 값 사용)
  const email = localStorage.getItem('userEmail') || 'test@test.com';

  useEffect(() => {
    // 1. 대기열 등록
    const enterQueue = async () => {
      try {
        const res = await api.post(`/v1/queue/${scheduleId}`);
        setPosition(res.data.position);
      } catch (err) {
        console.error('대기열 등록 실패:', err);
        alert('대기열 등록에 실패했습니다.');
      }
    };

    enterQueue();

    // 2. WebSocket 연결
    const socket = new SockJS(`${window.location.origin}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setConnected(true);
        
        // 전체 대기열 업데이트 구독
        stompClient.subscribe(`/topic/queue/${scheduleId}`, (message) => {
          const data = JSON.parse(message.body);
          if (data.type === 'QUEUE_UPDATE') {
            // 순번 다시 조회
            checkPosition();
          }
        });
        // 개인 입장 알림 구독
        stompClient.subscribe(`/topic/queue/${scheduleId}/${email}`, (message) => {
          const data = JSON.parse(message.body);
          if (data.type === 'ENTER_ALLOWED' && data.canEnter) {
            setCanEnter(true);
          }
        });
      },
      onDisconnect: () => setConnected(false),
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    // 3. 주기적 순번 확인 (폴링 백업)
    const interval = setInterval(checkPosition, 3000);
    return () => {
      clearInterval(interval);
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [scheduleId, email]);

  const checkPosition = async () => {
    try {
      const res = await api.get(`/v1/queue/${scheduleId}/position`);
      setPosition(res.data.position);
      if (res.data.canEnter) {
        setCanEnter(true);
      }
    } catch (err) {
      console.error('순번 조회 실패:', err);
    }
  };

  const handleEnter = () => {
    navigate(`/booking/${scheduleId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 text-center shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">🎫 대기열</h1>
        
        {canEnter ? (
          <>
            <div className="text-6xl mb-6">🎉</div>
            <p className="text-2xl font-bold text-green-600 mb-6">입장 가능합니다!</p>
            <button
              onClick={handleEnter}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-red-700 transition"
            >
              좌석 선택하러 가기
            </button>
          </>
        ) : (
          <>
            <div className="text-6xl font-bold text-red-600 mb-4">
              {position ?? '...'}
            </div>
            <p className="text-gray-600 mb-2">현재 대기 순번</p>
            <p className="text-sm text-gray-400 mb-6">
              잠시만 기다려주세요. 순번이 되면 자동으로 알려드립니다.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-gray-500">{connected ? '실시간 연결됨' : '연결 중...'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Queue;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // axios 인스턴스 (경로에 맞게 수정해주세요)

const Signup = () => {
  const navigate = useNavigate();

  // 입력 데이터를 하나의 상태로 관리
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // 비밀번호 확인용
    name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 클라이언트 유효성 검사 (비밀번호 일치 여부)
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }

    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: "USER"
      };

    //   console.log("서버로 보낼 데이터:", requestData); // 확인용 로그

      // 회원가입 요청
      await api.post('/v1/users/signup', requestData);

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate('/login');

    } catch (err) {
      console.error(err);
      // 에러 메시지가 백엔드에서 오면 그걸 보여주고, 아니면 기본 메시지
      const errorMessage = err.response?.data?.message || "회원가입에 실패했습니다.";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">회원가입</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 이름 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="홍길동"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="******"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="******"
              required
              className={`w-full px-4 py-2 border rounded-lg outline-none transition
                ${formData.confirmPassword && formData.password !== formData.confirmPassword 
                  ? 'border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:ring-red-500'}`}
            />
            {/* 비밀번호 불일치 시 메시지 표시 */}
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-300 mt-6"
          >
            가입하기
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button onClick={() => navigate('/login')} className="text-red-600 font-bold hover:underline">
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
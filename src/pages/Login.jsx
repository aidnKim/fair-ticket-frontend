import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // 이미 로그인되어 있으면 홈으로
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 백엔드로 로그인 요청
      const response = await api.post('/v1/users/login', formData);
      
      // 토큰 저장
      console.log("로그인 성공:", response.data);

      const token = response.data;
      localStorage.setItem('accessToken', token);

      alert("로그인 성공!");
      // redirect 파라미터가 있으면 그쪽으로, 없으면 홈으로
      const redirectPath = searchParams.get('redirect') || '/';
      navigate(redirectPath, { replace: true });

    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">로그인</h2>
          <p className="mt-2 text-sm text-gray-600">
            서비스 이용을 위해 로그인이 필요합니다.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="이메일 주소"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            로그인하기
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
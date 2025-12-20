// src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500">
        <div className="flex gap-4 mb-4 font-bold text-gray-700">
          <span>회사소개</span>
          <span>이용약관</span>
          <span>개인정보처리방침</span>
        </div>
        <div className="flex flex-col gap-1">
          <p>FairTicket (페어티켓) | 개발자: 김현수</p>
          <p>포트폴리오: <a href="https://github.com/aidnKim" target="_blank" className="hover:underline">https://github.com/aidnKim</a></p>
          <p>이메일: hyeonsookim2@gmail.com</p>
          <p className="mt-4">Copyright © FairTicket Corp. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
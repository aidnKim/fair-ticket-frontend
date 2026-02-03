# Fair Ticket (Frontend)

> **공정한 티켓 예매 시스템의 사용자 인터페이스(UI) 저장소입니다.**

## 프로젝트 소개
**AI 기반 매크로 탐지를 목표로 하는 공정한 콘서트 티켓 예매 시스템**입니다.
동시다발적인 좌석 선점 요청에서도 **데이터의 정합성(Data Integrity)** 을 보장하고, 
**Redis 기반 대기열 시스템**으로 서버 과부하를 방지합니다.
포트원(PortOne) 결제 연동을 통해 **안전한 결제 프로세스**를 제공합니다.

향후 Kafka, AI 기술을 단계적으로 도입하여 대용량 트래픽에서도 **공정한 예매 기회**를 보장하는 플랫폼으로 발전시킬 예정입니다.

<br>

## 안내 (Notice)
이 프로젝트의 **전체 아키텍처, DB 설계, 핵심 트러블 슈팅(동시성 제어) 내용**은 백엔드 저장소에 상세히 기술되어 있습니다.  
* **배포 주소:** [서비스 바로가기 (Click)](https://www.fairticket.store)

* **[Backend Repository 바로가기 (Click)](https://github.com/aidnKim/fair-ticket-backend)**

<br>

## 프론트엔드 기술 스택 (FE Tech Stack)
* **Core:** React 19, JavaScript (ES6+)
* **Styling:** Tailwind CSS
* **Routing:** React Router v7
* **Build Tool:** Vite 7
* **Communication:** Axios (API 연동)

<br>

## 주요 화면 (UI Preview)
<img width="100%" alt="Main Page" src="https://github.com/user-attachments/assets/3a3383ef-0827-4f18-a750-63327285935e" />
<br/><br/>

<img width="100%" alt="Queue Page" src="https://github.com/user-attachments/assets/0b5ed0a6-8882-4fe6-a03e-91e39d977b06" />
<br/><br/>

<img width="100%" alt="Booking Page" src="https://github.com/user-attachments/assets/10d619bf-3c19-4a84-8c31-533f68515193" />
<br/><br/>

<img width="100%" alt="Payment Page" src="https://github.com/user-attachments/assets/f99d277f-ec9a-49b7-b7fc-b45900e591c9" />

<br>

## 주요 기능
* **홈:** 티켓 오픈 임박 공연 목록, (예정) AI 매크로 차단 현황 대시보드
* **공연 목록/상세:** 공연 정보 조회, 회차별 스케줄 선택
* **좌석 선택:** 실시간 좌석 현황, 좌석 등급별 가격 표시
* **결제:** 포트원 결제창 연동, 결제 완료 후 상태 업데이트
* **마이페이지:** 예약 내역 조회, 예약 취소 (환불)
* **대기열:** 인기 공연 오픈 시 순차적 입장 안내, 실시간 순번 표시

<br>

## 실행 방법 (How to Run)
```bash
# 1. 저장소 복제
git clone [https://github.com/aidnKim/fair-ticket-frontend.git](https://github.com/aidnKim/fair-ticket-frontend.git)

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
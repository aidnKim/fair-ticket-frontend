# Fair Ticket (Frontend)

> **공정한 티켓 예매 시스템의 사용자 인터페이스(UI) 저장소입니다.**

## 프로젝트 소개
**AI 기반 매크로 탐지를 목표로 하는 공정한 콘서트 티켓 예매 시스템**입니다.
현재 MVP 단계로, 동시다발적인 좌석 선점 요청에서도 **데이터의 정합성(Data Integrity)** 을 보장하고, 포트원(PortOne) 결제 연동을 통해 **안전한 결제 프로세스**를 제공합니다. 
향후 Redis, Kafka, AI 기술을 단계적으로 도입하여 대용량 트래픽에서도 **공정한 예매 기회**를 보장하는 플랫폼으로 발전시킬 예정입니다.

<br>

## 안내 (Notice)
이 프로젝트의 **전체 아키텍처, DB 설계, 핵심 트러블 슈팅(동시성 제어) 내용**은 백엔드 저장소에 상세히 기술되어 있습니다.  
**[Backend Repository 바로가기 (Click)](https://github.com/aidnKim/fair-ticket-backend)**

<br>

## 프론트엔드 기술 스택 (FE Tech Stack)
* **Core:** React 19, JavaScript (ES6+)
* **Styling:** Tailwind CSS
* **Routing:** React Router v7
* **Build Tool:** Vite 7
* **Communication:** Axios (API 연동)

<br>

## 주요 화면 (UI Preview)
![Main Page](<img width="1918" height="886" alt="Image" src="https://github.com/user-attachments/assets/d77e3d6a-57ba-4af0-9afb-2c63971bc1ed" />)
![Booking Page](<img width="1918" height="882" alt="Image" src="https://github.com/user-attachments/assets/882a4621-9d8b-4459-8693-c635345b706e" />)

| 메인 페이지 | 좌석 선택 | 결제 페이지 |
| :--: | :--: | :--: |
| 공연 목록 및 보안 대시보드 | 실시간 좌석 현황 | 포트원 결제 연동 |

<br>

## 주요 기능
* **홈:** 티켓 오픈 임박 공연 목록, (예정) AI 매크로 차단 현황 대시보드
* **공연 목록/상세:** 공연 정보 조회, 회차별 스케줄 선택
* **좌석 선택:** 실시간 좌석 현황, 좌석 등급별 가격 표시
* **결제:** 포트원 결제창 연동, 결제 완료 후 상태 업데이트
* **마이페이지:** 예약 내역 조회, 예약 취소 (환불)

<br>

## 실행 방법 (How to Run)
```bash
# 1. 저장소 복제
git clone [https://github.com/aidnKim/fair-ticket-frontend.git](https://github.com/aidnKim/fair-ticket-frontend.git)

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npm run dev
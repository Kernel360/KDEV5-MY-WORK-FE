# MY-WORK

* 🧑‍💻 배포 URL: [https://www.kbe-mywork.com](https://www.kbe-mywork.com)  
* 📄 API 문서화: [https://api.kbe-mywork.com/swagger-ui/swagger-ui.html](https://api.kbe-mywork.com/swagger-ui/swagger-ui.html)

<br />

## 📝 1. 프로젝트 소개

본 서비스는 웹에이전시와 고객사 간의 프로젝트에서의 커뮤니케이션을 효율적으로 공유 및 관리할 수 있는 **프로젝트 관리 웹 시스템**입니다.

1. **업무 관리 게시글**  
   → 프로젝트별 업무 게시글을 통해 고객사와 개발사 간 하나의 플랫폼에서 원활하게 소통할 수 있습니다.

2. **프로젝트 단계 관리 커스터마이징**  
   → 프로젝트 단계 커스터마이징을 통해 유연한 프로젝트 관리를 할 수 있습니다.

3. **체크리스트를 통한 꼼꼼한 업무 관리**  
   → 체크리스트와 승인 기능을 통해 꼼꼼한 프로젝트 관리가 가능합니다.

<br />

## 🧑‍🔧 2. 서비스 기능

<details>
<summary>1. 역할 기반 대시보드</summary>
SYSTEM_ADMIN, DEV_ADMIN, CLIENT_ADMIN, 일반 사용자 권한 별로 다른 UI 제공
</details>

<details>
<summary>2. 실시간 알림 시스템 (SSE)</summary>
EventSource 기반으로 구현된 실시간 알림 기능
</details>

<details>
<summary>3. Presigned URL 기반 파일 업로드</summary>
S3 Presigned URL을 활용한 안전한 파일 업로드
</details>

<details>
<summary>4. Drag & Drop 인터페이스 (DnD Kit 활용)</summary>
직관적인 Drag & Drop 기능으로 프로젝트 단계/게시글 관리
</details>

<details>
<summary>5. Redux 기반 상태관리</summary>
Redux Toolkit을 활용한 전역 상태 관리
</details>

<details>
<summary>6. Recharts 기반 통계 시각화</summary>
대시보드에서 프로젝트 현황 시각화
</details>

<details>
<summary>7. Notistack 기반 알림 토스트</summary>
사용자에게 실시간 피드백 제공
</details>

<br />

## 👥 3. 팀원 (Team Member)

<table>
  <tr>
    <th>박병기</th>
    <th>강예주</th>
    <th>이수하</th>
    <th>함성준</th>
  </tr>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/48561660?v=4" width="150" height="150" alt="박병기"></td>
    <td><img src="https://avatars.githubusercontent.com/u/98391406?v=4" width="150" height="150" alt="강예주"></td>
    <td><img src="https://avatars.githubusercontent.com/u/106977054?v=4" width="150" height="150" alt="이수하"></td>
    <td><img src="https://avatars.githubusercontent.com/u/206319376?v=4" width="150" height="150" alt="함성준"></td> 
  </tr>
  <tr>
    <td><a href="https://github.com/pbg0205">@pbg0205</a></td>
    <td><a href="https://github.com/Yeju-Kang">@Yeju-Kang</a></td>
    <td><a href="https://github.com/leeesooha">@leeesooha</a></td>
    <td><a href="https://github.com/HMHMHMJUN">@HMHMHMJUN</a></td>
  </tr>
</table>

<br />

## 🛠️ 4. 기술 스택

<div align="left">

**🔧 빌드 도구**  
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white"/>

**🎨 UI 라이브러리**  
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"/> 
<img src="https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=Material-UI&logoColor=white"/>

**🧠 상태 관리**  
<img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=Redux&logoColor=white"/>

**🔀 라우팅**  
<img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white"/>

**🌐 HTTP 클라이언트**  
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>

**⏱ 날짜/시간**  
<img src="https://img.shields.io/badge/Day.js-2C3381?style=for-the-badge&logo=dayjs&logoColor=white"/>

**📊 차트**  
<img src="https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=Recharts&logoColor=white"/>

**💅 스타일링**  
<img src="https://img.shields.io/badge/Sass-CD6799?style=for-the-badge&logo=Sass&logoColor=white"/>

</div>

---

```bash
# 실행 방법 요약
npm install       # 패키지 설치
npm run dev       # 개발 서버 실행
npm run build     # 정적 파일 빌드
npm run lint      # 코드 스타일 검사
```

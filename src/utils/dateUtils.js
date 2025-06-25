import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

// dayjs 플러그인 및 로케일 설정
dayjs.extend(relativeTime);
dayjs.locale('ko');

/**
 * 알림 날짜를 규칙에 맞게 포맷하는 함수
 * @param {string} dateString - LocalDateTime 형식의 날짜 문자열
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatNotificationDate = (dateString) => {
  if (!dateString) return '';
  
  const notificationDate = dayjs(dateString);
  const now = dayjs();

  // 오늘인 경우 (예: "3시간 전")
  if (now.isSame(notificationDate, 'day')) {
    return notificationDate.fromNow();
  }
  
  const diffInDays = now.diff(notificationDate, 'day');

  // 일주일 이내인 경우 (예: "3일 전")
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  // 일주일을 초과한 경우 (예: "2024-06-20")
  return notificationDate.format('YYYY-MM-DD');
}; 
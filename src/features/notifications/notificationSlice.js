import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

// 임시 목업 데이터
const mockNotifications = [
  { id: 1, title: '새로운 리뷰 등록', content: '프로젝트 A의 "로그인 기능"에 새로운 리뷰가 달렸습니다.', date: dayjs().subtract(3, 'hour').format('YYYY-MM-DDTHH:mm:ss'), read: false },
  { id: 2, title: '결재 승인', content: '요청하신 "디자인 시안"이 승인되었습니다.', date: dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss'), read: false },
  { id: 3, title: '새로운 멤버 초대', content: '김민준님이 "마케팅팀"에 합류했습니다.', date: dayjs().subtract(3, 'day').format('YYYY-MM-DDTHH:mm:ss'), read: true },
  { id: 4, title: '서버 점검 안내', content: '오늘 오후 10시에 정기 서버 점검이 있습니다.', date: dayjs().subtract(10, 'day').format('YYYY-MM-DDTHH:mm:ss'), read: true },
];

const initialState = {
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.read).length,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // 여기에 나중에 알림을 읽음 처리하는 등의 reducer를 추가할 수 있습니다.
    markAsRead(state, action) {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
        state.unreadCount = state.notifications.filter(n => !n.read).length;
      }
    },
  },
});

export const { markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer; 
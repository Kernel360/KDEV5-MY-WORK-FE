import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotifications, readNotification } from "@/api/notification";

// 알림 목록 조회 Thunk
export const fetchNotifications = createAsyncThunk(
  "notification/fetchList",
  async ({ page, isRead }, { rejectWithValue }) => {
    try {
      const res = await getNotifications(page, isRead);
      return res.data.data.notificationSelectWebResponses; // NotificationListSelectWebResponse.notifications
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 알림 읽음 처리 Thunk
export const markNotificationsAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (ids, { rejectWithValue }) => {
    try {
      const res = await readNotification({ ids });
      return res.data.data; // NotificationReadWebResponse
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    readStatus: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 알림 목록 조회
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 알림 읽음 처리
      .addCase(markNotificationsAsRead.pending, (state) => {
        state.readStatus = "loading";
      })
      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        state.readStatus = "success";
        const readId = action.payload.id;
        // 읽은 항목의 isRead 값을 true로 변경
        state.notifications = state.notifications.map((n) =>
          n.id === readId ? { ...n, isRead: true } : n
        );
      })
      .addCase(markNotificationsAsRead.rejected, (state, action) => {
        state.readStatus = "error";
        state.error = action.payload;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

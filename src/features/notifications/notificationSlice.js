import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotifications, readNotification } from "@/api/notification";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (page, { rejectWithValue }) => {
    try {
      const res = await getNotifications(page);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const refreshNotifications = createAsyncThunk(
  "notifications/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getNotifications(1);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await readNotification({ id });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    readStatus: null,
  },
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const data = action.payload.notificationSelectWebResponses || [];
        if (state.page === 1) {
          state.notifications = data;
        } else {
          state.notifications = [...state.notifications, ...data];
        }
        state.page += 1;
        state.hasMore = data.length === 10;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasMore = false;
      })

      .addCase(markNotificationsAsRead.pending, (state) => {
        state.readStatus = "loading";
      })
      .addCase(markNotificationsAsRead.fulfilled, (state, action) => {
        state.readStatus = "success";
        const readId = action.payload.id;
        state.notifications = state.notifications.map((n) =>
          n.id === readId ? { ...n, isRead: true } : n
        );
      })
      .addCase(markNotificationsAsRead.rejected, (state, action) => {
        state.readStatus = "error";
        state.error = action.payload;
      })

      .addCase(refreshNotifications.fulfilled, () => {})
      .addCase(refreshNotifications.rejected, () => {});
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

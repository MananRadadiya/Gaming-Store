import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      id: 'n1',
      type: 'follower',
      message: 'NeonPhantom started following you',
      avatar: 'https://ui-avatars.com/api/?name=Neon+Phantom&background=00E0FF&color=000&bold=true&size=128',
      read: false,
      timestamp: '2026-02-23T10:00:00',
    },
    {
      id: 'n2',
      type: 'like',
      message: 'CyberViper liked your post',
      avatar: 'https://ui-avatars.com/api/?name=Cyber+Viper&background=FF6B35&color=fff&bold=true&size=128',
      read: false,
      timestamp: '2026-02-23T09:30:00',
    },
    {
      id: 'n3',
      type: 'comment',
      message: 'BlazeDemon commented: "That play was insane!"',
      avatar: 'https://ui-avatars.com/api/?name=Blaze+Demon&background=E63946&color=fff&bold=true&size=128',
      read: false,
      timestamp: '2026-02-23T08:45:00',
    },
    {
      id: 'n4',
      type: 'achievement',
      message: 'You unlocked "Tournament Champion" badge!',
      avatar: '',
      read: true,
      timestamp: '2026-02-22T20:00:00',
    },
    {
      id: 'n5',
      type: 'tournament',
      message: 'You\'ve been invited to NEXUS Valorant Invitational',
      avatar: '',
      read: true,
      timestamp: '2026-02-22T16:00:00',
    },
  ],
  unreadCount: 3,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

    markAsRead(state, action) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead(state) {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },

    clearAll(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearAll } =
  notificationSlice.actions;

export default notificationSlice.reducer;

import React from 'react';
import { Drawer, Box, Typography, IconButton, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { formatNotificationDate } from '@/utils/dateUtils';

// 임시 목업 데이터 (LocalDateTime과 유사한 형식으로 수정)
const mockNotifications = [
  { id: 1, title: '새로운 리뷰가 등록되었습니다.', content: '프로젝트 A의 "로그인 기능"에 새로운 리뷰가 달렸습니다.', date: dayjs().subtract(3, 'hour').format('YYYY-MM-DDTHH:mm:ss'), read: false },
  { id: 2, title: '결재가 승인되었습니다.', content: '요청하신 "디자인 시안"이 승인되었습니다.', date: dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss'), read: false },
  { id: 3, title: '새로운 멤버가 초대되었습니다.', content: '김민준님이 "마케팅팀"에 합류했습니다.', date: dayjs().subtract(3, 'day').format('YYYY-MM-DDTHH:mm:ss'), read: true },
  { id: 4, title: '서버 점검 안내', content: '오늘 오후 10시에 정기 서버 점검이 있습니다.', date: dayjs().subtract(10, 'day').format('YYYY-MM-DDTHH:mm:ss'), read: true },
];

export default function NotificationsDrawer({ open, onClose }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 360, bgcolor: 'background.paper' } }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="div">
          수신함
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ p: 0 }}>
        {mockNotifications.map((notif, index) => (
          <React.Fragment key={notif.id}>
            <ListItem alignItems="flex-start" sx={{ py: 1.5, px: 2 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box component="span" sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: notif.read ? 'grey.400' : 'blue.500',
                      mr: 1.5,
                    }} />
                    <Typography variant="subtitle2" component="span" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                      {notif.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatNotificationDate(notif.date)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 2.5 }}>
                    {notif.content}
                  </Typography>
                }
              />
            </ListItem>
            {index < mockNotifications.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
} 
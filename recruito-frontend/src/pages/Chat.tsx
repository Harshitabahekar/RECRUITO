import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, List, ListItem } from '@mui/material';
import { messageService, Message } from '../services/messageService';
import { useAppSelector } from '../redux/hooks';

const Chat: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [receiverEmail, setReceiverEmail] = useState<string>(searchParams.get('email') || '');
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (receiverEmail) {
      loadMessages();
      // Refresh messages every 2 seconds
      const interval = setInterval(loadMessages, 2000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverEmail]);

  const loadMessages = async () => {
    if (!receiverEmail || !user) return;
    try {
      const data = await messageService.getChatMessages(receiverEmail);
      setMessages(data);
      // Mark messages as read
      if (data.length > 0) {
        const chatRoomId = data[0].chatRoomId;
        if (chatRoomId) {
          await messageService.markMessagesAsRead(chatRoomId);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!receiverEmail || !receiverEmail.trim() || !messageContent.trim()) {
      alert('Please enter a valid receiver email and message content');
      return;
    }

    try {
      await messageService.sendMessage({
        receiverEmail: receiverEmail.trim(),
        content: messageContent.trim(),
      });
      setMessageContent('');
      loadMessages();
    } catch (error: any) {
      console.error('Failed to send message:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to send message. Please check that the receiver email is valid.';
      alert(errorMessage);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chat
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Receiver Email"
          type="email"
          value={receiverEmail}
          onChange={(e) => {
            setReceiverEmail(e.target.value);
            setSearchParams({ email: e.target.value });
          }}
          size="small"
          sx={{ mr: 2, minWidth: '300px' }}
          placeholder="Enter email address"
        />
        <Button variant="contained" onClick={loadMessages}>
          Load Chat
        </Button>
      </Box>

      {receiverEmail && (
        <Paper sx={{ p: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            <List>
              {messages.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                  No messages yet. Start the conversation!
                </Typography>
              ) : (
                messages.map((message) => (
                  <ListItem
                    key={message.id}
                    sx={{
                      justifyContent: message.senderId === user?.userId ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: message.senderId === user?.userId ? 'primary.light' : 'grey.300',
                        maxWidth: '70%',
                      }}
                    >
                      <Typography variant="caption" display="block" fontWeight="bold">
                        {message.senderName}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, mb: 0.5 }}>
                        {message.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.createdAt).toLocaleString()}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))
              )}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              size="small"
            />
            <Button variant="contained" onClick={handleSendMessage} disabled={!messageContent.trim()}>
              Send
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Chat;


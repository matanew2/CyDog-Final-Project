const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Assignment = require('../models/assignment');

// Socket events
const SocketEvent = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  AUTHENTICATE: 'authenticate',
  AUTHENTICATION_SUCCESS: 'authentication_success',
  AUTHENTICATION_ERROR: 'authentication_error',
  DOG_LOCATION_UPDATE: 'dog_location_update',
  DOG_STATUS_UPDATE: 'dog_status_update',
  DOG_COMMAND: 'dog_command',
  DOG_COMMAND_RESPONSE: 'dog_command_response',
  ASSIGNMENT_CREATED: 'assignment_created',
  ASSIGNMENT_UPDATED: 'assignment_updated',
  ASSIGNMENT_COMPLETED: 'assignment_completed',
  VIDEO_STREAM_START: 'video_stream_start',
  VIDEO_STREAM_STOP: 'video_stream_stop',
  VIDEO_FRAME: 'video_frame',
  AUDIO_DATA: 'audio_data',
};

function initSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
      socket.user = decoded;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Emit authentication success
    socket.emit(SocketEvent.AUTHENTICATION_SUCCESS, { 
      message: 'Successfully authenticated',
      userId: socket.user.sub
    });

    // Handle dog commands
    socket.on(SocketEvent.DOG_COMMAND, (data) => {
      console.log('Dog command received:', data);
      
      // Simulate command processing
      setTimeout(() => {
        socket.emit(SocketEvent.DOG_COMMAND_RESPONSE, {
          dogId: data.dogId,
          commandId: Math.random().toString(36).substring(2, 9),
          success: true,
          message: `Command "${data.command}" processed successfully`,
          timestamp: Date.now()
        });
      }, 500);
    });

    // Handle video streaming
    socket.on(SocketEvent.VIDEO_STREAM_START, (data) => {
      console.log('Video stream start requested for dog:', data.dogId);
      // In a real app, we would start streaming video for the specified dog
    });

    socket.on(SocketEvent.VIDEO_STREAM_STOP, (data) => {
      console.log('Video stream stop requested for dog:', data.dogId);
      // In a real app, we would stop streaming video for the specified dog
    });

    // Handle audio data (for voice commands)
    socket.on(SocketEvent.AUDIO_DATA, (data) => {
      console.log('Audio data received for dog:', data.dogId);
      // In a real app, we would process the audio data
    });

    // Listen for assignment updates from the database
    Assignment.afterUpdate(async (assignment) => {
      io.emit(SocketEvent.ASSIGNMENT_UPDATED, assignment);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initSocket;
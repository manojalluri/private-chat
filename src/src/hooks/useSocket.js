import { useEffect, useRef } from 'react';
import { connectSocket, disconnectSocket, on, off, emit } from '../services/socketService';

const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = connectSocket();
    
    return () => {
      disconnectSocket();
    };
  }, []);

  const emitEvent = (event, data) => {
    emit(event, data);
  };

  const onEvent = (event, callback) => {
    on(event, callback);
  };

  const offEvent = (event) => {
    off(event);
  };

  return {
    socket: socketRef.current,
    emit: emitEvent,
    on: onEvent,
    off: offEvent
  };
};

export default useSocket;
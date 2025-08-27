import { useContext } from 'react';
import { SocketContext } from '@/context/socket-context';

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    const { socket, updateSocketOnLogin, connectionStatus, reconnectSocket, disconnectSocket } = context;

    // Helper functions
    const isConnected = connectionStatus === 'connected';
    const isConnecting = connectionStatus === 'connecting';
    const hasError = connectionStatus === 'error' || connectionStatus === 'failed';

    const emit = (event: any, data: any) => {
        if (socket && isConnected) {
            socket.emit(event, data);
            return true;
        } else {
            console.warn('Cannot emit: socket not connected. Status:', connectionStatus);
            return false;
        }
    };

    const on = (event: any, callback: any) => {
        if (socket) {
            socket.on(event, callback);
            return () => socket.off(event, callback);
        }
        return () => {};
    };

    const off = (event: any, callback: any) => {
        if (socket) {
            socket.off(event, callback);
        }
    };

    return {
        socket,
        updateSocketOnLogin,
        connectionStatus,
        reconnectSocket,
        disconnectSocket,
        isConnected,
        isConnecting,
        hasError,
        emit,
        on,
        off
    };
};

export default useSocket;

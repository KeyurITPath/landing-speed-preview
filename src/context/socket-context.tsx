"use client"

import { createContext, useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { SERVER_URL } from '@/utils/constants';
import { isTokenActive } from '@/utils/helper';
import cookies from 'js-cookie';

export const SocketContext = createContext({});

// Connection status types
const CONNECTION_STATUS = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    ERROR: 'error',
    FAILED: 'failed'
};

export const SocketProvider = ({ children }: any) => {
    const [socket, setSocket] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
    const [transportType, setTransportType] = useState('websocket');
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const websocketFailedRef = useRef(false);

    // Clean up any existing socket connection
    const cleanupSocket = useCallback(() => {
        if (socketRef.current) {
            console.log('🧹 Cleaning up existing socket connection');
            socketRef.current.removeAllListeners();
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    }, []);

    // Get socket configuration based on previous failures
    const getSocketConfig = useCallback((token: any) => {
        const baseConfig = {
            path: '/socket.io',
            auth: { token },
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
            forceNew: true
        };

        // Use polling if websocket has failed before or start with polling to avoid transport mismatch
        if (websocketFailedRef.current) {
            console.log('📡 Using polling transport only (WebSocket previously failed)');
            return {
                ...baseConfig,
                transports: ['polling'],
                upgrade: false,
                rememberUpgrade: false
            };
        } else {
            console.log('� Starting with polling transport (safer for initial connection)');
            return {
                ...baseConfig,
                transports: ['polling'], // Start with polling to avoid transport mismatch
                upgrade: false, // Disable upgrade to prevent transport handshake errors
                rememberUpgrade: false
            };
        }
    }, []);

    // Handle connection success
    const handleConnect = useCallback((socket: any) => {
        const transport = socket.io.engine.transport.name;
        console.log(`✅ Socket connected via ${transport}`);

        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        setTransportType(transport);

        // Keep using polling to avoid transport mismatch errors
        // Don't reset websocketFailedRef to maintain polling preference
        console.log('🔒 Maintaining current transport to avoid handshake errors');
    }, []);

    // Handle connection errors with smart fallback
    const handleConnectError = useCallback((error: any) => {
        console.error('❌ Socket connection error:', error.message || error);
        setConnectionStatus(CONNECTION_STATUS.ERROR);

        // Log error details for debugging
        if (error.context) {
            console.error('❌ Error context:', error.context);
        }

        // Mark websocket as failed but don't try to change transports on the fly
        // to avoid transport mismatch errors
        const isWebSocketError =
            error.message === 'websocket error' ||
            error.description === 'websocket error' ||
            error.type === 'TransportError' ||
            error.message?.includes('websocket') ||
            error.context?.name === 'TRANSPORT_MISMATCH' ||
            error.context?.name === 'TRANSPORT_HANDSHAKE_ERROR';

        if (isWebSocketError) {
            console.log('🔄 Transport error detected, will use polling for next connection');
            websocketFailedRef.current = true;
        }
    }, []);

    // Handle disconnection
    const handleDisconnect = useCallback((reason: any) => {
        console.log('⚠️ Socket disconnected:', reason);
        setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);

        // Don't immediately reconnect on transport errors
        if (reason === 'transport error' || reason === 'transport close') {
            console.log('🔄 Transport error - will retry with different method');
            websocketFailedRef.current = true;
        }
    }, []);

    // Initialize socket connection
    const initializeSocket = useCallback((token: any) => {
        if (!token || !isTokenActive(token)) {
            console.warn('⚠️ Cannot initialize socket: invalid token');
            return;
        }

        console.log('🔄 Initializing socket connection...');

        // Clean up any existing connection
        cleanupSocket();

        setConnectionStatus(CONNECTION_STATUS.CONNECTING);

        try {
            const config = getSocketConfig(token);
            const newSocket = io(SERVER_URL, config);

            // Connection event handlers
            newSocket.on('connect', () => handleConnect(newSocket));

            newSocket.on('disconnect', handleDisconnect);

            newSocket.on('connect_error', (error) => handleConnectError(error));

            newSocket.on('reconnect', (attemptNumber) => {
                const transport = newSocket.io.engine.transport.name;
                console.log(`🔄 Reconnected after ${attemptNumber} attempts via ${transport}`);
                setConnectionStatus(CONNECTION_STATUS.CONNECTED);
                setTransportType(transport);
            });

            newSocket.on('reconnect_error', (error) => {
                console.error('❌ Reconnection error:', error.message || error);
                setConnectionStatus(CONNECTION_STATUS.ERROR);
            });

            newSocket.on('reconnect_failed', () => {
                console.error('💥 All reconnection attempts failed');
                setConnectionStatus(CONNECTION_STATUS.FAILED);

                // Mark for polling but don't try to reconnect to avoid more errors
                if (!websocketFailedRef.current) {
                    console.log('🔄 Marking polling preference for future attempts');
                    websocketFailedRef.current = true;
                }
            });

            // Store references
            socketRef.current = newSocket;
            setSocket(newSocket);

        } catch (error) {
            console.error('💥 Error creating socket:', error);
            setConnectionStatus(CONNECTION_STATUS.ERROR);
        }
    }, [cleanupSocket, getSocketConfig, handleConnect, handleDisconnect, handleConnectError]);

    // Initialize socket on mount and token changes
    useEffect(() => {
        const token = cookies.get('token');

        if (isTokenActive(token)) {
            initializeSocket(token);
        } else {
            console.log('📵 No valid token found, socket will not connect');
        }

        // Cleanup on unmount
        return cleanupSocket;
    }, [initializeSocket, cleanupSocket]);

    // Update socket connection when user logs in
    const updateSocketOnLogin = useCallback((token: any) => {
        if (!isTokenActive(token)) {
            console.warn('⚠️ Invalid token provided for socket update');
            return;
        }

        console.log('🔄 Updating socket with new authentication token');

        // Clean disconnect and reconnect with new token
        cleanupSocket();
        setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);

        // Small delay to ensure cleanup is complete
        setTimeout(() => {
            initializeSocket(token);
        }, 500);
    }, [cleanupSocket, initializeSocket]);

    // Manual reconnection function
    const reconnectSocket = useCallback(() => {
        const token = cookies.get('token');

        if (!isTokenActive(token)) {
            console.warn('⚠️ Cannot reconnect: no valid token');
            return;
        }

        console.log('🔄 Manual reconnection triggered');
        initializeSocket(token);
    }, [initializeSocket]);

    // Manual disconnection function
    const disconnectSocket = useCallback(() => {
        console.log('📵 Manual disconnection triggered');
        cleanupSocket();
        setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);

        // Reset websocket failure flag on manual disconnect
        websocketFailedRef.current = false;
    }, [cleanupSocket]);

    // Reset connection preferences (force websocket retry)
    const resetConnectionPreferences = useCallback(() => {
        console.log('🔄 Resetting connection preferences - will try WebSocket on next connection');
        websocketFailedRef.current = false;
    }, []);

    // Try WebSocket connection (for testing/debugging)
    const tryWebSocketConnection = useCallback(() => {
        console.log('🚀 Manually attempting WebSocket connection');
        const token = cookies.get('token');

        if (!isTokenActive(token)) {
            console.warn('⚠️ Cannot connect: no valid token');
            return;
        }

        cleanupSocket();
        setConnectionStatus(CONNECTION_STATUS.CONNECTING);

        const config = {
            path: '/socket.io',
            auth: { token },
            withCredentials: true,
            reconnection: false, // Disable auto-reconnection for manual test
            timeout: 5000,
            forceNew: true,
            transports: ['websocket'], // Force WebSocket only
            upgrade: false
        };

        console.log('🚀 Testing WebSocket connection...');
        const testSocket = io(SERVER_URL, config);

        testSocket.on('connect', () => {
            console.log('✅ WebSocket test successful!');
            testSocket.disconnect();
            // Reinitialize with normal settings
            setTimeout(() => initializeSocket(token), 500);
        });

        testSocket.on('connect_error', (error) => {
            console.error('❌ WebSocket test failed:', error.message || error);
            if (error.context) {
                console.error('❌ Error context:', error.context);
            }
            testSocket.disconnect();
            websocketFailedRef.current = true;
            // Fall back to polling
            setTimeout(() => initializeSocket(token), 500);
        });
    }, [cleanupSocket, initializeSocket]);

    const contextValue = useMemo(() => ({
        socket,
        connectionStatus,
        transportType,
        updateSocketOnLogin,
        reconnectSocket,
        disconnectSocket,
        resetConnectionPreferences,
        tryWebSocketConnection,
        isConnected: connectionStatus === CONNECTION_STATUS.CONNECTED,
        isConnecting: connectionStatus === CONNECTION_STATUS.CONNECTING,
        hasError: connectionStatus === CONNECTION_STATUS.ERROR || connectionStatus === CONNECTION_STATUS.FAILED
    }), [
        socket,
        connectionStatus,
        transportType,
        updateSocketOnLogin,
        reconnectSocket,
        disconnectSocket,
        resetConnectionPreferences,
        tryWebSocketConnection
    ]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

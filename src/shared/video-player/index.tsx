import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import './video-player.css';
import { IconButton, Skeleton, useMediaQuery } from '@mui/material';
import { ICONS } from '@assets/icons';
import Image from 'next/image';

const VideoPlayer = ({
  options,
  onReady,
  pipMode = true,
  closePipMode,
  isVideoProcessed = false
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoverPipMode, setHoverPipMode] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorDetails, setErrorDetails] = useState({
    message: 'Video unavailable',
    description: 'This content is currently not accessible'
  });
  const currentTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const hlsRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  useEffect(() => {
    if (!playerRef.current) {
      setIsLoading(true);
    }
    setPlayerReady(false);
    setShowErrorMessage(false);

    let player;

    // Initialize player only if it doesn't exist or is disposed
    if (!playerRef.current && videoRef.current) {
      console.log('Initializing new player instance...');
      let videoElement = videoRef.current.querySelector('video-js');
      if (!videoElement) {
        videoElement = document.createElement('video-js');
        videoElement.classList.add('vjs-big-play-centered');
        videoRef.current.appendChild(videoElement);
      }

      player = (playerRef.current = videojs(
        videoElement,
        {
          ...options,
          poster: options?.poster,
          controls: true,
          autoplay: true,
          muted: true,
          bigPlayButton: false,
          preload: 'auto',
          // Force Video.js to avoid native HLS and be consistent across browsers
          html5: {
            vhs: {
              overrideNative: true
            }
          }
        },
        async () => {
          if (typeof onReady === 'function') {
            onReady(player);
          }
          if (currentTimeRef.current > 0) {
            player.currentTime(currentTimeRef.current);
          }
          if (isPlayingRef.current) {
            try {
              await player.play();
            } catch (error) {
              console.warn('Autoplay attempt in ready callback failed:', error);
            }
          }
        }
      ));

      const handleReadyToPlay = async () => {
        console.log('Player ready to play');
        setPlayerReady(true);
        setIsLoading(false);
        if (isPlayingRef.current) {
          try {
            if (player.paused()) {
              await player.play();
            }
          } catch (error) {
            console.warn('Autoplay failed on canplay:', error);
          }
        } else {
          if (!pipMode) player.bigPlayButton.show();
        }
      };

      player.one('canplay', handleReadyToPlay);

      player.on('timeupdate', () => {
        currentTimeRef.current = player.currentTime();
      });
      player.on('play', () => {
        isPlayingRef.current = true;
        if (isLoading) setIsLoading(false);
        if (!playerReady) setPlayerReady(true);
      });
      player.on('pause', () => {
        isPlayingRef.current = false;
      });
      player.on('ended', () => {
        isPlayingRef.current = false;
      });

      player.on('error', (e) => {
        const error = player.error();
        console.error('Video.js Error:', error, e);

        let errorMessage = 'Video unavailable';
        let errorDescription = 'This content is currently not accessible';

        if (error) {
          switch (error.code) {
            case 1:
              errorMessage = 'Video loading aborted';
              errorDescription = 'The video loading was interrupted';
              break;
            case 2:
              errorMessage = 'Network error';
              errorDescription = 'A network error occurred while loading the video';
              break;
            case 3:
              errorMessage = 'Video decode error';
              errorDescription = 'The video could not be decoded';
              break;
            case 4:
              errorMessage = 'Video format not supported';
              errorDescription =
                'The video format is not supported or the source is invalid';
              break;
            default:
              errorMessage = 'Video playback error';
              errorDescription = 'An unknown error occurred during video playback';
          }
        }

        setErrorDetails({ message: errorMessage, description: errorDescription });

        if (isVideoProcessed) {
          setShowErrorMessage(true);
        }
        setIsLoading(false);
        setPlayerReady(false);
        isPlayingRef.current = false;
        const errorDisplay = player.getChild('errorDisplay');
        if (errorDisplay) {
          errorDisplay.hide();
        }
      });

      // --- HLS Handling (explicit fallback) ---
      const src = options?.sources?.[0]?.src;
      const isHls = typeof src === 'string' && src.endsWith('.m3u8');
      const videoEl = player?.el()?.getElementsByTagName('video')?.[0];

      if (videoEl && isHls) {
        console.log('HLS source detected:', src);

        if (Hls.isSupported()) {
          console.log('HLS.js is supported, initializing...');
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 90
            // withCredentials: true, // uncomment if your stream needs credentials + CORS support
          });

          hlsRef.current = hls;
          hls.attachMedia(videoEl);
          hls.loadSource(src);

          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            console.log('HLS Manifest parsed successfully');
          });

          hls.on(Hls.Events.ERROR, function (event, data) {
            console.error('HLS Error:', data);
            if (data.fatal) {
              let errorMessage = 'Video playback error';
              let errorDescription = 'An error occurred while loading the video';

              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  errorMessage = 'Network error';
                  errorDescription = 'Failed to load video due to network issues';
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  errorMessage = 'Media error';
                  errorDescription = 'The video format could not be processed';
                  break;
                case Hls.ErrorTypes.KEY_SYSTEM_ERROR:
                  errorMessage = 'DRM error';
                  errorDescription = 'Digital rights management error';
                  break;
                case Hls.ErrorTypes.MUX_ERROR:
                  errorMessage = 'Stream error';
                  errorDescription = 'Video stream format error';
                  break;
                default:
                  errorMessage = 'HLS playback error';
                  errorDescription = 'Unable to play this video stream';
              }

              setErrorDetails({ message: errorMessage, description: errorDescription });
              if (isVideoProcessed) setShowErrorMessage(true);
              setIsLoading(false);
              setPlayerReady(false);
              isPlayingRef.current = false;
            }
          });
        } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          console.log('Native HLS support detected');
          videoEl.src = src;
          videoEl.onerror = () => {
            setErrorDetails({
              message: 'Video format not supported',
              description: 'This video format is not supported in your browser'
            });
            if (isVideoProcessed) setShowErrorMessage(true);
            setIsLoading(false);
            setPlayerReady(false);
            isPlayingRef.current = false;
          };
        } else {
          console.warn('HLS not supported in this browser');
          setErrorDetails({
            message: 'Browser not supported',
            description: 'Your browser does not support HLS video streaming'
          });
          if (isVideoProcessed) setShowErrorMessage(true);
          setIsLoading(false);
          setPlayerReady(false);
        }
      }
    } else if (playerRef.current && !playerRef.current.isDisposed()) {
      const existingPlayer = playerRef.current;
      if (
        currentTimeRef.current > 0 &&
        Math.abs(existingPlayer.currentTime() - currentTimeRef.current) > 0.5
      ) {
        existingPlayer.currentTime(currentTimeRef.current);
      }
      if (isPlayingRef.current && existingPlayer.paused()) {
        existingPlayer.play().catch((e) => console.warn('Failed to resume play:', e));
      }
      // readyState() === 0 => HAVE_NOTHING
      if (existingPlayer.readyState() >= 1) {
        setIsLoading(false);
        setPlayerReady(true);
      }
    }

    // Cleanup function for effect (preserve state between re-inits)
    return () => {
      const currentPlayer = playerRef.current;
      if (currentPlayer && !currentPlayer.isDisposed()) {
        currentTimeRef.current = currentPlayer.currentTime();
        isPlayingRef.current = !currentPlayer.paused();
      }
      // Keep error message if it occurred
    };
  }, [isLoading, onReady, options, pipMode, playerReady, isVideoProcessed]);

  // Cleanup on unmount
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        console.log('Disposing player on component unmount');
        player.dispose();
        playerRef.current = null;
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  const showLoadingOverlay = (isLoading || !playerReady) && !showErrorMessage;

  return (
    <div
      className={`${
        pipMode ? 'pip-mode-video-player-custom' : 'video-player-custom'
      } video-player-container`}
      data-vjs-player
      onMouseEnter={() => (pipMode ? setHoverPipMode(true) : null)}
      onMouseLeave={() => (pipMode ? setHoverPipMode(false) : null)}
    >
      {showLoadingOverlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          {options?.poster ? (

            <Image
              src={options.poster}
              alt="Loading video"
              loading="lazy"
              width={options?.posterWidth || 640}
              height={options?.posterHeight || 360}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: 'grey.900' }} />
          )}
        </div>
      )}

      {/* Error Message Overlay - Only show if video is processed and there's an actual error */}
      {showErrorMessage && isVideoProcessed && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px 20px',
            textAlign: 'center',
            zIndex: 3
          }}
        >
          <div style={{ marginBottom: '8px' }}>{errorDetails.message}</div>
          <div style={{ fontSize: '0.9em', opacity: 0.8 }}>{errorDetails.description}</div>
        </div>
      )}

      {/* Video.js container - Controls visibility and fade */}
      <div
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          transition: 'opacity 0.4s ease-in-out',
          opacity: playerReady && !isLoading && !showErrorMessage ? 1 : 0,
          visibility: playerReady && !isLoading && !showErrorMessage ? 'visible' : 'hidden',
          zIndex: 1
        }}
      />

      {/* PiP Close Button */}
      {pipMode && (
        <IconButton
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: hoverPipMode || isMobile ? 'black' : 'transparent',
            opacity: 0.6,
            padding: '4px',
            zIndex: 4
          }}
          onClick={closePipMode}
        >
          <ICONS.CLOSE style={{ color: hoverPipMode || isMobile ? 'white' : 'transparent' }} />
        </IconButton>
      )}
    </div>
  );
};

export default VideoPlayer;

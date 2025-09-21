import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react';
import Player from '@vimeo/player';
import './vimeo-player.css';
import {
  Box,
  CircularProgress,
  circularProgressClasses,
  IconButton,
} from '@mui/material';
import { ICONS } from '@/assets/icons';
import moment from 'moment';
import { getDeviceType } from '@/utils/helper';

const extractVimeoId = (url: string) => {
  if (!url) return null;
  const match = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
  return match ? match?.[1] : url;
};

const VimeoPlayer = ({
  videoUrl,
  options,
  onReady,
  pipMode = true,
  autoplay = true,
  closePipMode,
  videoEnded,
  onTimeUpdate,
  playerStarted,
  lessonId,
}: any) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [loader, setLoader] = useState(true);
  const [hoverPipMode, setHoverPipMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const previousLessonIdRef = useRef(null);
  const latestVideoEnded = useRef(videoEnded);

  useEffect(() => {
    latestVideoEnded.current = videoEnded;
  }, [videoEnded]);

  const isMobile = useMemo(() => getDeviceType() === 'mobile', []);

  // Calculate dynamic height for mobile devices
  const getMobileHeight = useMemo(() => {
    if (!isMobile) return '100%';

    const screenHeight = windowDimensions.height;
    const screenWidth = windowDimensions.width;

    // Calculate height based on 16:9 aspect ratio for optimal video viewing
    const aspectRatioHeight = Math.floor(screenWidth * (9 / 16));

    // Ensure minimum height of 200px and maximum of 40% of screen height
    const minHeight = 200;
    const maxHeight = Math.floor(screenHeight * 0.4);

    const calculatedHeight = Math.max(
      minHeight,
      Math.min(aspectRatioHeight, maxHeight)
    );

    return `${calculatedHeight}px`;
  }, [isMobile, windowDimensions]);

  // Handle window resize for mobile devices
  useEffect(() => {
    const handleResize = () => {
      if (isMobile) {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile]);

  const handleTimeUpdate = useCallback(
    (data: any, lessonId: any) => {
      if (onTimeUpdate) {
        const formattedTime = moment
          .utc(data.seconds * 1000)
          .format('HH:mm:ss');
        onTimeUpdate(formattedTime, lessonId);
      }
    },
    [onTimeUpdate]
  );

  const handleWatchedTime = useCallback(
    async (player: any) => {
      if (!options?.watchedTime && options?.watchedTime !== 0) return;
      try {
        const watchedSeconds = moment.duration(options.watchedTime).asSeconds();
        if (watchedSeconds === 0) {
          await player.setCurrentTime(0);
          await player.play();
        } else if (watchedSeconds > 0) {
          await player.setCurrentTime(watchedSeconds);
          await player.play();
        }
      } catch (error) {
        console.error('Error setting watched time:', error);
      }
    },
    [options?.watchedTime]
  );

  const cleanupPlayer = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.unload();
        playerRef.current = null;
        setLoader(true);
      } catch (error) {
        console.error('Error cleaning up player:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && autoplay) {
      playerRef.current.setVolume(0);
      playerRef.current.play().catch((error: any) => {
        console.error('Error playing video:', error);
      });
    }
  }, [autoplay]);

  useEffect(()=>{
    console.log("get updated vimeo url",videoUrl)
  },[videoUrl])


  useEffect(() => {
    const setupPlayer = async () => {
      if (!videoUrl || !playerContainerRef.current) return;

      const vimeoId = extractVimeoId(videoUrl);
      if (!vimeoId) {
        console.error('Invalid Vimeo URL or ID:', videoUrl);
        setLoader(false);
        return;
      }

      console.log("vimeo id is ----",vimeoId)

      try {
        let player = playerRef.current;
        const isNewPlayer = !player;

        if (isNewPlayer) {
          console.log("come here to load vimeo video ------")
          player = new Player(playerContainerRef.current!, {
            id: parseInt(vimeoId),
            autoplay: autoplay,
            loop: options?.loop || false,
            responsive: true,
            title: false,
            byline: false,
            controls: true,
            dnt: true,
            transparent: false,
            muted: autoplay,
            playsinline: true,
          });

          const setupEventListeners = () => {
            player!.on('loaded', async () => {
              setLoader(false);
              if (onReady) onReady(player);
              await handleWatchedTime(player);
            });

            player!.on('play', playerStarted);

            player!.on('ended', () => {
              if (latestVideoEnded.current) {
                latestVideoEnded.current();
              }
            });

            player!.on('timeupdate', (time: any) => {
              handleTimeUpdate(time, lessonId);
            });

            player!.on('fullscreenchange', ({ fullscreen }: any) => {
              setIsFullScreen(fullscreen);
            });

            player!.on('error', (error: any) => {
              console.error('Vimeo player error:', error);
              setLoader(false);
            });

            player!.on('bufferend', () => {
              setLoader(false);
            });
          };

          setupEventListeners();
          playerRef.current = player;
        } else {
          console.log("reusing existing vimeo player ------")
          // For existing player, check if it's a different video or just a mode change
          const currentVideoId = await player!.getVideoId();
          if (currentVideoId !== parseInt(vimeoId)) {
            // Show loader immediately when switching videos
            setLoader(true);
            console.log("come here to load new vimeo video ------")
            // Load new video
            await player!.loadVideo({
              id: parseInt(vimeoId),
              autoplay: autoplay,
            });

            // Loader will be hidden by the 'loaded' event listener
            if (onReady) onReady(player);
            await handleWatchedTime(player);
          } else {
            // Same video, just continue (for PiP mode switches)
            setLoader(false);
            if (onReady) onReady(player);
          }
        }
      } catch (error) {
        console.error('Vimeo player setup error:', error);
        setLoader(false);
        cleanupPlayer();
      }
    };
    // For landing videos (lessonId === 'landing-video'), set up immediately without delays
    if (lessonId === 'landing-video') {
      if (!playerRef.current) {
        setupPlayer();
      }
    } else if (lessonId !== previousLessonIdRef.current || !playerRef.current) {
      // Show loader immediately when lesson changes (for actual lessons)
      setLoader(true);
      previousLessonIdRef.current = lessonId;

      // Add a small delay to ensure loader is visible before starting video load
      setTimeout(() => {
        setupPlayer();
      }, 100);
    }

    return () => {
      if (!lessonId || lessonId === 'landing-video') {
        // Don't cleanup landing videos to maintain state during PiP
        return;
      }
      cleanupPlayer();
    };
  }, [
    lessonId,
    videoUrl,
    options?.loop,
    autoplay,
    onReady,
    handleTimeUpdate,
    handleWatchedTime,
    cleanupPlayer,
    playerStarted,
  ]);

  return (
    <div
      style={{
        ...(isMobile && !isFullScreen ? { height: getMobileHeight } : {}),
      }}
      className={
        pipMode
          ? 'pip-mode-vimeo-player-custom'
          : isMobile && !isFullScreen
            ? 'vimeo-player-custom'
            : isMobile && isFullScreen
              ? 'vimeo-player-custom full-screen-player'
              : 'vimeo-player-custom border-radius-12'
      }
      onMouseEnter={() => pipMode && setHoverPipMode(true)}
      onMouseLeave={() => pipMode && setHoverPipMode(false)}
    >
      {' '}
      {loader && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: isMobile ? `calc(${getMobileHeight})` : '87.5%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: isMobile ? '0' : '12px',
            backgroundColor: 'black',
            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <CircularProgress
            variant='indeterminate'
            disableShrink
            sx={{
              color: '#fff',
              opacity: 0.9,
              animationDuration: '550ms',
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round',
              },
            }}
            size={80}
            thickness={4}
          />
        </Box>
      )}
      <div
        ref={playerContainerRef}
        id='vimeo-player'
        className='vimeo-player'
        style={{
          opacity: loader ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
          zIndex: 1,
          height: '100%',
          width: '100%',
        }}
      />
      {pipMode && (
        <IconButton
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: hoverPipMode || isMobile ? 'black' : 'transparent',
            opacity: 0.6,
            padding: '4px',
            zIndex: 3,
          }}
          onClick={closePipMode}
        >
          <ICONS.CLOSE
            style={{
              color: hoverPipMode || isMobile ? 'white' : 'transparent',
            }}
          />
        </IconButton>
      )}
    </div>
  );
};

export default memo(VimeoPlayer, (prevProps, nextProps) => {
  return (
    prevProps.lessonId === nextProps.lessonId &&
    prevProps.videoUrl === nextProps.videoUrl &&
    prevProps.pipMode === nextProps.pipMode &&
    prevProps.autoplay === nextProps.autoplay &&
    prevProps.options?.loop === nextProps.options?.loop &&
    prevProps.options?.watchedTime === nextProps.options?.watchedTime
  );
});

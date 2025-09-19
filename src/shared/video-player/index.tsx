import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';
import Image from 'next/image';
import './video.css';
import { IconButton } from '@mui/material';
import { ICONS } from '../../assets/icons';

let playerInstance: any = null; // singleton player to prevent re-init

const VideoPlayer = ({
  is_video_processed,
  intro_thumbnail,
  intro,
  pipMode,
  autoplay = true,
  loop = true,
  muted = true,
  closePipMode,
}: any) => {

  if (!is_video_processed) {
    return (
      <div className='video-container'>
        <p className='label'>Video Processing...</p>
        <div className='video-player-box'>
          {intro_thumbnail ? (
            <Image
              src={intro_thumbnail}
              alt='Video thumbnail'
              fill
              sizes='100%'
              className='thumbnail'
            />
          ) : (
            <div className='fallback' />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='video-player-container-main'>
      {intro_thumbnail && pipMode ? (
        <div className='video-player-box'>
          <Image
            src={intro_thumbnail}
            alt='Video thumbnail'
            fill
            sizes='100%'
            className='thumbnail'
          />
        </div>
      ) : null}
      <div className={`video-player-container ${pipMode ? 'pip-active' : ''}`}>
        {intro.includes('vimeo.com') ? (
          <iframe
            src={`${intro}&autoplay=${autoplay ? 1 : 0}&muted=${
              muted ? 1 : 0
            }&loop=${loop ? 1 : 0}&playsinline=1&pip=0&dnt=1`}
            className='video-frame'
            frameBorder='0'
            allow='autoplay; fullscreen;'
            allowFullScreen
            title='Vimeo Player'
          />
        ) : (
          <video
            id='my-video'
            className='video-js vjs-big-play-centered'
            preload='auto'
            playsInline
            poster={intro_thumbnail}
            muted={muted}
            autoPlay={autoplay}
            loop={loop}
            controls
            ref={node => {
              if (!node) return;

              // prevent re-initializing player
              if (!playerInstance) {
                if (Hls.isSupported() && intro.endsWith('.m3u8')) {
                  const hls = new Hls();
                  hls.loadSource(intro);
                  hls.attachMedia(node);
                } else {
                  node.src = intro;
                }

                playerInstance = videojs(node, {
                  fluid: true,
                  autoplay,
                  controls: true,
                  bigPlayButton: false,
                });
              }
            }}
          />
        )}
        {pipMode ? (
          <IconButton
            className='cross-icon-pip'
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '4px',
            }}
            onClick={closePipMode}
          >
            <ICONS.CLOSE
              style={{
                color: 'white',
                zIndex: 9999,
              }}
            />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
};

export default VideoPlayer;

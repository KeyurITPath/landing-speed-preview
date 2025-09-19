import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';
import Image from 'next/image';
import './video.css';
import { IconButton } from '@mui/material';
import { ICONS } from '../../assets/icons';
import { getVimeoId, isValidUrl } from '../../utils/helper';

let playerInstance: any = null; // singleton player to prevent re-init

const VideoPlayer = ({
  is_video_processed,
  intro_thumbnail,
  intro,
  pipMode,
  closePipMode,
}: any) => {
  const introURL = isValidUrl(intro)
    ? intro
    : `https://player.vimeo.com/video/${getVimeoId(intro)}?autoplay=1&muted=1&loop=1&playsinline=1&dnt=1`;

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
      {intro_thumbnail ? (
        <div className='video-player-box' style={{
          position: 'absolute'
        }} >
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
        {introURL.includes('vimeo.com') ? (
          <iframe
            key={Date.now()}
            src={introURL}
            className='video-frame'
            frameBorder='0'
            allow='autoplay; fullscreen;'
            allowFullScreen
            title='Vimeo Player'
            onLoad={e => {
              // hide thumbnail when iframe loaded
              console.log('event', event)
              const wrapper = (e.target as HTMLIFrameElement);
              if (wrapper) {
                const thumb = wrapper.querySelector(
                  '.video-player-box'
                ) as HTMLElement;
                console.log('thumb', thumb)
                if (thumb) thumb.style.display = 'none';
              }
            }}
          />
        ) : (
          <video
            id='my-video'
            className='video-js vjs-big-play-centered'
            preload='auto'
            playsInline
            poster={intro_thumbnail}
            muted
            autoPlay
            loop
            controls
            ref={node => {
              if (!node) return;

              // prevent re-initializing player
              if (!playerInstance) {
                if (Hls.isSupported() && introURL.endsWith('.m3u8')) {
                  const hls = new Hls();
                  hls.loadSource(introURL);
                  hls.attachMedia(node);
                } else {
                  node.src = introURL;
                }

                node.muted = true; // ensure muted

                // hide thumbnail when video metadata loaded
                node.addEventListener('loadedmetadata', () => {
                  const wrapper = node.parentElement;
                  if (wrapper) {
                    const thumb = wrapper.querySelector(
                      '.video-player-box'
                    ) as HTMLElement;
                    if (thumb) thumb.style.display = 'none';
                  }
                });

                playerInstance = videojs(node, {
                  fluid: true,
                  autoplay: true,
                  controls: true,
                  bigPlayButton: false,
                });

                // Force play to work around autoplay restrictions
                node.play().catch(() => {
                  console.log('Autoplay blocked by browser');
                });
              }
            }}
          />
        )}
        {pipMode ? (
          <IconButton
            className={
              introURL.includes('vimeo.com')
                ? 'cross-icon-pip-vimeo'
                : 'cross-icon-pip'
            }
            sx={{
              position: 'absolute',
              ...(introURL.includes('vimeo.com')
                ? {
                    top: '6px',
                    right: '6px',
                    padding: '6px',
                    borderRadius: '4px',
                  }
                : {
                    top: '10px',
                    right: '10px',
                    padding: '4px',
                  }),
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

import '@/components/vimeo-player/vimeo-player.css';
import { ICONS } from '@/assets/icons';

interface VimeoPlayerProps {
  videoId: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showTitle?: boolean;
  showByline?: boolean;
  showPortrait?: boolean;
  className?: string;
  style?: React.CSSProperties;
  pipMode?: boolean;
  closePipMode?: () => void;
}

export default function VimeoPlayerSSR({
  videoId,
  width = '100%',
  height = '100%',
  autoplay = true,
  muted = true,
  loop = true,
  showTitle = false,
  showByline = false,
  showPortrait = false,
  className,
  style,
  pipMode = false,
  closePipMode,
}: VimeoPlayerProps) {
  const params = new URLSearchParams();

  if (!showTitle) params.append('title', '0');
  if (!showByline) params.append('byline', '0');
  if (!showPortrait) params.append('portrait', '0');
  if (autoplay) params.append('autoplay', '1');
  if (muted) params.append('muted', '1');
  if (loop) params.append('loop', '1');
  params.append('pip', '0');

  const src = `https://player.vimeo.com/video/${videoId}?${params.toString()}`;

  // PiP container styles - use CSS classes for responsive behavior
  const containerStyle = pipMode ? {} : {
    position: 'relative' as const,
    width,
    height,
    ...style,
  };

  const iframeStyle = pipMode
    ? {
        border: 'none',
        aspectRatio: '16/9',
        width: '100%',
        height: '100%',
        objectFit: 'contain' as const,
      }
    : {
        border: 'none',
        ...style,
      };

  return (
    <div
      style={containerStyle}
      className={pipMode ? 'pip-mode-vimeo-player-custom' : className}
    >
      <iframe
        src={src}
        width={pipMode ? '100%' : width}
        height={pipMode ? '100%' : height}
        frameBorder='0'
        allow='autoplay; fullscreen'
        allowFullScreen
        style={iframeStyle}
        title='Vimeo video player'
      />

      {/* Close button for PiP mode */}
      {pipMode && closePipMode && (
        <button
          onClick={closePipMode}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 51,
            opacity: 0,
            transition: 'opacity 0.3s ease, background-color 0.2s ease',
          }}
          className='pip-close-button'
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 1)';
          }}
        >
          <ICONS.CLOSE size={20} color='white' />
        </button>
      )}

    </div>
  );
}

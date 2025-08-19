import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    SERVER_URL,
} from '@utils/constants';
import {
    decodeToken,
    getVideoType,
    isEmptyArray,
    isEmptyObject,
    isHLS,
    videoURL
} from '@utils/helper';

let globalPipValue = false;

const useLanding = ({translation}) => {


    // Add this ref to track if pixel view has been triggered
    const pixelViewTriggered = useRef(false);

    const [pipMode, setPipMode] = useState(false);
    const [pipModeClosed, setPipModeClosed] = useState(false);

    useEffect(() => {
        return () => {
            setPipMode(false);
            setPipModeClosed(false);
            globalPipValue = false;
        };
    }, []);



    globalPipValue = pipMode;

    const videoContainerRef = useRef(null);
    const togglePipMode = useCallback(
        (mode) => {
            if (pipModeClosed) return;
            if (pipMode !== mode) {
                setPipMode(mode);
            }
        },
        [pipMode, pipModeClosed]
    );


    // useEffect(() => {
    //     // if (translation) {
    //         setTimeout(() => {
    //             if (!videoContainerRef.current) return;
    //             const observerCallback = (entries) => {
    //                 const entry = entries[0];
    //                 if (!entry.isIntersecting) {
    //                     if (
    //                         !globalPipValue &&
    //                         !loading &&
    //                         data?.landing_name?.name === 'landing2'
    //                     ) {
    //                         togglePipMode(true);
    //                     }
    //                 } else {
    //                     if (globalPipValue) {
    //                         togglePipMode(false);
    //                     }
    //                 }
    //             };

    //             const observer = new IntersectionObserver(observerCallback, { threshold: 0.5 });
    //             observer.observe(videoContainerRef.current);

    //             return () => observer.disconnect();
    //         }, 0);
    //     // }
    // }, [loading, togglePipMode, translation, data]);

    const videoPlayerOptions = useMemo(() => {
        if (!isEmptyObject(translation)) {
            const data = translation || {};
            const mainOptions = {
                controls: true,
                responsive: true,
                fluid: true,
                autoSetup: true,
                bigPlayButton: false,
                enableDocumentPictureInPicture: false,
                preload: 'auto',
                disablePictureInPicture: false,
                loop: true,
                muted: true,
                sources: [
                    {
                        src: videoURL(data?.intro) || '',
                        type: getVideoType(data?.intro ? SERVER_URL + data?.intro : '')
                    }
                ],
                ...(isHLS(data?.intro) && {
                    html5: {
                        vhs: {
                            enableLowInitialPlaylist: true, // prioritize fast start
                            overrideNative: true // ensure VHS is used even on Safari
                        }
                    }
                }),
                controlBar: {
                    pictureInPictureToggle: false,
                    skipButtons: {
                        forward: 5,
                        backward: 5
                    }
                },
                poster: data?.intro_thumbnail ? videoURL(data?.intro_thumbnail) : ''
            };

            const pipModeOptions = {
                controls: false,
                responsive: true,
                fluid: true,
                preload: 'auto',
                autoSetup: true,
                bigPlayButton: false,
                disablePictureInPicture: false,
                enableDocumentPictureInPicture: false,
                loop: true,
                muted: true,
                controlBar: {
                    pictureInPictureToggle: false
                },
                ...(isHLS(data?.intro) && {
                    html5: {
                        vhs: {
                            enableLowInitialPlaylist: true, // prioritize fast start
                            overrideNative: true // ensure VHS is used even on Safari
                        }
                    }
                }),
                sources: [
                    {
                        src: data?.intro ? videoURL(data?.intro) : '',
                        type: 'video/mp4'
                    }
                ],
                poster: data?.intro_thumbnail ? videoURL(data?.intro_thumbnail) : ''
            };

            const options = pipMode ? pipModeOptions : mainOptions;
            return options;
        }

        return null;
    }, [pipMode, translation]);

    const closePipMode = useCallback(() => {
        setPipMode(false);
        setPipModeClosed(true);
    }, []);

    return {

        videoContainerRef,
        videoPlayerOptions,
        pipMode,
        closePipMode,

    };
};

export default useLanding;

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { api } from '@/api';
import { DOMAIN } from '@/utils/constants';

const TolstoyWidget = ({
    widgetType = 'full',
    maxHeight = '800px',
    commentClass = 'tolstoycomments-cc',
    dynamicScript,
    miniWidget = false,
    commentLastKey,
    commentTake,
    commentInterval,
    commentTitle,
    courseLandingData
}: any) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector(({ auth }: any) => auth);
    const [ssoToken, setSsoToken] = useState(null);
    const [isTolstoyLoaded, setIsTolstoyLoaded] = useState(false);
    const t = useTranslations();
    const commentThreadId = `${DOMAIN}/course-details/${courseLandingData?.final_url}`;

    useEffect(() => {
        const fetchSsoToken = async () => {
            try {
                const response = await api.tolstoyComments.getToken({
                    data: { user_id: user?.id }
                });

                const token = response?.data?.data?.token;
                if (token) {
                    setSsoToken(token);
                }
            } catch (error) {
                console.error('Error fetching SSO token:', error);
            }
        };

        if (user?.id) {
            fetchSsoToken();
        }
    }, [user?.id]);

    useEffect(() => {
        if (!dynamicScript || !containerRef.current) return;

        const scriptId = 'tolstoy-loader-script';
        const configId = 'tolstoy-config-script';

        if (!document.getElementById(scriptId)) {
            const inlineScript = document.createElement('script');
            inlineScript.id = scriptId;
            inlineScript.type = 'text/javascript';
            inlineScript.async = true;
            inlineScript.text = dynamicScript.replace(/<script[^>]*>|<\/script>/gi, '');
            document.body.appendChild(inlineScript);
        }

        if (containerRef.current) {
            containerRef.current.innerHTML = '';

            const targetDiv = document.createElement('div');
            targetDiv.style.width = '100%';
            targetDiv.style.maxHeight = maxHeight;
            targetDiv.style.overflowY = 'auto';
            targetDiv.style.overflowX = 'hidden';

            if (miniWidget) {
                targetDiv.id = 'tolstoycomments-commentlast';
            } else {
                targetDiv.className = 'tolstoycomments-feed';
            }

            containerRef.current.appendChild(targetDiv);
        }

        if (!window._tolstoyWidgetInitialized) {
            const initializeTolstoyWidget = () => {
                if (!ssoToken) {
                    setTimeout(initializeTolstoyWidget, 100);
                    return;
                }

                window['tolstoycomments'] = window['tolstoycomments'] || [];

                const configScript = document.createElement('script');
                configScript.type = 'text/javascript';
                configScript.id = configId;
                configScript.textContent = miniWidget
                    ? `
                        window["tolstoycomments"].push({
                            action: "miniwidget",
                            values: {
                                id: "tolstoycomments-commentlast",
                                key: "${commentLastKey}",
                                type: "commentlast",
                                take: ${commentTake},
                                interval: "${commentInterval}",
                                title: "${commentTitle || 'Recent comments'}"
                            }
                        });
                    `
                    : `
                        window["tolstoycomments"].push({
                            action: "init",
                            values: {
                                visible: true,
                                sso: "${ssoToken}",
                                comment_class: "${commentClass}",
                                url: "${commentThreadId}"
                            }
                        });
                    `;
                document.body.appendChild(configScript);

                window._tolstoyWidgetInitialized = true;
            };

            initializeTolstoyWidget();
        }

        const targetDiv = containerRef.current;
        let iframeCheckInterval: null | any = null;

        const checkTolstoyIframeLoaded = () => {
            const iframe = targetDiv.querySelector('iframe');

            if (iframe) {
                iframe.addEventListener('load', () => {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const observer = new MutationObserver(() => {
                            const contentReady =
                                iframeDoc?.body?.childElementCount > 0 &&
                                iframeDoc?.body?.innerText.trim() !== '';

                            if (contentReady) {
                                setIsTolstoyLoaded(true);
                                observer.disconnect();
                            }
                        });

                        observer.observe(iframeDoc.body, { childList: true, subtree: true });

                        setTimeout(() => {
                            setIsTolstoyLoaded(true);
                            observer.disconnect();
                        }, 1000);
                    } catch (error) {
                        setIsTolstoyLoaded(true);
                    }
                });
            }
        };

        iframeCheckInterval = setInterval(() => {
            if (targetDiv.querySelector('iframe')) {
                checkTolstoyIframeLoaded();
                clearInterval(iframeCheckInterval);
            }
        }, 300);

        return () => {
            if (iframeCheckInterval) clearInterval(iframeCheckInterval);
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            const configScript = document.getElementById(configId);
            if (configScript) configScript.remove();
            const loaderScript = document.getElementById(scriptId);
            if (loaderScript) loaderScript.remove();
            delete window._tolstoyWidgetInitialized;
            delete window.tolstoycomments;
        };
    }, [
        dynamicScript,
        widgetType,
        miniWidget,
        commentClass,
        maxHeight,
        commentLastKey,
        commentTake,
        commentInterval,
        commentTitle,
        ssoToken,
        commentThreadId
    ]);

    const renderSkeleton = () => (
        <Box
            sx={{
                width: '100%',
                maxHeight,
                borderRadius: '8px',
                mb: 4,
                p: 2,
                overflow: 'auto'
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('loading_comments')}
            </Typography>

            {[...Array(6)].map((_, index) => (
                <Stack key={index} direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flexGrow: 1 }}>
                        <Skeleton width="60%" height={14} />
                        <Skeleton width="80%" height={12} />
                    </Box>
                </Stack>
            ))}
        </Box>
    );

    if (!dynamicScript) return null;

    return (
        <>
            {!miniWidget && (
                <Typography
                    sx={{
                        fontSize: { xs: 26, sm: 28 },
                        fontWeight: 500
                    }}
                    color="primary.typography"
                >
                    {t('comments')}
                </Typography>
            )}

            {!isTolstoyLoaded && renderSkeleton()}

            <Box
                ref={containerRef}
                sx={{
                    width: '100%',
                    borderRadius: '8px',
                    mb: 4,
                    position: 'relative',
                    display: isTolstoyLoaded ? 'block' : 'none'
                }}
            />
        </>
    );
};

export default TolstoyWidget;

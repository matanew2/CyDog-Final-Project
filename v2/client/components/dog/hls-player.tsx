"use client";

import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { Loader2, WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HLSPlayerProps {
  streamUrl: string;
  isActive: boolean;
  isMuted: boolean;
  onError?: (message: string) => void;
  onStreamLoaded?: () => void;
}

export function HLSPlayer({
  streamUrl,
  isActive,
  isMuted,
  onError,
  onStreamLoaded,
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const [showDetailedError, setShowDetailedError] = useState(false);
  const [streamLoaded, setStreamLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isStreamReady, setIsStreamReady] = useState(false);

  // Handle errors
  const handleStreamError = (message: string, details?: string) => {
    console.error(`Stream error: ${message}`, details || "");
    setErrorMessage(message);
    if (details) {
      setDetailedError(details);
    }
    setStreamLoaded(false);
    setIsStreamReady(false);

    if (onError) {
      onError(message);
    }
  };

  // Validate HLS URL
  const isValidHlsUrl = (url: string) => {
    if (!url) return false;

    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.toLowerCase();
      const isValid =
        path.endsWith(".m3u8") ||
        path.includes("playlist") ||
        path.includes("manifest");

      console.log("[HLSPlayer] URL validation:", url, "Is Valid:", isValid);
      return isValid;
    } catch (e) {
      console.error("[HLSPlayer] URL parsing error:", e);
      return false;
    }
  };

  // Test stream connection
  const testStreamConnection = async (url: string): Promise<boolean> => {
    try {
      console.log("[HLSPlayer] Testing stream connection for URL:", url);
      const response = await fetch(url, {
        method: "HEAD",
        cache: "no-store",
      });
      if (response.ok) {
        console.log("[HLSPlayer] Stream connection test successful");
        return true;
      } else {
        console.warn(
          "[HLSPlayer] Stream connection test failed with status:",
          response.status
        );
        handleStreamError(
          "Stream not accessible",
          `HTTP ${response.status}: ${response.statusText}`
        );
        return false;
      }
    } catch (error: any) {
      console.error("[HLSPlayer] Stream connection test error:", error);
      handleStreamError(
        "Failed to connect to stream",
        error.message || "Network or server error"
      );
      return false;
    }
  };

  // HLS configuration
  const getHlsConfig = () => {
    const config = {
      debug: process.env.NODE_ENV === "development",
      enableWorker: true,
      lowLatencyMode: true, // Enable low latency mode consistently for live streams
      liveSyncDuration: 10, // Target 10 seconds behind live edge to avoid stalls
      liveMaxLatencyDuration: 20, // Allow up to 20 seconds latency
      maxBufferLength: 60, // Increase to 60 seconds (from 30)
      maxMaxBufferLength: 120, // Increase to 120 seconds (from 60)
      xhrSetup: (xhr: XMLHttpRequest) => {
        xhr.withCredentials = false;
        xhr.timeout = 20000;
      },
      manifestLoadingTimeOut: 15000,
      manifestLoadingMaxRetry: 6,
      levelLoadingTimeOut: 15000,
      levelLoadingMaxRetry: 6,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 8,
      startLevel: 0, // Start with lowest quality for faster initial load
      ...(process.env.NODE_ENV === "development" && {
        enableSoftwareAES: true,
        progressive: true,
        startFragPrefetch: true,
      }),
    };
    console.log("[HLSPlayer] HLS Config:", config);
    return config;
  };

  // Cleanup function for HLS instance
  const cleanupHls = () => {
    if (hlsRef.current) {
      console.log("[HLSPlayer] Destroying HLS instance");
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  // Handle video playback
  const startPlayback = () => {
    if (!videoRef.current || !isStreamReady) return;

    console.log("[HLSPlayer] Starting playback");

    const video = videoRef.current;
    video.muted = isMuted;
    video.autoplay = true;
    video.preload = "auto";
    video.onerror = null;

    const playbackStartedHandler = () => {
      console.log("[HLSPlayer] Playback started successfully (playing event)");
      setStreamLoaded(true);
      if (onStreamLoaded) {
        onStreamLoaded();
      }
      video.removeEventListener("playing", playbackStartedHandler);
    };

    video.addEventListener("playing", playbackStartedHandler);

    try {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("[HLSPlayer] Playback initiated successfully");
          })
          .catch((err) => {
            console.error("[HLSPlayer] Error starting playback:", err);
            video.removeEventListener("playing", playbackStartedHandler);

            if (err.name === "NotAllowedError") {
              console.log("[HLSPlayer] Autoplay blocked by browser policy");
              setErrorMessage("Browser blocked autoplay. Click to play.");
              setStreamLoaded(true);
              if (onStreamLoaded) {
                onStreamLoaded();
              }
            } else {
              if (!isMuted) {
                console.log("[HLSPlayer] Retrying playback with muted audio");
                video.muted = true;
                video.play().catch((retryErr) => {
                  console.error(
                    "[HLSPlayer] Retry with muted also failed:",
                    retryErr
                  );
                  handleStreamError("Playback failed", err.message);
                });
              } else {
                handleStreamError("Playback failed", err.message);
              }
            }
          });
      } else {
        console.log("[HLSPlayer] Play initiated (no promise returned)");
      }
    } catch (e) {
      console.error("[HLSPlayer] Exception during play() call:", e);
      handleStreamError("Playback initialization error", (e as Error).message);
    }
  };

  // Initialize or destroy HLS player
  useEffect(() => {
    console.log(
      "[HLSPlayer] Initializing with active:",
      isActive,
      "URL:",
      streamUrl
    );

    if (!isActive || !streamUrl) {
      console.log("[HLSPlayer] Not active or no URL, cleaning up");
      cleanupHls();
      setStreamLoaded(false);
      setIsStreamReady(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setDetailedError(null);
    setIsStreamReady(false);

    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (!video) {
        console.error("[HLSPlayer] Video element not found");
        handleStreamError(
          "Video player initialization failed",
          "Video element not available"
        );
        setIsLoading(false);
        return;
      }

      const initHls = async () => {
        if (!isValidHlsUrl(streamUrl)) {
          console.error("[HLSPlayer] Invalid URL format:", streamUrl);
          handleStreamError(
            "Invalid stream URL format",
            "The URL doesn't appear to be a valid HLS stream (.m3u8)"
          );
          setIsLoading(false);
          return;
        }

        console.log("[HLSPlayer] Testing stream connection...");
        const isAccessible = await testStreamConnection(streamUrl);

        if (
          !isAccessible &&
          !(
            streamUrl.includes("localhost") ||
            process.env.NODE_ENV === "development"
          )
        ) {
          console.error("[HLSPlayer] Stream not accessible:", streamUrl);
          setIsLoading(false);
          return;
        }

        try {
          console.log("[HLSPlayer] HLS supported:", Hls.isSupported());
          if (Hls.isSupported()) {
            cleanupHls();
            console.log("[HLSPlayer] Creating new HLS instance");
            hlsRef.current = new Hls(getHlsConfig());

            hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
              console.error(
                "[HLSPlayer] HLS error event:",
                data.type,
                data.details,
                data
              );
              if (data.fatal) {
                let errorMsg = "Stream error";
                let detailedMsg = "";
                if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
                  errorMsg = "Failed to load stream";
                  detailedMsg = `Cannot load manifest: ${
                    data.response
                      ? `HTTP ${data.response.code}`
                      : "Network error"
                  }`;
                } else if (
                  data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT
                ) {
                  errorMsg = "Stream loading timeout";
                  detailedMsg = "Timeout while loading the stream manifest.";
                } else if (
                  data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR
                ) {
                  errorMsg = "Invalid stream format";
                  detailedMsg = `Error parsing manifest: ${data.reason}`;
                } else if (data.details.includes("LEVEL_LOAD_")) {
                  errorMsg = "Failed to load stream quality";
                  detailedMsg = "Error loading stream quality levels.";
                } else if (data.details.includes("FRAG_LOAD_")) {
                  errorMsg = "Failed to load stream segment";
                  detailedMsg = "Error loading a video segment.";
                } else {
                  detailedMsg = `Error type: ${data.type}, Details: ${data.details}`;
                }

                handleStreamError(errorMsg, detailedMsg);

                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                  console.log(
                    "[HLSPlayer] Trying to recover from network error"
                  );
                  setTimeout(() => hlsRef.current?.startLoad(), 1000);
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                  console.log("[HLSPlayer] Trying to recover from media error");
                  hlsRef.current?.recoverMediaError();
                } else {
                  console.log(
                    "[HLSPlayer] Cannot recover, destroying HLS instance"
                  );
                  cleanupHls();
                }
              }
            });

            hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
              console.log("[HLSPlayer] Manifest parsed successfully");
              setIsLoading(false);
              setIsStreamReady(true);
              if (
                hlsRef.current &&
                hlsRef.current.levels &&
                hlsRef.current.levels.length > 0
              ) {
                hlsRef.current.currentLevel = 0;
                console.log("[HLSPlayer] Set initial quality level to lowest");
              }
            });

            hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
              console.log("[HLSPlayer] Media attached successfully");
            });

            console.log("[HLSPlayer] Attaching media and loading source");
            hlsRef.current.attachMedia(video);
            hlsRef.current.loadSource(streamUrl);
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            console.log("[HLSPlayer] Using native HLS support (Safari)");
            video.addEventListener("loadedmetadata", () => {
              console.log("[HLSPlayer] Native HLS metadata loaded");
              setIsLoading(false);
              setIsStreamReady(true);
            });

            video.addEventListener("error", () => {
              const videoError = video.error;
              console.error("[HLSPlayer] Native HLS error:", videoError);
              let errorMsg = "Error loading the stream";
              let detailedMsg = "";
              if (videoError) {
                switch (videoError.code) {
                  case MediaError.MEDIA_ERR_ABORTED:
                    errorMsg = "Playback aborted";
                    detailedMsg = "The video playback was aborted.";
                    break;
                  case MediaError.MEDIA_ERR_NETWORK:
                    errorMsg = "Network error";
                    detailedMsg = "A network error caused the stream to fail.";
                    break;
                  case MediaError.MEDIA_ERR_DECODE:
                    errorMsg = "Decoding error";
                    detailedMsg = "The stream cannot be decoded.";
                    break;
                  case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMsg = "Stream format not supported";
                    detailedMsg = "The stream format is not supported.";
                    break;
                }
              }
              handleStreamError(errorMsg, detailedMsg);
            });

            video.src = streamUrl;
          } else {
            console.error("[HLSPlayer] HLS not supported in this browser");
            handleStreamError(
              "HLS streaming not supported",
              "Your browser doesn't support HLS streaming."
            );
            setIsLoading(false);
          }
        } catch (err: any) {
          console.error("[HLSPlayer] Error initializing HLS:", err);
          setIsLoading(false);
          handleStreamError(`Stream error: ${err.message}`, err.stack);
        }
      };

      initHls();
    }, 500);

    return () => {
      console.log("[HLSPlayer] Cleanup on unmount or deps change");
      clearTimeout(timer);
      cleanupHls();
    };
  }, [isActive, streamUrl, retryCount, onError, onStreamLoaded]);

  // Start playback when stream is ready
  useEffect(() => {
    if (isStreamReady && isActive) {
      console.log("[HLSPlayer] Stream is ready, starting playback");
      startPlayback();
    }
  }, [isStreamReady, isActive]);

  // Update mute status
  useEffect(() => {
    if (videoRef.current && streamLoaded) {
      console.log("[HLSPlayer] Updating mute status:", isMuted);
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, streamLoaded]);

  const handleVideoClick = () => {
    if (videoRef.current && errorMessage?.includes("autoplay")) {
      console.log("[HLSPlayer] Manual play attempt");
      startPlayback();
    }
  };

  const handleRetryStream = () => {
    const newRetryCount = retryCount + 1;
    console.log("[HLSPlayer] Retrying stream, attempt:", newRetryCount);
    setRetryCount(newRetryCount);

    let urlToUse = streamUrl;
    if (newRetryCount > 2 && !streamUrl.includes("test-streams.mux.dev")) {
      console.log("[HLSPlayer] Multiple retries failed, trying test stream");
      urlToUse =
        "rtsp://rtspstream:ZrxusdhSSmn5gjgaqY74X@zephyr.rtsp.stream/traffic";
    }

    setStreamLoaded(false);
    setErrorMessage(null);
    setDetailedError(null);
    setIsLoading(true);
    setIsStreamReady(false);

    cleanupHls();

    setTimeout(() => {
      const video = videoRef.current;
      if (video && isActive) {
        if (Hls.isSupported()) {
          console.log("[HLSPlayer] Re-initializing HLS with URL:", urlToUse);
          const retryConfig = {
            ...getHlsConfig(),
            manifestLoadingMaxRetry: 8,
            levelLoadingMaxRetry: 8,
            fragLoadingMaxRetry: 10,
            manifestLoadingTimeOut: 20000,
            levelLoadingTimeOut: 20000,
            fragLoadingTimeOut: 30000,
            enableSoftwareAES: true,
            progressive: true,
            startFragPrefetch: true,
          };

          const hls = new Hls(retryConfig);
          hlsRef.current = hls;

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log("[HLSPlayer] Retry: Manifest parsed successfully");
            setIsLoading(false);
            setIsStreamReady(true);
            if (hls.levels && hls.levels.length > 0) {
              hls.currentLevel = 0;
            }
          });

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              console.error("[HLSPlayer] Retry: Fatal error", data);
              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                console.log(
                  "[HLSPlayer] Attempting to recover from network error"
                );
                hls.startLoad();
                return;
              } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                console.log(
                  "[HLSPlayer] Attempting to recover from media error"
                );
                hls.recoverMediaError();
                return;
              }
              handleStreamError("Stream retry failed", data.details);
            }
          });

          hls.attachMedia(video);
          hls.loadSource(urlToUse);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = urlToUse;
          video.addEventListener("loadedmetadata", () => {
            setIsLoading(false);
            setIsStreamReady(true);
          });
        }
      }
    }, 500);
  };

  const toggleDetailedError = () => {
    setShowDetailedError((prev) => !prev);
  };

  return (
    <div className="h-full w-full bg-black relative">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover ${
          streamLoaded ? "visible" : "hidden"
        }`}
        playsInline
        onClick={handleVideoClick}
      />

      {isLoading ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
          <p className="text-white text-lg">Loading stream...</p>
          {retryCount > 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Attempt {retryCount + 1}
            </p>
          )}
        </div>
      ) : streamLoaded ? (
        <div className="relative h-full w-full">
          {errorMessage && errorMessage.includes("Click to play") && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-md text-center cursor-pointer"
              onClick={handleVideoClick}
            >
              <p>{errorMessage}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-teal-600 text-teal-500 hover:bg-teal-900/30"
              >
                Click to Play
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
          <WifiOff className="h-16 w-16 text-red-500 mb-4" />
          <p className="text-white text-lg font-medium">Stream Error</p>
          <p className="text-gray-400 mt-2 mb-4">
            {errorMessage || "Unable to access stream"}
          </p>

          {detailedError && (
            <div className="mt-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-gray-600 text-gray-400 hover:bg-gray-800"
                onClick={toggleDetailedError}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                {showDetailedError ? "Hide Details" : "Show Details"}
              </Button>

              {showDetailedError && (
                <div className="mt-2 p-2 bg-gray-900 rounded text-left text-xs text-gray-400 max-w-xs overflow-auto max-h-32">
                  {detailedError}
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-teal-600 text-teal-500 hover:bg-teal-900/30"
            onClick={handleRetryStream}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry Connection {retryCount > 0 ? `(${retryCount + 1})` : ""}
          </Button>

          {retryCount > 1 && (
            <p className="text-xs text-gray-400 mt-2">
              After multiple retries, a test stream will be used
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Track running processes
const runningProcesses = new Map();

// Configuration
const HLS_CONFIG = {
  SEGMENT_TIME: 4, // time in seconds for each segment
  PLAYLIST_SIZE: 6, // number of segments to keep in the playlist
  CRF: 23, // video quality (recommended 23-28)
  PRESET: "ultrafast", // encoding preset - consider "veryfast" for a good balance
  TUNE: "zerolatency", // optimization for live streaming
  HLS_FLAGS: "delete_segments+append_list+program_date_time",
  RTSP_TIMEOUT: 10000, // timeout for RTSP connection (10 seconds)
  GOP_SIZE: 2 * 4, // Group of Pictures size (2 seconds at SEGMENT_TIME)
  AUDIO_CODEC: "aac", // AAC audio codec for better browser compatibility
  AUDIO_BITRATE: "128k", // Common audio bitrate
  ABR: false, // Adaptive Bitrate Streaming (disabled by default for simplicity)
  ABR_VARIANTS: [
    // Example ABR variants (requires more complex setup)
    // { bandwidth: 1200000, resolution: "1280x720", crf: 23 },
    // { bandwidth: 600000, resolution: "640x360", crf: 28 },
  ],
};

/**
 * Starts an FFMPEG process to convert RTSP stream to HLS format
 * @param {string} rtspUrl - RTSP URL of the camera feed
 * @param {string} streamId - Unique identifier for the stream (usually dogId + timestamp)
 * @returns {Promise<Object>} - Process information
 */
const startRtspToHlsConversion = (rtspUrl, streamId) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate unique ID if not provided
      const uniqueStreamId = streamId || `stream_${uuidv4()}`;

      // Get output directory from env or use default
      const baseOutputDir =
        process.env.HLS_OUTPUT_DIR || path.join(__dirname, "../public/output");

      // Ensure base directory exists first
      const publicDir = path.join(__dirname, "../public");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      if (!fs.existsSync(baseOutputDir)) {
        fs.mkdirSync(baseOutputDir, { recursive: true });
      }

      const outputDir = path.join(baseOutputDir, uniqueStreamId);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Get FFmpeg path from environment or use default
      const ffmpegPath =
        process.env.FFMPEG_PATH ||
        (process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg");

      // Log conversion start
      console.log(`Starting RTSP→HLS conversion: ${rtspUrl} → ${outputDir}`);

      const ffmpegArgs = [
        "-rtsp_transport",
        "tcp",
        "-i",
        rtspUrl,
        "-map",
        "0:v:0", // Map the first video stream
        "-c:v",
        "libx264",
        "-preset",
        HLS_CONFIG.PRESET,
        "-tune",
        HLS_CONFIG.TUNE,
        "-crf",
        HLS_CONFIG.CRF.toString(),
        "-g", // GOP size (keyframe interval)
        HLS_CONFIG.GOP_SIZE.toString(),
        "-sc_threshold",
        "0", // Force keyframes at scene changes (can improve quality)
        "-map",
        "0:a?", // Map first audio stream if it exists
        "-c:a",
        HLS_CONFIG.AUDIO_CODEC,
        "-b:a",
        HLS_CONFIG.AUDIO_BITRATE,
        "-ac",
        "2", // Force stereo audio
        "-f",
        "hls",
        "-hls_time",
        HLS_CONFIG.SEGMENT_TIME.toString(),
        "-hls_list_size",
        HLS_CONFIG.PLAYLIST_SIZE.toString(),
        "-hls_flags",
        HLS_CONFIG.HLS_FLAGS,
        "-hls_segment_filename",
        path.join(outputDir, "segment_%03d.ts"),
        path.join(outputDir, "stream.m3u8"),
      ];

      // Add advanced options for potentially better reliability
      ffmpegArgs.unshift(
        "-fflags",
        "nobuffer",
        "-flags",
        "low_delay",
        "-analyzeduration",
        "1000000", // Reduced analyze duration
        "-probesize",
        "500000", // Reduced probe size
        "-timeout",
        HLS_CONFIG.RTSP_TIMEOUT.toString()
      );

      const ffmpeg = spawn(ffmpegPath, ffmpegArgs);

      // Buffer for collecting error output
      let errorOutput = "";

      ffmpeg.stdout.on("data", (data) => {
        console.log(`FFMPEG [${uniqueStreamId}]: ${data}`);
      });

      ffmpeg.stderr.on("data", (data) => {
        const output = data.toString();
        errorOutput += output;

        // Only log if it contains useful information (not just progress)
        if (!output.includes("frame=") && !output.includes("fps=")) {
          console.log(`FFMPEG [${uniqueStreamId}] stderr: ${output}`);
        }
      });

      ffmpeg.on("close", (code) => {
        if (code !== 0) {
          console.error(
            `FFMPEG process exited with code ${code}: ${errorOutput}`
          );
          runningProcesses.delete(uniqueStreamId);
          reject(new Error(`FFMPEG exited with code ${code}: ${errorOutput}`));
        } else {
          console.log(
            `FFMPEG process completed successfully for ${uniqueStreamId}`
          );
        }
      });

      ffmpeg.on("error", (err) => {
        console.error(`Failed to start FFMPEG process: ${err.message}`);
        runningProcesses.delete(uniqueStreamId);
        reject(err);
      });

      // Store process for later management
      runningProcesses.set(uniqueStreamId, ffmpeg);

      // Build public URL for client
      const baseUrl = process.env.PUBLIC_URL || "http://localhost:8080";
      const hlsUrl = `${baseUrl}/stream/${uniqueStreamId}/stream.m3u8`;

      resolve({
        streamId: uniqueStreamId,
        status: "processing",
        pid: ffmpeg.pid,
        hlsUrl,
      });
    } catch (error) {
      console.error("Error in startRtspToHlsConversion:", error);
      reject(error);
    }
  });
};

/**
 * Stop an active FFmpeg RTSP to HLS conversion process
 * @param {string} streamId - ID of the stream to stop
 * @returns {Promise<object>} Result of stopping the process
 */
const stopRtspToHlsConversion = async (streamId) => {
  const processToStop = runningProcesses.get(streamId);

  if (processToStop) {
    processToStop.kill("SIGTERM");
    runningProcesses.delete(streamId);

    // Clean up stream files (wait for a short period to allow file writing to complete)
    const baseOutputDir =
      process.env.HLS_OUTPUT_DIR || path.join(__dirname, "../public/output");
    const outputDir = path.join(baseOutputDir, streamId);

    // Give FFMPEG a moment to finalize writing segments
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }

    return { message: "Stream stopped and cleanup completed" };
  } else {
    throw new Error("Stream not found or already stopped");
  }
};

/**
 * Cleans up HLS files for a stream
 * @param {string} streamId - ID of the stream to clean up
 */
const cleanupHlsFiles = (streamId) => {
  try {
    const baseOutputDir =
      process.env.HLS_OUTPUT_DIR || path.join(__dirname, "../public/output");
    const outputDir = path.join(baseOutputDir, streamId);

    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
      console.log(`Cleaned up HLS files for stream ${streamId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error cleaning up HLS files for ${streamId}:`, error);
    return false;
  }
};

module.exports = {
  startRtspToHlsConversion,
  stopRtspToHlsConversion,
  cleanupHlsFiles,
};

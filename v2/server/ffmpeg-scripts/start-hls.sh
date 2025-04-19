#!/bin/bash
ffmpeg \
  -rtsp_transport tcp \
  -analyzeduration 10000000 \
  -probesize 5000000 \
  -i "rtsp://rtspstream:ZrxusdhSSmn5gjgaqY74X@zephyr.rtsp.stream/traffic" \
  -map 0:v:0 \
  -c:v libx264 \
  -preset veryfast \
  -tune zerolatency \
  -f hls \
  -hls_time 4 \
  -hls_list_size 6 \
  -hls_flags delete_segments+program_date_time \
  -hls_segment_filename "/output/segment_%03d.ts" \
  "/output/stream.m3u8"

// Event types for socket communication
export enum SocketEvent {
  // Connection events
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  ERROR = "error",

  // Authentication events
  AUTHENTICATE = "authenticate",
  AUTHENTICATION_SUCCESS = "authentication_success",
  AUTHENTICATION_ERROR = "authentication_error",

  // Dog events
  DOG_LOCATION_UPDATE = "dog_location_update",
  DOG_STATUS_UPDATE = "dog_status_update",
  DOG_COMMAND = "dog_command",
  DOG_COMMAND_RESPONSE = "dog_command_response",

  // Assignment events
  ASSIGNMENT_CREATED = "assignment_created",
  ASSIGNMENT_UPDATED = "assignment_updated",
  ASSIGNMENT_COMPLETED = "assignment_completed",

  // Video streaming events
  VIDEO_STREAM_START = "video_stream_start",
  VIDEO_STREAM_STOP = "video_stream_stop",
  VIDEO_FRAME = "video_frame",
  AUDIO_DATA = "audio_data",
}

// Location update type
export type LocationUpdate = {
  dogId: string
  latitude: number
  longitude: number
  timestamp: number
  accuracy?: number
  speed?: number
  heading?: number
}

// Command type
export type DogCommand = {
  dogId: string
  command: string
  params?: Record<string, any>
  timestamp: number
}

// Command response type
export type CommandResponse = {
  dogId: string
  commandId: string
  success: boolean
  message?: string
  timestamp: number
}

// Event listener type
type EventListener = (...args: any[]) => void

/**
 * Socket service class
 */
class SocketService {
  private socket: WebSocket | null = null
  private url: string
  private connected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 1000
  private eventListeners: Map<string, EventListener[]> = new Map()
  private authToken: string | null = null

  constructor(url: string = process.env.NEXT_PUBLIC_SOCKET_URL || "wss://socket.cydog.com") {
    this.url = url
  }

  /**
   * Initialize the socket connection
   */
  public init(token: string): Promise<void> {
    this.authToken = token

    return new Promise((resolve, reject) => {
      try {
        // Close existing connection if any
        if (this.socket) {
          this.socket.close()
        }

        // Check if we're in a preview environment where WebSockets might be restricted
        const isPreviewEnvironment =
          typeof window !== "undefined" &&
          (window.location.hostname.includes("vercel.app") || window.location.hostname.includes("localhost"))

        if (isPreviewEnvironment) {
          console.log("Running in preview environment - using mock socket connection")
          // Simulate successful connection without actually connecting
          setTimeout(() => {
            this.connected = true
            this.reconnectAttempts = 0
            this.emit(SocketEvent.CONNECT)
            resolve()
          }, 500)
          return
        }

        // Create new WebSocket connection for non-preview environments
        this.socket = new WebSocket(this.url)

        // Set up event handlers
        this.socket.onopen = () => {
          console.log("Socket connection established")
          this.connected = true
          this.reconnectAttempts = 0

          // Authenticate with the server
          this.authenticate(token)
            .then(() => resolve())
            .catch(reject)

          // Emit connect event
          this.emit(SocketEvent.CONNECT)
        }

        this.socket.onclose = (event) => {
          console.log("Socket connection closed", event)
          this.connected = false

          // Emit disconnect event
          this.emit(SocketEvent.DISCONNECT, event)

          // Attempt to reconnect
          this.attemptReconnect()
        }

        this.socket.onerror = (error) => {
          console.error("Socket error:", error)

          // Emit error event
          this.emit(SocketEvent.ERROR, error)

          reject(error)
        }

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            // Handle the message based on its type
            if (data.type && data.payload) {
              this.emit(data.type, data.payload)
            }
          } catch (error) {
            console.error("Error parsing socket message:", error)
          }
        }
      } catch (error) {
        console.error("Error initializing socket:", error)
        // Don't reject the promise, just resolve it so the app continues to work
        this.connected = false
        resolve()
      }
    })
  }

  /**
   * Authenticate with the socket server
   */
  private authenticate(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        reject(new Error("Socket not connected"))
        return
      }

      // Set up authentication success listener
      const successListener = () => {
        this.off(SocketEvent.AUTHENTICATION_SUCCESS, successListener)
        this.off(SocketEvent.AUTHENTICATION_ERROR, errorListener)
        resolve()
      }

      // Set up authentication error listener
      const errorListener = (error: any) => {
        this.off(SocketEvent.AUTHENTICATION_SUCCESS, successListener)
        this.off(SocketEvent.AUTHENTICATION_ERROR, errorListener)
        reject(error)
      }

      // Register listeners
      this.on(SocketEvent.AUTHENTICATION_SUCCESS, successListener)
      this.on(SocketEvent.AUTHENTICATION_ERROR, errorListener)

      // Send authentication message
      this.send(SocketEvent.AUTHENTICATE, { token })
    })
  }

  /**
   * Attempt to reconnect to the socket server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnect attempts reached")
      return
    }

    this.reconnectAttempts++
    const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1)

    console.log(
      `Attempting to reconnect in ${timeout}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
    )

    setTimeout(() => {
      if (!this.connected && this.authToken) {
        this.init(this.authToken).catch((error) => {
          console.error("Reconnect failed:", error)
        })
      }
    }, timeout)
  }

  /**
   * Send a message to the socket server
   */
  public send(type: string, payload: any): void {
    // If socket is not connected, just log and return
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.log(`Socket not connected, would send: ${type}`, payload)
      return
    }

    const message = JSON.stringify({
      type,
      payload,
    })

    this.socket.send(message)
  }

  /**
   * Register an event listener
   */
  public on(event: string, listener: EventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }

    this.eventListeners.get(event)?.push(listener)
  }

  /**
   * Remove an event listener
   */
  public off(event: string, listener: EventListener): void {
    if (!this.eventListeners.has(event)) {
      return
    }

    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Emit an event to all registered listeners
   */
  private emit(event: string, ...args: any[]): void {
    if (!this.eventListeners.has(event)) {
      return
    }

    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args)
        } catch (error) {
          console.error(`Error in listener for event ${event}:`, error)
        }
      })
    }
  }

  /**
   * Send a command to a dog
   */
  public sendDogCommand(command: DogCommand): void {
    this.send(SocketEvent.DOG_COMMAND, command)
  }

  /**
   * Start video streaming for a dog
   */
  public startVideoStream(dogId: string): void {
    this.send(SocketEvent.VIDEO_STREAM_START, { dogId })
  }

  /**
   * Stop video streaming for a dog
   */
  public stopVideoStream(dogId: string): void {
    this.send(SocketEvent.VIDEO_STREAM_STOP, { dogId })
  }

  /**
   * Send audio data (for voice commands)
   */
  public sendAudioData(dogId: string, audioData: ArrayBuffer): void {
    // Note: Binary data should be handled differently in a real implementation
    // This is a simplified version
    this.send(SocketEvent.AUDIO_DATA, {
      dogId,
      audioData: btoa(String.fromCharCode(...new Uint8Array(audioData))),
    })
  }

  /**
   * Close the socket connection
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.connected = false
      this.authToken = null
    }
  }

  /**
   * Check if socket is connected
   */
  public isConnected(): boolean {
    return this.connected
  }
}

// Create and export a singleton instance
const socketService = new SocketService()
export default socketService

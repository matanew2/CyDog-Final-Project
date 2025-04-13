/**
 * Services index file
 * Exports all services for easy importing
 */

import API, { AuthApi, DogsApi, HandlersApi, AssignmentsApi } from "./api.service"
import socketService, { SocketEvent } from "./socket.service"

export { API, AuthApi, DogsApi, HandlersApi, AssignmentsApi, socketService, SocketEvent }

// Default export for convenience
export default {
  api: API,
  socket: socketService,
}

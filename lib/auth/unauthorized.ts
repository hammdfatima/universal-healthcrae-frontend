type UnauthorizedHandler = (() => void) | null

let unauthorizedHandler: UnauthorizedHandler = null

export function registerUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler

  return () => {
    if (unauthorizedHandler === handler) {
      unauthorizedHandler = null
    }
  }
}

export function handleUnauthorized() {
  unauthorizedHandler?.()
}

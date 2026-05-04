export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    if ("message" in error) {
      const message = (error as { message?: unknown }).message;

      if (typeof message === "string") {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(", ");
      }
    }

    if ("details" in error) {
      const details = (error as { details?: unknown }).details;

      if (typeof details === "object" && details !== null && "message" in details) {
        const nestedMessage = (details as { message?: unknown }).message;

        if (typeof nestedMessage === "string") {
          return nestedMessage;
        }

        if (Array.isArray(nestedMessage)) {
          return nestedMessage.join(", ");
        }
      }
    }
  }

  return "Ocurrió un error inesperado";
}

export function isAuthError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("autentic") ||
    message.includes("unauthorized") ||
    message.includes("forbidden") ||
    message.includes("permiso")
  );
}

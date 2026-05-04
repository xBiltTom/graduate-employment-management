import { notificationTypes } from "@/lib/constants";
import type { NotificationItem } from "@/types";

export type BackendNotification = {
  id: string;
  tipo?: string | null;
  titulo?: string | null;
  contenido?: string | null;
  leida?: boolean | null;
  creadoEn?: string | null;
};

function mapNotificationType(value?: string | null) {
  switch (value) {
    case notificationTypes.newOffer:
      return "NEW_OFFER";
    case notificationTypes.applicationCreated:
    case notificationTypes.applicationStatusChanged:
      return "APPLICATION_UPDATE";
    case notificationTypes.system:
      return "SYSTEM";
    default:
      return undefined;
  }
}

export function mapBackendNotification(
  notification: BackendNotification,
): NotificationItem {
  return {
    id: notification.id,
    title: notification.titulo ?? "Notificación",
    content: notification.contenido ?? "",
    read: Boolean(notification.leida),
    createdAt: notification.creadoEn ?? "",
    type: mapNotificationType(notification.tipo),
  };
}

import { GraduateNotificationsPage } from "@/components/graduate/graduate-notifications-page";
import { GraduateStatusNotice } from "@/components/graduate/graduate-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { graduateService } from "@/services";
import type { NotificationItem } from "@/types";

export default async function Page() {
  let notifications: NotificationItem[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    notifications = await graduateService.getNotifications();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión para ver esta sección."
      : getErrorMessage(error);
  }

  if (errorMessage) {
    return (
      <GraduateStatusNotice
        message={errorMessage}
        showLoginAction={showLoginAction}
      />
    );
  }

  return <GraduateNotificationsPage initialNotifications={notifications} />;
}

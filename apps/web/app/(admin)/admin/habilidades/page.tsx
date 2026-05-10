import { AdminSkillsPage } from "@/components/admin/admin-skills-page";
import { AdminStatusNotice } from "@/components/admin/admin-status-notice";
import { getErrorMessage, isAuthError } from "@/lib/errors";
import { adminService } from "@/services";
import type { AdminSkill } from "@/types";

export default async function Page() {
  let skills: AdminSkill[] = [];
  let errorMessage: string | undefined;
  let showLoginAction = false;

  try {
    skills = await adminService.getSkills();
  } catch (error) {
    showLoginAction = isAuthError(error);
    errorMessage = showLoginAction
      ? "Debes iniciar sesión como administrador para ver esta sección."
      : getErrorMessage(error);
  }

  if (!skills.length && errorMessage) {
    return <AdminStatusNotice message={errorMessage} showLoginAction={showLoginAction} />;
  }

  return <AdminSkillsPage skills={skills} />;
}

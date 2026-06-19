import { useParams } from "react-router-dom";
import { modulesById } from "../content/modules";
import type { ModuleId } from "../types/content";

export function useModuleContent() {
  const { moduleId } = useParams();
  if (!moduleId || !(moduleId in modulesById)) return undefined;
  return modulesById[moduleId as ModuleId];
}

import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchProjectById,
  updateProject,
} from "@/features/project/slices/projectSlice";
import {
  createProjectStages,
  updateProjectStages,
} from "@/features/project/slices/projectStepSlice";

export default function useProjectForm(projectId) {
  const dispatch = useDispatch();
  const { current: project, loading } = useSelector((state) => state.project);
  const fetchedSteps = useSelector((state) => state.projectStep.items) || [];

  const [values, setValues] = useState({
    name: "",
    detail: "",
    startAt: "",
    endAt: "",
    projectAmount: "",
    step: "CONTRACT",
  });

  const [steps, setSteps] = useState([]);
  const [initialSteps, setInitialSteps] = useState([]);
  const [stepEdited, setStepEdited] = useState(false);
  const [stepSaveFn, setStepSaveFn] = useState(() => async () => {});
  const [pendingStep, setPendingStep] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    const normalized = fetchedSteps.map((s) => ({
      ...s,
      orderNumber: s.orderNumber ?? s.orderNum,
    }));
    const sorted = normalized.sort((a, b) => a.orderNumber - b.orderNumber);
    setSteps(sorted);
    setInitialSteps((prev) => (prev.length === 0 ? sorted : prev));
  }, [fetchedSteps]);

  useEffect(() => {
    if (project) {
      setValues({
        name: project.name ?? "",
        detail: project.detail ?? "",
        startAt: dayjs(project.startAt).format("YYYY-MM-DD") || "",
        endAt: dayjs(project.endAt).format("YYYY-MM-DD") || "",
        projectAmount: project.projectAmount ?? "",
        step: project.step || "CONTRACT",
      });
    }
  }, [project]);

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const isEdited = useMemo(() => {
    if (!project) return false;

    const fieldsChanged =
      project.name !== values.name ||
      project.detail !== values.detail ||
      dayjs(project.startAt).format("YYYY-MM-DD") !== values.startAt ||
      dayjs(project.endAt).format("YYYY-MM-DD") !== values.endAt ||
      project.projectAmount !== values.projectAmount ||
      project.step !== values.step;

    return fieldsChanged || stepEdited || pendingStep !== null;
  }, [project, values, stepEdited, pendingStep]);

  const reset = () => {
    if (!project) return;

    setValues({
      name: project.name ?? "",
      detail: project.detail ?? "",
      startAt: dayjs(project.startAt).format("YYYY-MM-DD") || "",
      endAt: dayjs(project.endAt).format("YYYY-MM-DD") || "",
      projectAmount: project.projectAmount ?? "",
      step: project.step || "CONTRACT",
    });

    setSteps(initialSteps);
    setStepEdited(false);
    setPendingStep(null);
  };

  const save = useCallback(async () => {
    try {
      const payload = {
        id: projectId,
        name: values.name,
        detail: values.detail,
        ...(values.startAt && { startAt: `${values.startAt}T09:00:00` }),
        ...(values.endAt && { endAt: `${values.endAt}T18:00:00` }),
        projectAmount:
          values.projectAmount === "" ? null : Number(values.projectAmount),
        step: values.step,
        deleted: false,
      };

      await dispatch(updateProject(payload)).unwrap();

      if (stepEdited) {
        await stepSaveFn();
        setStepEdited(false);
      }

      if (pendingStep) {
        const nextOrder = (fetchedSteps?.length ?? 0) + 1;
        await dispatch(
          createProjectStages({
            projectId,
            projectSteps: [
              {
                title: pendingStep,
                orderNumber: nextOrder,
              },
            ],
          })
        ).unwrap();
        setPendingStep(null);
      }

      // reload latest project info after save
      await dispatch(fetchProjectById(projectId));
    } catch (err) {
      console.error("프로젝트 저장 실패:", err);
    }
  }, [
    dispatch,
    projectId,
    values,
    stepEdited,
    stepSaveFn,
    pendingStep,
    fetchedSteps,
  ]);

  return {
    loading,
    project,
    values,
    setField,
    isEdited,
    reset,
    save,
    steps,
    setSteps,
    initialSteps,
    setStepEdited,
    setStepSaveFn,
    setPendingStep,
  };
}

import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchProjectById,
  updateProject,
} from "@/features/project/slices/projectSlice";
import {
  createProjectStages,
  updateProjectStages,
  fetchProjectStages,
} from "@/features/project/slices/projectStepSlice";
import {
  addMemberToProject,
  removeMemberFromProject,
  fetchCompanyMembersInProject,
} from "@/features/project/slices/projectMemberSlice";

export default function useProjectForm(projectId) {
  const dispatch = useDispatch();
  const { current: project, loading } = useSelector((state) => state.project);
  const fetchedSteps = useSelector((state) => state.projectStep.items) || [];

  // 프로젝트 기본 값
  const [values, setValues] = useState({
    name: "",
    detail: "",
    startAt: "",
    endAt: "",
    projectAmount: "",
    step: "CONTRACT",
  });

  // 단계 관리
  const [steps, setSteps] = useState([]);
  const [initialSteps, setInitialSteps] = useState([]);
  const [stepEdited, setStepEdited] = useState(false);
  const [pendingStep, setPendingStep] = useState(null);

  // 직원(개발사/고객사) 관리
  const [devAssigned, setDevAssigned] = useState([]);
  const [clientAssigned, setClientAssigned] = useState([]);
  const [initialDevAssigned, setInitialDevAssigned] = useState([]);
  const [initialClientAssigned, setInitialClientAssigned] = useState([]);

  // 프로젝트 + 단계 조회
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchProjectStages(projectId));
    }
  }, [dispatch, projectId]);

  // 회사 직원 조회
  useEffect(() => {
    if (!project?.projectId) return;

    // 개발사 직원
    dispatch(
      fetchCompanyMembersInProject({
        projectId: project.projectId,
        companyId: project.devCompanyId,
      })
    ).then((action) => {
      const list = (action.payload.members || []).map((m) => ({
        ...m,
        isNew: false,
        isDelete: false,
      }));
      setDevAssigned(list);
      setInitialDevAssigned(list);
    });

    // 고객사 직원
    dispatch(
      fetchCompanyMembersInProject({
        projectId: project.projectId,
        companyId: project.clientCompanyId,
      })
    ).then((action) => {
      const list = (action.payload.members || []).map((m) => ({
        ...m,
        isNew: false,
        isDelete: false,
      }));
      setClientAssigned(list);
      setInitialClientAssigned(list);
    });
  }, [dispatch, project]);

  // 단계 정리
  useEffect(() => {
    const normalized = fetchedSteps.map((s) => ({
      ...s,
      orderNumber: s.orderNumber ?? s.orderNum,
    }));
    const sorted = normalized.sort((a, b) => a.orderNumber - b.orderNumber);
    setSteps(sorted);
    if (initialSteps.length === 0) {
      setInitialSteps(sorted);
    }
  }, [fetchedSteps]);

  // 프로젝트 기본값 세팅
  useEffect(() => {
    if (!project) return;
    setValues({
      name: project.name || "",
      detail: project.detail || "",
      startAt: dayjs(project.startAt).format("YYYY-MM-DD"),
      endAt: dayjs(project.endAt).format("YYYY-MM-DD"),
      projectAmount: project.projectAmount ?? "",
      step: project.step || "CONTRACT",
    });
  }, [project]);

  const setField = (field, value) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  // 변경 감지
  const isEdited = useMemo(() => {
    if (!project) return false;

    const fieldsChanged =
      project.name !== values.name ||
      project.detail !== values.detail ||
      dayjs(project.startAt).format("YYYY-MM-DD") !== values.startAt ||
      dayjs(project.endAt).format("YYYY-MM-DD") !== values.endAt ||
      project.projectAmount !== values.projectAmount ||
      project.step !== values.step;

    // 직원 변경: 새로 추가되거나 삭제 표시된 항목이 있으면 true
    const devChanged = devAssigned.some((e) => e.isNew || e.isDelete);
    const clientChanged = clientAssigned.some((e) => e.isNew || e.isDelete);

    return (
      fieldsChanged ||
      stepEdited ||
      pendingStep != null ||
      devChanged ||
      clientChanged
    );
  }, [project, values, stepEdited, pendingStep, devAssigned, clientAssigned]);

  // 리셋
  const reset = () => {
    if (!project) return;
    // fields
    setValues({
      name: project.name || "",
      detail: project.detail || "",
      startAt: dayjs(project.startAt).format("YYYY-MM-DD"),
      endAt: dayjs(project.endAt).format("YYYY-MM-DD"),
      projectAmount: project.projectAmount ?? "",
      step: project.step || "CONTRACT",
    });
    // 단계
    setSteps(initialSteps);
    setStepEdited(false);
    setPendingStep(null);
    // 직원
    setDevAssigned(initialDevAssigned);
    setClientAssigned(initialClientAssigned);
  };

  // 저장
  const save = useCallback(async () => {
    try {
      // 프로젝트 업데이트
      const payload = {
        id: projectId,
        name: values.name,
        detail: values.detail,
        ...(values.startAt && { startAt: `${values.startAt}T09:00:00` }),
        ...(values.endAt && { endAt: `${values.endAt}T18:00:00` }),
        projectAmount:
          values.projectAmount === "" ? null : Number(values.projectAmount),
        step: values.step,
      };
      await dispatch(updateProject(payload)).unwrap();

      // 단계 생성/업데이트
      const newSteps = steps.filter((s) => s.isNew);
      const existSteps = steps.filter((s) => !s.isNew);
      if (newSteps.length) {
        await dispatch(
          createProjectStages({
            projectId,
            projectSteps: newSteps.map(({ title, orderNumber }) => ({
              title,
              orderNumber,
            })),
          })
        ).unwrap();
      }
      if (stepEdited || newSteps.length) {
        await dispatch(
          updateProjectStages({
            projectId,
            projectStepUpdateWebRequests: existSteps.map(
              ({ projectStepId, title, orderNumber }) => ({
                projectStepId,
                title,
                orderNumber,
              })
            ),
          })
        ).unwrap();
      }

      // 직원 추가/삭제 처리
      devAssigned
        .filter((e) => e.isNew)
        .forEach((e) =>
          dispatch(addMemberToProject({ projectId, memberId: e.memberId }))
        );
      clientAssigned
        .filter((e) => e.isNew)
        .forEach((e) =>
          dispatch(addMemberToProject({ projectId, memberId: e.memberId }))
        );
      devAssigned
        .filter((e) => e.isDelete)
        .forEach((e) =>
          dispatch(removeMemberFromProject({ projectId, memberId: e.memberId }))
        );
      clientAssigned
        .filter((e) => e.isDelete)
        .forEach((e) =>
          dispatch(removeMemberFromProject({ projectId, memberId: e.memberId }))
        );

      // 전체 새로고침
      window.location.reload();
    } catch (err) {
      console.error("프로젝트 저장 실패:", err);
    }
  }, [
    dispatch,
    projectId,
    values,
    steps,
    stepEdited,
    devAssigned,
    clientAssigned,
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
    setPendingStep,
    devAssigned,
    clientAssigned,
    setDevAssigned,
    setClientAssigned,
  };
}

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

  // 기본 프로젝트 값
  const [values, setValues] = useState({
    name: "",
    detail: "",
    startAt: "",
    endAt: "",
    projectAmount: "",
    step: "CONTRACT",
  });

  // 프로젝트 단계 관리
  const [steps, setSteps] = useState([]);
  const [initialSteps, setInitialSteps] = useState([]);
  const [stepEdited, setStepEdited] = useState(false);
  const [stepSaveFn, setStepSaveFn] = useState(() => async () => {}); // 초기 값 설정
  const [pendingStep, setPendingStep] = useState(null);

  // 직원 상태 관리 (개발사, 고객사만 나누어 관리)
  const [devAssigned, setDevAssigned] = useState([]); // 개발사 직원
  const [clientAssigned, setClientAssigned] = useState([]); // 고객사 직원

  // 프로젝트 및 단계 정보 불러오기
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchProjectStages(projectId));
    }
  }, [dispatch, projectId]);

  // 회사 직원 목록 불러오기 (개발사, 고객사)
  useEffect(() => {
    if (
      !project?.devCompanyId ||
      !project?.clientCompanyId ||
      !project.projectId
    )
      return;

    // Fetch development company members
    dispatch(
      fetchCompanyMembersInProject({
        projectId: project.projectId,
        companyId: project?.devCompanyId,
      })
    ).then((action) => {
      const devMembers = action.payload.members || [];
      // isNew 값을 false로 설정하여 초기화
      const devMembersWithSelection = devMembers.map((member) => ({
        ...member,
        isNew: false, // isNew를 false로 설정
        isDelete: false, // isDelete를 false로 설정
      }));

      setDevAssigned(devMembersWithSelection);
    });

    // Fetch client company members
    dispatch(
      fetchCompanyMembersInProject({
        projectId: project.projectId,
        companyId: project?.clientCompanyId,
      })
    ).then((action) => {
      const clientMembers = action.payload.members || [];
      // isNew 값을 false로 설정하여 초기화
      const clientMembersWithSelection = clientMembers.map((member) => ({
        ...member,
        isNew: false, // isNew를 false로 설정
        isDelete: false, // isDelete를 false로 설정
      }));

      setClientAssigned(clientMembersWithSelection);
    });
  }, [dispatch, project]);

  // 프로젝트 단계 정보 정리
  useEffect(() => {
    if (fetchedSteps.length > 0 && initialSteps.length === 0) {
      const normalized = fetchedSteps.map((s) => ({
        ...s,
        orderNumber: s.orderNumber ?? s.orderNum,
      }));
      const sorted = normalized.sort((a, b) => a.orderNumber - b.orderNumber);
      setSteps(sorted);
      setInitialSteps(sorted);
    } else {
      const normalized = fetchedSteps.map((s) => ({
        ...s,
        orderNumber: s.orderNumber ?? s.orderNum,
      }));
      const sorted = normalized.sort((a, b) => a.orderNumber - b.orderNumber);
      setSteps(sorted);
    }
  }, [fetchedSteps]);

  // 프로젝트 데이터 세팅
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

  // 프로젝트 필드 값 변경
  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  // 프로젝트가 수정되었는지 확인
  const isEdited = useMemo(() => {
    if (!project) return false;

    const fieldsChanged =
      project.name !== values.name ||
      project.detail !== values.detail ||
      dayjs(project.startAt).format("YYYY-MM-DD") !== values.startAt ||
      dayjs(project.endAt).format("YYYY-MM-DD") !== values.endAt ||
      project.projectAmount !== values.projectAmount ||
      project.step !== values.step;

    const employeeChanged =
      devAssigned.some((emp) => emp.isNew || emp.isDeleted) ||
      clientAssigned.some((emp) => emp.isNew || emp.isDeleted); // 직원 변경 감지 (새로 추가된 직원이나 삭제된 직원)

    return (
      fieldsChanged || stepEdited || pendingStep !== null || employeeChanged
    );
  }, [project, values, stepEdited, pendingStep, devAssigned, clientAssigned]);

  // 프로젝트 값 초기화
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

  // 프로젝트 저장
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

      const newSteps = steps.filter((s) => s.isNew);
      const existingSteps = steps.filter((s) => !s.isNew);

      if (newSteps.length > 0) {
        await dispatch(
          createProjectStages({
            projectId,
            projectSteps: newSteps.map((s) => ({
              title: s.title,
              orderNumber: s.orderNumber,
            })),
          })
        ).unwrap();
      }

      if (stepEdited || newSteps.length > 0) {
        await dispatch(
          updateProjectStages({
            projectId,
            projectStepUpdateWebRequests: existingSteps.map(
              ({ projectStepId, title, orderNumber }) => ({
                projectStepId,
                title,
                orderNumber,
              })
            ),
          })
        ).unwrap();
      }

      // 새로 추가된 직원 처리
      const newAssignedEmployees = [
        ...devAssigned.filter((emp) => emp.isNew),
        ...clientAssigned.filter((emp) => emp.isNew),
      ];
      newAssignedEmployees.forEach((emp) => {
        if (!emp.memberId) return;
        dispatch(addMemberToProject({ projectId, memberId: emp.memberId }));
      });

      // 삭제된 직원 처리
      const deletedEmployees = [
        ...devAssigned.filter((emp) => emp.isDelete),
        ...clientAssigned.filter((emp) => emp.isDelete),
      ];
      deletedEmployees.forEach((emp) => {
        if (!emp.memberId) return;
        dispatch(
          removeMemberFromProject({ projectId, memberId: emp.memberId })
        );
      });

      // 화면 새로고침
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
    setStepSaveFn,
    setPendingStep,
    devAssigned, // 개발사 직원
    clientAssigned, // 고객사 직원
    setDevAssigned, // 개발사 직원 상태 변경 함수
    setClientAssigned, // 고객사 직원 상태 변경 함수
  };
}

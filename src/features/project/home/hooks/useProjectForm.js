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
  fetchProjectStages,
} from "@/features/project/slices/projectStepSlice";
import {
  addMemberToProject,
  removeMemberFromProject,
  fetchCompanyMembersInProject,
} from "@/features/project/slices/projectMemberSlice";
import { getCompanyMembersByCompanyId } from "@/api/member";

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
  const [stepSaveFn, setStepSaveFn] = useState(() => async () => {});
  const [pendingStep, setPendingStep] = useState(null);

  // 직원 관리 (개발사 / 고객사)
  const [devAssigned, setDevAssigned] = useState([]);
  const [clientAssigned, setClientAssigned] = useState([]);
  const [initialDevAssigned, setInitialDevAssigned] = useState([]);
  const [initialClientAssigned, setInitialClientAssigned] = useState([]);

  // 프로젝트 + 단계 불러오기
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchProjectStages(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (!project?.projectId || !project.devCompanyId) return;

    const loadDevMembers = async () => {
      try {
        // 1) 프로젝트에 할당된 개발사 직원 조회
        const assignedAction = await dispatch(
          fetchCompanyMembersInProject({
            projectId: project.projectId,
            companyId: project.devCompanyId,
          })
        ).unwrap();

        const assignedList = (assignedAction.members || []).map((m) => ({
          memberId: m.memberId,
          memberName: m.memberName,
          email: m.email,
          memberRole: m.memberRole,
          isManager: m.isManager,
          isNew: false,
          isDelete: false,
        }));

        // 2) 회사 전체 개발사 직원 조회
        const res = await getCompanyMembersByCompanyId(project.devCompanyId);
        const fullList = res.data.data.members;

        // 3) 할당되지 않은 직원만 missing으로 추출
        const missing = fullList
          .filter((m) => !assignedList.some((e) => e.memberId === m.id))
          .map((m) => ({
            memberId: m.id,
            memberName: m.name,
            email: m.email,
            memberRole: m.role,
            isManager: false,
            isNew: true,
            isDelete: true,
          }));

        const combined = [...assignedList, ...missing];

        setDevAssigned(combined);
        setInitialDevAssigned(combined);
      } catch (err) {
        console.error("개발사 직원 로드 실패:", err);
      }
    };

    loadDevMembers();
  }, [dispatch, project]);

  // 고객사 직원 로드 & 병합
  useEffect(() => {
    if (!project?.projectId || !project.clientCompanyId) return;

    const loadClientMembers = async () => {
      try {
        // 1) 프로젝트에 할당된 고객사 직원 조회
        const assignedAction = await dispatch(
          fetchCompanyMembersInProject({
            projectId: project.projectId,
            companyId: project.clientCompanyId,
          })
        ).unwrap();

        const assignedList = (assignedAction.members || []).map((m) => ({
          memberId: m.memberId,
          memberName: m.memberName,
          email: m.email,
          memberRole: m.memberRole,
          isManager: m.isManager,
          isNew: false,
          isDelete: false,
        }));

        // 2) 회사 전체 고객사 직원 조회
        const res = await getCompanyMembersByCompanyId(project.clientCompanyId);
        const fullList = res.data.data.members;

        // 3) 할당되지 않은 직원만 missing으로 추출
        const missing = fullList
          .filter((m) => !assignedList.some((e) => e.memberId === m.id))
          .map((m) => ({
            memberId: m.id,
            memberName: m.name,
            email: m.email,
            memberRole: m.role,
            isManager: false,
            isNew: true,
            isDelete: true,
          }));

        const combined = [...assignedList, ...missing];

        setClientAssigned(combined);
        setInitialClientAssigned(combined);
      } catch (err) {
        console.error("고객사 직원 로드 실패:", err);
      }
    };

    loadClientMembers();
  }, [dispatch, project]);

  console.log("setInitialDevAssigned", initialDevAssigned);

  // 3) 전체 고객사 직원 목록 불러와서 assigned에 없는 사람은 isNew/isDelete 기본 값으로 추가
  useEffect(() => {
    if (!project?.clientCompanyId) return;

    getCompanyMembersByCompanyId(project.clientCompanyId)
      .then((res) => {
        const full = res.data.data.members;
        setClientAssigned((prev) => {
          const missing = full
            .filter((m) => !prev.some((e) => e.memberId === m.id))
            .map((m) => ({
              memberId: m.id,
              memberName: m.name,
              email: m.email,
              memberRole: m.memberRole,
              isManager: false,
              isNew: true,
              isDelete: true,
            }));
          return prev.concat(missing);
        });
        setInitialClientAssigned(full);
      })
      .catch(console.error);
  }, [project?.clientCompanyId]);

  // 단계 정리 및 초기화
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
  }, [fetchedSteps, initialSteps.length]);

  // 프로젝트 기본값 세팅
  useEffect(() => {
    if (project) {
      setValues({
        name: project.name ?? "",
        detail: project.detail ?? "",
        startAt: project.startAt
          ? dayjs(project.startAt).format("YYYY-MM-DD")
          : "",
        endAt: project.endAt ? dayjs(project.endAt).format("YYYY-MM-DD") : "",
        projectAmount: project.projectAmount ?? "",
        step: project.step || "CONTRACT",
      });
    }
  }, [project]);

  const setField = (field, value) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  console.log(devAssigned, "devAssigned");

  // 변경 여부 계산
  const isEdited = useMemo(() => {
    if (!project) return false;

    const fieldsChanged =
      project.name !== values.name ||
      project.detail !== values.detail ||
      dayjs(project.startAt).format("YYYY-MM-DD") !== values.startAt ||
      dayjs(project.endAt).format("YYYY-MM-DD") !== values.endAt ||
      project.projectAmount !== values.projectAmount ||
      project.step !== values.step;

    const devChanged = devAssigned.some((emp) => {
      const init = initialDevAssigned.find((i) => i.memberId === emp.memberId);
      if (init) {
        // 초기엔 isNew/isDelete 가 모두 false 였으니, 지금 true 로 바뀌었거나
        // 혹은 반대로 바뀐 게 있다면 true
        return emp.isNew !== init.isNew || emp.isDelete !== init.isDelete;
      }
      // 초기 스냅샷엔 없던 멤버 → 당연히 추가된 것이므로 변화로 간주
      return emp.isNew || emp.isDelete;
    });

    // ▶ clientAssigned 도 동일하게
    const clientChanged = clientAssigned.some((emp) => {
      const init = initialClientAssigned.find(
        (i) => i.memberId === emp.memberId
      );
      if (init) {
        return emp.isNew !== init.isNew || emp.isDelete !== init.isDelete;
      }
      return emp.isNew || emp.isDelete;
    });

    const managerChanged =
      devAssigned.some((emp) => {
        const init = initialDevAssigned.find(
          (i) => i.memberId === emp.memberId
        );
        return init ? emp.isManager !== init.isManager : false;
      }) ||
      clientAssigned.some((emp) => {
        const init = initialClientAssigned.find(
          (i) => i.memberId === emp.memberId
        );
        return init ? emp.isManager !== init.isManager : false;
      });

    return (
      fieldsChanged ||
      stepEdited ||
      pendingStep !== null ||
      devChanged ||
      clientChanged ||
      managerChanged
    );
  }, [project, values, stepEdited, pendingStep, devAssigned, clientAssigned]);

  // 리셋
  const reset = () => {
    if (!project) return;

    setValues({
      name: project.name ?? "",
      detail: project.detail ?? "",
      startAt: project.startAt
        ? dayjs(project.startAt).format("YYYY-MM-DD")
        : "",
      endAt: project.endAt ? dayjs(project.endAt).format("YYYY-MM-DD") : "",
      projectAmount: project.projectAmount ?? "",
      step: project.step || "CONTRACT",
    });
    setSteps(initialSteps);
    setStepEdited(false);
    setPendingStep(null);
    setDevAssigned(initialDevAssigned);
    setClientAssigned(initialClientAssigned);
  };

  // 저장
  const save = useCallback(async () => {
    try {
      // 1) payload 준비
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

      // 2) 실제 프로젝트 필드 변경 여부만 체크
      const hasFieldChanges =
        project.name !== payload.name ||
        project.detail !== payload.detail ||
        (project.startAt ? dayjs(project.startAt).format("YYYY-MM-DD") : "") !==
          values.startAt ||
        (project.endAt ? dayjs(project.endAt).format("YYYY-MM-DD") : "") !==
          values.endAt ||
        project.projectAmount !== payload.projectAmount ||
        project.step !== payload.step;

      // 3) 변경이 있을 때만 API 호출
      if (hasFieldChanges) {
        await dispatch(updateProject(payload)).unwrap();
      }

      // 단계 생성/업데이트
      const newSteps = steps.filter((s) => s.isNew);
      const existingSteps = steps.filter((s) => !s.isNew);

      if (newSteps.length) {
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
      if (stepEdited || newSteps.length) {
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

      // 직원 추가/삭제 처리
      devAssigned
        .filter((e) => e.isNew && !e.isDelete)
        .forEach((e) =>
          dispatch(addMemberToProject({ projectId, memberId: e.memberId }))
        );
      clientAssigned
        .filter((e) => e.isNew && !e.isDelete)
        .forEach((e) =>
          dispatch(addMemberToProject({ projectId, memberId: e.memberId }))
        );
      devAssigned
        .filter((e) => !e.isNew && e.isDelete)
        .forEach((e) =>
          dispatch(removeMemberFromProject({ projectId, memberId: e.memberId }))
        );
      clientAssigned
        .filter((e) => !e.isNew && e.isDelete)
        .forEach((e) =>
          dispatch(removeMemberFromProject({ projectId, memberId: e.memberId }))
        );

      const managerChanged = [...devAssigned, ...clientAssigned].filter(
        (emp) => emp.isManager !== emp.originalIsManager
      );
      for (const emp of managerChanged) {
        try {
          await updateProjectManager({
            memberId: emp.memberId,
            projectId,
          });
        } catch (err) {
          console.error("매니저 상태 변경 실패:", emp.memberId, err);
        }
      }

      // 완료 후 새로고침
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
    devAssigned,
    clientAssigned,
    setDevAssigned,
    setClientAssigned,
  };
}

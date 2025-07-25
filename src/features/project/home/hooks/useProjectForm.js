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
  updateProjectManager,
} from "@/features/project/slices/projectMemberSlice";
import { getCompanyMembersByCompanyId } from "@/api/member";
import { updateProjectStatus } from "@/api/project";

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
    status: "CONTRACT",
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

  const [saving, setSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [amountError, setAmountError] = useState("");

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

        // --- 헬퍼: 페이지 반복 호출로 전체 직원 목록 가져오기 ---
        const fetchAllMembers = async (companyId) => {
          let page = 1;
          let all = [];
          while (true) {
            const res = await getCompanyMembersByCompanyId(companyId, page);
            const members = res.data.data.members;
            all = all.concat(members);
            if (members.length < 10) break; // 마지막 페이지
            page += 1;
          }
          return all;
        };

        // 2) 회사 전체 개발사 직원 (모든 페이지)
        const fullList = await fetchAllMembers(project.devCompanyId);

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

        // --- 헬퍼: 페이지 반복 호출로 전체 직원 목록 가져오기 ---
        const fetchAllMembers = async (companyId) => {
          let page = 1;
          let all = [];
          while (true) {
            const res = await getCompanyMembersByCompanyId(companyId, page);
            const members = res.data.data.members;
            all = all.concat(members);
            if (members.length < 10) break; // 마지막 페이지 도달
            page += 1;
          }
          return all;
        };

        // 2) 회사 전체 고객사 직원 (모든 페이지)
        const fullList = await fetchAllMembers(project.clientCompanyId);

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
        status: project.step || "CONTRACT",
      });
    }
  }, [project]);

  const setField = (field, value) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  // 기간 벨리데이션 체크 함수
  const validateDates = (startAt, endAt) => {
    if (!startAt || !endAt) {
      return false;
    }

    const startDate = dayjs(startAt);
    const endDate = dayjs(endAt);
    const today = dayjs().startOf('day');

    // 시작일이 오늘보다 이전인 경우
    if (startDate.isBefore(today)) {
      return false;
    }

    // 종료일이 시작일보다 이전인 경우
    if (endDate.isBefore(startDate)) {
      return false;
    }

    // 프로젝트 기간이 1일 미만인 경우
    if (endDate.diff(startDate, 'day') < 1) {
      return false;
    }

    // 프로젝트 기간이 5년(1825일)을 초과하는 경우
    if (endDate.diff(startDate, 'day') > 1825) {
      return false;
    }

    return true;
  };

  // 변경 여부 계산
  const isEdited = useMemo(() => {
    if (!project) return false;

    const fieldsChanged =
      project.name !== values.name ||
      project.detail !== values.detail ||
      dayjs(project.startAt).format("YYYY-MM-DD") !== values.startAt ||
      dayjs(project.endAt).format("YYYY-MM-DD") !== values.endAt ||
      project.projectAmount !== values.projectAmount ||
      project.step !== values.status;

    const datesValid = validateDates(values.startAt, values.endAt);

    const devChanged = devAssigned.some((emp) => {
      const init = initialDevAssigned.find((i) => i.memberId === emp.memberId);
      if (init) {
        return emp.isNew !== init.isNew || emp.isDelete !== init.isDelete;
      }
      return emp.isNew || emp.isDelete;
    });

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
      managerChanged ||
      !datesValid
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
      status: project.step || "CONTRACT",
    });
    setSteps(initialSteps);
    setStepEdited(false);
    setPendingStep(null);
    setDevAssigned(initialDevAssigned);
    setClientAssigned(initialClientAssigned);
  };

  // 저장
  const save = useCallback(async () => {
    setSaving(true);
    let success = true;
    try {
      // 0) 프로젝트 상태 변경(pendingStep)이 있으면 한 번만 API 요청
      if (values.status !== null && values.status !== project.step) {
        await updateProjectStatus(projectId, values.status);
      }
      // 1) payload 준비
      const payload = {
        id: projectId,
        name: values.name,
        detail: values.detail,
        ...(values.startAt && { startAt: `${values.startAt}T09:00:00` }),
        ...(values.endAt && { endAt: `${values.endAt}T18:00:00` }),
        projectAmount:
          values.projectAmount === "" ? null : Number(values.projectAmount),
        deleted: false,
        step: project.step,
      };

      // 2) 실제 프로젝트 필드 변경 여부만 체크
      const hasFieldChanges =
        project.name !== payload.name ||
        project.detail !== payload.detail ||
        (project.startAt ? dayjs(project.startAt).format("YYYY-MM-DD") : "") !==
          values.startAt ||
        (project.endAt ? dayjs(project.endAt).format("YYYY-MM-DD") : "") !==
          values.endAt ||
        project.projectAmount !== payload.projectAmount;

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
      const addPromises = [
        ...devAssigned
          .filter((e) => e.isNew && !e.isDelete)
          .map((e) =>
            dispatch(
              addMemberToProject({ projectId, memberId: e.memberId })
            ).unwrap()
          ),
        ...clientAssigned
          .filter((e) => e.isNew && !e.isDelete)
          .map((e) =>
            dispatch(
              addMemberToProject({ projectId, memberId: e.memberId })
            ).unwrap()
          ),
      ];

      const removePromises = [
        ...devAssigned
          .filter((e) => !e.isNew && e.isDelete)
          .map((e) =>
            dispatch(
              removeMemberFromProject({ projectId, memberId: e.memberId })
            ).unwrap()
          ),
        ...clientAssigned
          .filter((e) => !e.isNew && e.isDelete)
          .map((e) =>
            dispatch(
              removeMemberFromProject({ projectId, memberId: e.memberId })
            ).unwrap()
          ),
      ];

      await Promise.all([...addPromises, ...removePromises]);

      // 매니저 변경 탐지
      const managerChanged = [];
      for (const emp of devAssigned) {
        const init = initialDevAssigned.find(
          (i) => i.memberId === emp.memberId
        );
        if (init && init.isManager !== emp.isManager) managerChanged.push(emp);
      }
      for (const emp of clientAssigned) {
        const init = initialClientAssigned.find(
          (i) => i.memberId === emp.memberId
        );
        if (init && init.isManager !== emp.isManager) managerChanged.push(emp);
      }

      // 매니저 상태 변경 API 호출
      const managerPromises = managerChanged.map((emp) =>
        dispatch(
          updateProjectManager({ projectId, memberId: emp.memberId })
        ).unwrap()
      );
      await Promise.all(managerPromises);
    } catch (err) {
      setAlertInfo({
        open: true,
        message: "프로젝트 저장 중 오류가 발생했습니다.",
        severity: "error",
      });
      success = false;
    } finally {
      setSaving(false);
      if (success) {
        window.location.reload();
      } else {
        // 실패 시에만 로딩 해제
        setSaving(false);
      }
    }
  }, [
    dispatch,
    projectId,
    project,
    values,
    steps,
    stepEdited,
    devAssigned,
    clientAssigned,
    initialDevAssigned,
    initialClientAssigned,
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
    saving,
    alertInfo,
    setAlertInfo,
  };
}

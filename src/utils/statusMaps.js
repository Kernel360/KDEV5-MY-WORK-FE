export const STATUS_OPTIONS = [
  { value: "CONTRACT", label: "결제", color: "neutral" },
  { value: "IN_PROGRESS", label: "진행", color: "info" },
  { value: "PAYMENT", label: "중단", color: "warning" },
  { value: "COMPLETED", label: "완료", color: "success" },
];

export const POST_APPROVAL_STATUS = {
  PENDING: { label: "답변 대기", color: "neutral" },
  APPROVED: { label: "답변 완료", color: "success" },
};

export const CHECKLIST_STATUS = {
  APPROVED: { label: "승인", color: "success" },
  REJECTED: { label: "반려", color: "error" },
  REQUEST_CHANGES: { label: "수정 요청", color: "warning" },
  PENDING: { label: "체크리스트 생성", color: "neutral" },
  REVIEW: { label: "댓글", color: "info" },
};

export const TARGET_TYPE_LABELS = {
  PROJECT_CHECK_LIST: "체크리스트",
  POST: "게시글",
};

const DEFAULT_META = { label: "-", color: "neutral" };

export const getStatusLabel = (value, options = STATUS_OPTIONS) => {
  if (!value || !options) return "-";
  const match = Array.isArray(options)
    ? options.find((opt) => opt.value === value)
    : options[value];
  return match?.label || match || (value ?? "-");
};

export const getStatusMeta = (value, map = STATUS_OPTIONS) => {
  if (!value || !map) return DEFAULT_META;
  const match = Array.isArray(map)
    ? map.find((opt) => opt.value === value)
    : map[value];
  return match || DEFAULT_META;
};

export const getStatusColor = (value, map = STATUS_OPTIONS) => {
  return getStatusMeta(value, map)?.color || DEFAULT_META.color;
};

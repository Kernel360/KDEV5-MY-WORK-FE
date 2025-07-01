const STATUS_OPTIONS = [
  { value: "CONTRACT", label: "결제" },
  { value: "IN_PROGRESS", label: "진행" },
  { value: "PAYMENT", label: "중단" },
  { value: "COMPLETED", label: "완료" },
];

const getStatusLabel = (value) => {
  const option = STATUS_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : value;
};

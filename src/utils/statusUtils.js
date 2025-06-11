const STATUS_OPTIONS = [
  { value: 'NOT_STARTED', label: '계획' },
  { value: 'IN_PROGRESS', label: '진행' },
  { value: 'PAUSED', label: '중단' },
  { value: 'COMPLETED', label: '완료' },
];

const getStatusLabel = (value) => {
  const option = STATUS_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

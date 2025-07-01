export const getChecklistLabel = (type) => {
  switch (type) {
    case "APPROVED":
      return "승인";
    case "REJECTED":
      return "반려";
    case "REQUEST_CHANGES":
      return "수정 요청";
    case "PENDING":
      return "결재 요청";
    case "REVIEW":
      return "댓글";
    default:
      return type;
  }
};

export const getPostLabel = (type) => {
  switch (type) {
    case "APPROVED":
      return "답변 완료";
    case "PENDING":
      return "답변 대기";
    default:
      return type;
  }
};

export const getTargetLabel = (type) => {
  switch (type) {
    case "PROJECT_CHECK_LIST":
      return "체크리스트";
    case "POST":
      return "게시글";
    default:
      return type;
  }
};

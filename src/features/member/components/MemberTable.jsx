import CustomTable from "@/components/common/customTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembers, deleteMember } from "../memberSlice";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/common/confirmDialog/ConfirmDialog";
import AlertMessage from "@/components/common/alertMessage/AlertMessage";

const columns = [
  { key: "name", label: "이름", type: "avatar", searchable: true },
  { key: "email", label: "이메일", type: "text", searchable: true },
  { key: "companyName", label: "회사", type: "text", searchable: false },
  { key: "position", label: "직책", type: "text", searchable: true },
  { key: "department", label: "부서", type: "text", searchable: true },
  { key: "phoneNumber", label: "연락처", type: "text", searchable: true },
  { key: "createdAt", label: "등록일", type: "date" },
];

export default function MemberTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    list: members,
    totalCount,
    status,
    error,
  } = useSelector((state) => state.member);

  const [page, setPage] = useState(1);
  const [keywordType, setKeywordType] = useState("");
  const [keyword, setKeyword] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [notiOpen, setNotiOpen] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const [notiType, setNotiType] = useState("error");

  const loadMembers = useCallback(() => {
    dispatch(
      fetchMembers({
        page,
        keyword: keyword || null,
        keywordType: keyword ? keywordType.toUpperCase() : null,
      })
    );
  }, [dispatch, page, keywordType, keyword]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteMember({ memberId: selectedMember.id })).unwrap();
      setConfirmOpen(false);
      loadMembers();
      setNotiType("success");
      setNotiMessage("회원이 삭제되었습니다.");
      setNotiOpen(true);
    } catch (err) {
      setNotiType("error");
      setNotiMessage("삭제에 실패했습니다.");
      setNotiOpen(true);
    }
  };

  const drawMember = (members || []).map((p) => ({
    ...p,
    name: {
      name: p.name,
      src: `https://i.pravatar.cc/40?u=${p.id}`,
    },
  }));

  return (
    <>
      <CustomTable
        columns={columns}
        rows={drawMember || []}
        onRowClick={(row) => {
          navigate(`/members/${row.id}`);
        }}
        pagination={{
          page,
          size: 10,
          total: totalCount || 0,
          onPageChange: (newPage) => setPage(newPage),
        }}
        search={{
          key: keywordType,
          placeholder: "검색어를 입력하세요",
          value: keyword,
          onChange: (newValue) => {
            setPage(1);
            setKeyword(newValue);
          },
          onKeyChange: (newType) => {
            setPage(1);
            setKeywordType(newType);
          },
        }}
        onDelete={(row) => {
          setSelectedMember(row);
          setConfirmOpen(true);
        }}
        loading={status === "loading"}
        error={error}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="회원을 삭제하시겠습니까?"
        description="삭제 후에는 복구할 수 없습니다."
        isDelete
        confirmKind="danger"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
      <AlertMessage
        open={notiOpen}
        onClose={() => setNotiOpen(false)}
        message={notiMessage}
        severity={notiType}
      />
    </>
  );
}

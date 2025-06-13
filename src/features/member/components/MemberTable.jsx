import CustomTable from "@/components/common/customTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembers } from "@/features/member/memberSlice";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_TYPES = [
  { value: "name", label: "이름" },
  { value: "email", label: "이메일" },
  { value: "company", label: "회사" },
  { value: "position", label: "직책" },
  { value: "department", label: "부서" },
  { value: "phoneNumber", label: "연락처" },
];

const columns = [
  { key: "name", label: "이름", type: "avatar", searchable: true },
  { key: "email", label: "이메일", type: "text", searchable: true },
  { key: "companyName", label: "회사", type: "text", searchable: true },
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

  const drawMember = (members || []).map((p, idx) => ({
    ...p,
    name: {
      name: p.name,
      src: `https://i.pravatar.cc/40?u=${p.id}`,
    },
  }));

  return (
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
      loading={status === "loading"}
      error={error}
    />
  );
}

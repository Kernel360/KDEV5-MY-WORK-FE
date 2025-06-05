import CustomTable from "@/components/common/customTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembers } from "@/features/member/memberSlice";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
  { key: "avatar", label: "이름", type: "avatar" },
  { key: "email", label: "이메일", type: "text"},
  { key: "position", label: "직책", type: "text" },
  { key: "department", label: "부서", type: "text" },
  { key: "phoneNumber", label: "연락처", type: "text" },
  {
    key: "deleted",
    label: "상태",
    type: "status",
    filter: true,
    statusMap: {
      true: { color: "error", label: "비활성" },
      false: { color: "success", label: "활성" },
    },
  },
  { key: "createdAt", label: "등록일", type: "date" },
];

export default function MemberTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: members, totalCount, status, error } = useSelector(
    (state) => state.member
  );

  const [page, setPage] = useState(1);
  const [keywordType, setKeywordType] = useState("");
  const [keyword, setKeyword] = useState("");

  const loadMembers = useCallback(() => {
    dispatch(
      fetchMembers({
        page,
        keyword: null,
        keywordType: null,
      })
    );
  }, [dispatch, page, keywordType, keyword]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const drawMember = (members || [] ).map((p, idx)=> ({
    ...p,
    avatar: {
        name: p.name,
        src: `https://i.pravatar.cc/40?u=${p.id}`,
    }
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
        key: "name",
        placeholder: "이름을 검색하세요",
        value: keyword,
        onChange: (newValue) => {
          setPage(1);
          setKeyword(newValue);
        },
      }}
      loading={status === "loading"}
      error={error}
    />
  );
} 
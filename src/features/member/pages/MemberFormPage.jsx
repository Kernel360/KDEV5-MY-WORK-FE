// src/features/project/pages/MemberFormPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Stack, CircularProgress } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import MemberForm from "@/features/member/components/MemberForm";
import { createMember, updateMember, getMemberById } from "@/api/member";
import { fetchAllCompanyNames } from "@/features/company/companySlice";

const MemberFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: memberId } = useParams();
  const isEdit = Boolean(memberId);

  const { companyListOnlyIdName: companies = [], loading } = useSelector(
    (state) => state.company
  );

  const [form, setForm] = useState({
    name: "",
    department: "",
    position: "",
    role: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    companyId: "",
  });

  const [fetching, setFetching] = useState(false);

  // 회사 목록 로딩
  useEffect(() => {
    dispatch(fetchAllCompanyNames());
  }, [dispatch]);

  // 수정 모드일 때 기존 멤버 데이터 로딩
  useEffect(() => {
    if (!memberId) return;

    const fetchMember = async () => {
      setFetching(true);
      try {
        const res = await getMemberById(memberId);
        const member = res.data.data;
        setForm({
          name: member.name,
          department: member.department,
          position: member.position,
          role: member.role,
          phoneNumber: member.phoneNumber,
          email: member.email,
          birthDate: member.birthDate?.substring(0, 10) || "",
          companyId: member.companyId,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        birthDate: form.birthDate ? form.birthDate + "T00:00:00" : null,
        ...(isEdit && { id: memberId }),
      };

      if (isEdit) {
        await updateMember(payload);
      } else {
        await createMember(payload);
      }

      navigate("/members");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const headerAction = (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={handleCancel}>
        취소
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={
          loading ||
          fetching ||
          !form.name ||
          !form.email ||
          !form.position ||
          !form.department ||
          !form.role ||
          !form.companyId ||
          !form.phoneNumber ||
          !form.birthDate
        }
      >
        {loading || fetching ? (
          <CircularProgress size={24} />
        ) : isEdit ? (
          "수정"
        ) : (
          "등록"
        )}
      </Button>
    </Stack>
  );

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "멤버 수정" : "멤버 등록"}
        subtitle={
          isEdit
            ? "멤버 정보를 수정합니다."
            : "새로운 멤버를 등록하여 팀을 구성하세요."
        }
        action={headerAction}
      />
      <MemberForm
        form={form}
        handleChange={handleChange}
        companies={companies}
        loading={loading || fetching}
        isEdit={isEdit}
      />
    </PageWrapper>
  );
};

export default MemberFormPage;

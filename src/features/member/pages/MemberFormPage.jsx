// src/features/project/pages/MemberFormPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import MemberForm from "@/features/member/components/MemberForm";
import { createMember, updateMember, getMemberById } from "@/api/member";
import { fetchAllCompanyNames } from "@/features/company/companySlice";

const MemberFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: memberId } = useParams(); // ← id 파라미터 받아오기
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

  const [fetching, setFetching] = useState(false); // 수정 시 데이터 로딩용

  // 회사목록 불러오기
  useEffect(() => {
    dispatch(fetchAllCompanyNames());
  }, [dispatch]);

  // 수정인 경우 멤버 상세 조회
  useEffect(() => {
    if (memberId) {
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
            birthDate: member.birthday?.substring(0, 10) || "",
            companyId: member.companyId,
          });
        } catch (err) {
          console.error(err);
          // TODO: 에러 처리 (스낵바 등)
        } finally {
          setFetching(false);
        }
      };
      fetchMember();
    }
  }, [memberId]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        ...(isEdit
          ? {
              id: memberId,
              birthday: form.birthDate ? form.birthDate + "T00:00:00" : "",
            }
          : {
              birthDate: form.birthDate ? form.birthDate + "T00:00:00" : "",
            }),
      };

      if (isEdit) {
        delete payload.birthDate;
      }

      if (memberId) {
        await updateMember(payload);
      } else {
        await createMember(payload);
      }
      navigate("/members");
    } catch (err) {
      console.error(err);
      // TODO: 에러 처리 (스낵바 등)
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
        ) : memberId ? (
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
        title={memberId ? "멤버 수정" : "멤버 등록"}
        subtitle={
          memberId
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
      />
    </PageWrapper>
  );
};

export default MemberFormPage;

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
  const { id: memberId } = useParams();

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
    birthday: "",
    companyId: "",
  });

  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCompanyNames());
  }, [dispatch]);

  useEffect(() => {
    if (memberId) {
      const fetchMember = async () => {
        setFetching(true);
        try {
          const res = await getMemberById(memberId);
          console.log('멤버 상세 데이터:', res.data.data); // 데이터 확인용 로그
          const member = res.data.data;
          const newForm = {
            name: member.name,
            department: member.department,
            position: member.position,
            role: member.role,
            phoneNumber: member.phoneNumber,
            email: member.email,
            birthday: member.birthday?.substring(0, 10) || "",
            companyId: member.companyId,
          };
          console.log('설정할 폼 데이터:', newForm); // 폼 데이터 확인용 로그
          setForm(newForm);
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
      if (memberId) {
        await updateMember({
          id: memberId,
          companyId: form.companyId,
          name: form.name,
          department: form.department,
          position: form.position,
          role: form.role,
          phoneNumber: form.phoneNumber,
          email: form.email,
          password: "", // 비밀번호는 변경하지 않음
          deleted: false,
          birthday: form.birthday ? form.birthday + "T00:00:00" : null,
        });
      } else {
        const payload = {
          ...form,
          birthDate: form.birthday ? form.birthday + "T00:00:00" : null,
        };
        delete payload.birthday;
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
          !form.birthday
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

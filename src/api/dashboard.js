// src/api/dashboard.js

import api from "./api";

/**
 * 대시보드 요약 정보 조회 (전체, 진행중, 완료 등)
 */
export const getDashboardTotalSummary = () => {
  return api.get("/api/dashboard/total-summary");
};

/**
 * 마감 임박 프로젝트 조회 (페이지 기반)
 * @param {number} page - 1부터 시작하는 페이지 번호
 */
export function getNearDeadlineProjects(params) {
  return api.get("/api/dashboard/projects/near-deadline", {
    params,
  });
}

/**
 * 인기많은 프로젝트 TOP5 조회
 * GET /api/dashboard/popular-projects
 * 반환: { projects: [{ projectId, projectName }] }
 */
export function getPopularProjects() {
  return api.get("/api/dashboard/popular-projects");
}

/**
 * 프로젝트 금액 차트 데이터 조회
 * @param {string} chartType - 'CHART_TYPE_WEEK' 또는 'CHART_TYPE_MONTH'
 * 반환: { chartData: [{ label: string, totalAmount: number }] }
 */
export function getProjectAmountChart(chartType) {
  return api.get("/api/dashboard/project-amount", {
    params: { chartType },
  });
}

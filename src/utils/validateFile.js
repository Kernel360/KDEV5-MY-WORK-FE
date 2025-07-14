// utils/validateFile.js
import { formatFileSize } from "./formatFileSize";

const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".pif",
  ".scr",
  ".vbs",
  ".js",
  ".jar",
  ".app",
  ".deb",
  ".pkg",
  ".rpm",
  ".dmg",
  ".msi",
  ".run",
  ".sh",
];

export const isValidFileType = (file) => {
  const fileName = file.name.toLowerCase();
  return !DANGEROUS_EXTENSIONS.some((ext) => fileName.endsWith(ext));
};

export const validateFile = (file, maxSizeMB = 5) => {
  const errors = [];
  const maxSize = maxSizeMB * 1024 * 1024;

  if (file.size > maxSize) {
    errors.push(
      `파일 크기가 ${maxSizeMB}MB를 초과합니다. (${formatFileSize(file.size)})`
    );
  }

  if (!isValidFileType(file)) {
    errors.push(
      "보안상 위험한 파일 형식입니다. (실행 파일, 스크립트 등은 업로드할 수 없습니다)"
    );
  }

  return errors;
};

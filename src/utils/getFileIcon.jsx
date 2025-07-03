import React from "react";
import {
  Image as ImageIcon,
  PictureAsPdf,
  Description,
  TableChart,
  Archive,
  Code,
  Movie,
  MusicNote,
  InsertDriveFile as DefaultFileIcon,
} from "@mui/icons-material";

export function getFileIcon(fileName, fileType) {
  const ext = fileName?.toLowerCase().split(".").pop();

  if (fileType?.startsWith("image/")) return <ImageIcon color="primary" />;

  if (["pdf"].includes(ext)) return <PictureAsPdf color="error" />;
  if (["doc", "docx", "txt", "rtf"].includes(ext))
    return <Description color="primary" />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <TableChart color="success" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <Archive color="warning" />;
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(ext))
    return <Code color="info" />;
  if (["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(ext))
    return <Movie color="secondary" />;
  if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext))
    return <MusicNote color="secondary" />;

  return <DefaultFileIcon color="action" />;
}

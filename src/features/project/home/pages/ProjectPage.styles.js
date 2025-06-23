import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

export const ProjectPageWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  height: "100%",
  borderRadius: 10,
}));

export const HeaderSection = styled(Stack)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

export const StatusChip = styled(Chip)(({ theme }) => ({
  fontSize: "0.75rem",
  height: 24,
  "&.MuiChip-colorSuccess": {
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
  "&.MuiChip-colorError": {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
  },
}));

export const ToolbarSection = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const TablePaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 16,
  padding: theme.spacing(2),
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  background: "inherit",
}));

export const StyledTableRow = styled(TableRow)({
  "&:hover": {
    background: "#2a2a2a",
  },
});

export const OutlinedButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
  background: theme.palette.background.paper,
  "&:hover": {
    background: "#2a2a2a",
    borderColor: theme.palette.primary.main,
  },
}));

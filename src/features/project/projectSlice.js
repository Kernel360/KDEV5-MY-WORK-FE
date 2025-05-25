import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as projectAPI from "@/api/project";

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, thunkAPI) => {
    try {
      const response = await projectAPI.getProjects();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await projectAPI.getProjectById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (data, thunkAPI) => {
    try {
      const response = await projectAPI.createProject(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await projectAPI.updateProject(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id, thunkAPI) => {
    try {
      await projectAPI.deleteProject(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    data: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;

import { ApiError } from '../types/api';
import { AuthResponse, LoginData, RegisterData, User } from './auth';
// API Client - Student Exercise
//
// API base: http://localhost:4000
//
// The API is intercepted by MSW during development.
//
// Your task:
// Complete the TODOs below using TypeScript and fetch().

const BASE_URL = 'http://localhost:4000';
const TOKEN_KEY = 'tf_token';
const USER_KEY = 'tf_user'

// ─────────────────────────────────────────────────────────────────────────────
// TODO 1: Create application types
// ─────────────────────────────────────────────────────────────────────────────
//
// Create proper TypeScript interfaces/types for:
//
// User
// - id
// - name
// - email
//
// AuthResponse
// - token
// - user
//
// RegisterData
// - name
// - email
// - password
//
// LoginData
// - email
// - password
//
// Project
// - id
// - name
// - description
//
// CreateProjectData
//
// UpdateProjectData
//
// Task
// - id
// - projectId
// - title
// - description
// - status
// - priority
// - assignee
// - dueDate
//
// CreateTaskData
//
// UpdateTaskData
//
// TaskFilters
// - status
// - priority
// - assignee
// - search
//
// IMPORTANT:
// After creating these types, replace the temporary "unknown" types below
// with your proper TypeScript types.


// ─────────────────────────────────────────────────────────────────────────────
// TODO 2: Authentication token
// ─────────────────────────────────────────────────────────────────────────────

const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);;
};


// ─────────────────────────────────────────────────────────────────────────────
// TODO 3: HTTP request helper
// ─────────────────────────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
  auth = true,
): Promise<T> => {
  // TODO:
  // 1. Create the HTTP headers.
  //
  const headers:Record<string,string>={'Content-Type': 'application/json'};


  // TODO:
  // 2. If auth === true:
  // - Get the token using getToken()
  // - Throw an Error if the token doesn't exist
  // - Add the Authorization header
  //
  // Expected format:
  // Bearer <token>

  if(auth){
    const token = getToken();
    if(!token) throw new Error ('Not authenticated');
    headers.Authorization = `Bearer ${token}`;
  }


  // TODO:
  // 3. Send the request using fetch().
  //
  // Use:
  // - BASE_URL
  // - path
  // - method
  // - headers
  // - body

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });


  // TODO:
  // 4. Handle status 204 No Content.

  if(response.status === 204) {
    return undefined as T;
  }

  // TODO:
  // 5. Parse the JSON response.

  const data = await response.json().catch(() => null);

  // TODO:
  // 6. Handle unsuccessful HTTP responses.
  //
  // Example API validation error:
  //
  // {
  //   error: "validation failed",
  //   fields: {
  //     email: "already taken"
  //   }
  // }

  if(!response.ok) {
    const errorMessage = data?.error || 'Request failed';
    const fieldErrors = data?.fields;
    throw new ApiError(errorMessage, response.status, fieldErrors);
  }


  // TODO:
  // 7. Return the successful response.

  return data;
};


// ─────────────────────────────────────────────────────────────────────────────
// TODO 4: HTTP helpers
// ─────────────────────────────────────────────────────────────────────────────

// TODO:
// Create reusable helper functions for:
//
// get<T>()
// post<T>()
// patch<T>()
// del<T>()

export const get = <T>(path: string, auth = true): Promise<T> => {
  return request<T>('GET', path, undefined, auth);
};

export const post = <T>(path: string, body?: unknown, auth = true): Promise<T> => {
  return request<T>('POST', path, body, auth);
};

export const patch = <T>(path: string, body?: unknown, auth = true): Promise<T> => {
  return request<T>('PATCH', path, body, auth);
};

export const del = <T>(path: string, auth = true): Promise<T> => {
  return request<T>('DELETE', path, undefined, auth);
};


// ─────────────────────────────────────────────────────────────────────────────
// TODO 5: Authentication
// ─────────────────────────────────────────────────────────────────────────────

export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  // TODO:
  // Replace "unknown" with your RegisterData and AuthResponse types.
  //
  // POST /auth/register
  //
  // Authentication is NOT required.
  //
  // After successful registration:
  // - Save the token
  // - Save the user
  // - Return the response

  const response = await post<AuthResponse>('/auth/register', data, false);
  saveSession(response);
  return response;
};


export const loginUser = async (
  data: LoginData,
): Promise<AuthResponse> => {
  // TODO:
  // Replace "unknown" with the correct TypeScript types.
  //
  // POST /auth/login
  //
  // Authentication is NOT required.
  //
  // After success:
  // - Save token
  // - Save user
  // - Return response

  const response = await post<AuthResponse>('/auth/login', data, false);
  saveSession(response);
  return response;

  
};


export const getMe = (): User | null => {
  // TODO:
  // Replace "unknown" with the proper return type.
  //
  // Read "tf_user" from localStorage.
  // Parse the JSON safely.
  //
  // Return null when:
  // - no user exists
  // - stored JSON is invalid

  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    const user = JSON.parse(userJson);
    return user;
  } catch {
    return null;
  }           
  return null;
};


export const isAuthenticated = (): boolean => {
  // TODO:
  // The user is authenticated only when
  // both token and user exist.
  Boolean(getToken() && getMe());

  return false;
};


export const logout = (): void => {
  // TODO:
  // Remove:
  // - tf_token
  // - tf_user
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};


// TODO:
// Create a private saveSession() helper.
//
// It should save:
// - token as "tf_token"
// - user as "tf_user"

const saveSession = ({ token, user }: AuthResponse): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};


// ─────────────────────────────────────────────────────────────────────────────
// TODO 6: Projects API
// ─────────────────────────────────────────────────────────────────────────────

export const fetchProjects = async (): Promise<unknown[]> => {
  // TODO:
  // Replace "unknown[]" with the proper type.
  //
  // GET /projects
  //
  // Expected response:
  //
  // {
  //   projects: [...]
  // }
  //
  // Return ONLY the projects array.

  throw new Error('TODO: Implement fetchProjects()');
};


export const createProject = async (
  data: unknown,
): Promise<unknown> => {
  // TODO:
  // Add correct TypeScript types.
  //
  // POST /projects

  throw new Error('TODO: Implement createProject()');
};


export const fetchProject = async (
  id: string,
): Promise<unknown> => {
  // TODO:
  // GET /projects/:id

  throw new Error('TODO: Implement fetchProject()');
};


export const updateProject = async (
  id: string,
  data: unknown,
): Promise<unknown> => {
  // TODO:
  // PATCH /projects/:id

  throw new Error('TODO: Implement updateProject()');
};


export const deleteProject = async (
  id: string,
): Promise<void> => {
  // TODO:
  // DELETE /projects/:id

  throw new Error('TODO: Implement deleteProject()');
};


// ─────────────────────────────────────────────────────────────────────────────
// TODO 7: Tasks API
// ─────────────────────────────────────────────────────────────────────────────

export const fetchTasks = async (
  projectId: string,
  filters: Record<string, string> = {},
): Promise<unknown[]> => {
  // TODO:
  // Replace temporary types with your Task and TaskFilters types.
  //
  // GET /projects/:projectId/tasks
  //
  // Build the query string using URLSearchParams.
  //
  // Example:
  //
  // /projects/proj-001/tasks?status=todo&priority=high
  //
  // Do NOT add undefined filter values.

  throw new Error('TODO: Implement fetchTasks()');
};


export const createTask = async (
  projectId: string,
  data: unknown,
): Promise<unknown> => {
  // TODO:
  // POST /projects/:projectId/tasks
  //
  // Replace the temporary types.

  throw new Error('TODO: Implement createTask()');
};


export const updateTask = async (
  taskId: string,
  data: unknown,
): Promise<unknown> => {
  // TODO:
  // PATCH /tasks/:taskId
  //
  // Replace the temporary types.

  throw new Error('TODO: Implement updateTask()');
};


export const deleteTask = async (
  taskId: string,
): Promise<void> => {
  // TODO:
  // DELETE /tasks/:taskId

  throw new Error('TODO: Implement deleteTask()');
};
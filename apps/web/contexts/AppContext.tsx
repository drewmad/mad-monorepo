'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface User {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
}

interface Workspace {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
}

interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'on_hold';
    progress: number;
    workspace_id: string;
    created_at: string;
    updated_at: string;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    project_id: string;
    assignee_id?: string;
    due_date?: string;
    created_at: string;
    updated_at: string;
}

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    workspace_id: string;
    recorded: boolean;
    attendees: string[];
}

interface Message {
    id: string;
    channel_id: string;
    user_id: string;
    text: string;
    timestamp: string;
    parent_id?: string;
}

interface Modal {
    type: string;
    isOpen: boolean;
    props?: Record<string, unknown>;
}

// State interface
interface AppState {
    user: User | null;
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    projects: Project[];
    tasks: Task[];
    events: Event[];
    messages: Message[];
    theme: 'light' | 'dark';
    modal: Modal | null;
    loading: boolean;
    error: string | null;
}

// Action types
type AppAction =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_WORKSPACES'; payload: Workspace[] }
    | { type: 'SET_CURRENT_WORKSPACE'; payload: Workspace | null }
    | { type: 'SET_PROJECTS'; payload: Project[] }
    | { type: 'ADD_PROJECT'; payload: Project }
    | { type: 'UPDATE_PROJECT'; payload: Project }
    | { type: 'DELETE_PROJECT'; payload: string }
    | { type: 'SET_TASKS'; payload: Task[] }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'SET_EVENTS'; payload: Event[] }
    | { type: 'ADD_EVENT'; payload: Event }
    | { type: 'UPDATE_EVENT'; payload: Event }
    | { type: 'DELETE_EVENT'; payload: string }
    | { type: 'SET_MESSAGES'; payload: Message[] }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'SET_THEME'; payload: 'light' | 'dark' }
    | { type: 'OPEN_MODAL'; payload: Modal }
    | { type: 'CLOSE_MODAL' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AppState = {
    user: null,
    workspaces: [],
    currentWorkspace: null,
    projects: [],
    tasks: [],
    events: [],
    messages: [],
    theme: 'light',
    modal: null,
    loading: false,
    error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };

        case 'SET_WORKSPACES':
            return { ...state, workspaces: action.payload };

        case 'SET_CURRENT_WORKSPACE':
            return { ...state, currentWorkspace: action.payload };

        case 'SET_PROJECTS':
            return { ...state, projects: action.payload };

        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload] };

        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(p =>
                    p.id === action.payload.id ? action.payload : p
                ),
            };

        case 'DELETE_PROJECT':
            return {
                ...state,
                projects: state.projects.filter(p => p.id !== action.payload),
            };

        case 'SET_TASKS':
            return { ...state, tasks: action.payload };

        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };

        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(t =>
                    t.id === action.payload.id ? action.payload : t
                ),
            };

        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter(t => t.id !== action.payload),
            };

        case 'SET_EVENTS':
            return { ...state, events: action.payload };

        case 'ADD_EVENT':
            return { ...state, events: [...state.events, action.payload] };

        case 'UPDATE_EVENT':
            return {
                ...state,
                events: state.events.map(e =>
                    e.id === action.payload.id ? action.payload : e
                ),
            };

        case 'DELETE_EVENT':
            return {
                ...state,
                events: state.events.filter(e => e.id !== action.payload),
            };

        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };

        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };

        case 'SET_THEME':
            return { ...state, theme: action.payload };

        case 'OPEN_MODAL':
            return { ...state, modal: action.payload };

        case 'CLOSE_MODAL':
            return { ...state, modal: null };

        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

// Context
const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

// Hook to use the context
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

// Convenience hooks for specific parts of state
export function useUser() {
    const { state } = useApp();
    return state.user;
}

export function useWorkspaces() {
    const { state } = useApp();
    return {
        workspaces: state.workspaces,
        currentWorkspace: state.currentWorkspace,
    };
}

export function useProjects() {
    const { state } = useApp();
    return state.projects;
}

export function useTasks() {
    const { state } = useApp();
    return state.tasks;
}

export function useEvents() {
    const { state } = useApp();
    return state.events;
}

export function useMessages() {
    const { state } = useApp();
    return state.messages;
}

export function useTheme() {
    const { state, dispatch } = useApp();
    return {
        theme: state.theme,
        setTheme: (theme: 'light' | 'dark') => dispatch({ type: 'SET_THEME', payload: theme }),
    };
}

export function useModal() {
    const { state, dispatch } = useApp();
    return {
        modal: state.modal,
        openModal: (type: string, props?: Record<string, unknown>) =>
            dispatch({ type: 'OPEN_MODAL', payload: { type, isOpen: true, props } }),
        closeModal: () => dispatch({ type: 'CLOSE_MODAL' }),
    };
} 
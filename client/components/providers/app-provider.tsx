"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  MOCK_WORKSPACES,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_SOURCES,
  type Workspace,
  type Conversation,
  type Message,
  type Source,
} from "@/lib/mock-data";

interface AppState {
  workspaces: Workspace[];
  conversations: Record<string, Conversation[]>;
  messages: Record<string, Message[]>;
  sources: Record<string, Source[]>;
  activeWorkspaceId: string | null;
  activeConversationId: string | null;

  // Actions
  createWorkspace: (data: {
    title: string;
    description?: string;
    icon: string;
    defaultModel: string;
  }) => Workspace;
  updateWorkspace: (id: string, data: Partial<Workspace>) => void;
  deleteWorkspace: (id: string) => void;
  setActiveWorkspace: (id: string | null) => void;

  createConversation: (workspaceId: string, title?: string) => Conversation;
  deleteConversation: (workspaceId: string, conversationId: string) => void;
  setActiveConversation: (id: string | null) => void;

  addMessage: (conversationId: string, message: Message) => void;

  addSource: (workspaceId: string, source: Source) => void;
  deleteSource: (workspaceId: string, sourceId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(MOCK_WORKSPACES);
  const [conversations, setConversations] =
    useState<Record<string, Conversation[]>>(MOCK_CONVERSATIONS);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [sources, setSources] =
    useState<Record<string, Source[]>>(MOCK_SOURCES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const createWorkspace = useCallback(
    (data: { title: string; description?: string; icon: string; defaultModel: string }) => {
      const newWorkspace: Workspace = {
        id: `ws-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        sourceCount: 0,
        conversationCount: 0,
      };
      setWorkspaces((prev) => [newWorkspace, ...prev]);
      setConversations((prev) => ({ ...prev, [newWorkspace.id]: [] }));
      setSources((prev) => ({ ...prev, [newWorkspace.id]: [] }));
      return newWorkspace;
    },
    []
  );

  const updateWorkspace = useCallback((id: string, data: Partial<Workspace>) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id ? { ...ws, ...data } : ws))
    );
  }, []);

  const deleteWorkspace = useCallback((id: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
    setConversations((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSources((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const setActiveWorkspace = useCallback((id: string | null) => {
    setActiveWorkspaceId(id);
    setActiveConversationId(null);
  }, []);

  const createConversation = useCallback(
    (workspaceId: string, title?: string) => {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        workspaceId,
        title: title || "New conversation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations((prev) => ({
        ...prev,
        [workspaceId]: [newConv, ...(prev[workspaceId] ?? [])],
      }));
      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws.id === workspaceId
            ? { ...ws, conversationCount: ws.conversationCount + 1 }
            : ws
        )
      );
      setMessages((prev) => ({ ...prev, [newConv.id]: [] }));
      return newConv;
    },
    []
  );

  const deleteConversation = useCallback(
    (workspaceId: string, conversationId: string) => {
      setConversations((prev) => ({
        ...prev,
        [workspaceId]: (prev[workspaceId] ?? []).filter(
          (c) => c.id !== conversationId
        ),
      }));
      setMessages((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    },
    []
  );

  const setActiveConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
  }, []);

  const addMessage = useCallback((conversationId: string, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] ?? []), message],
    }));
    // Update conversation updatedAt
    setConversations((prev) => {
      const next = { ...prev };
      for (const wsId in next) {
        next[wsId] = next[wsId].map((c) =>
          c.id === conversationId
            ? { ...c, updatedAt: new Date().toISOString() }
            : c
        );
      }
      return next;
    });
  }, []);

  const addSource = useCallback((workspaceId: string, source: Source) => {
    setSources((prev) => ({
      ...prev,
      [workspaceId]: [source, ...(prev[workspaceId] ?? [])],
    }));
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? { ...ws, sourceCount: ws.sourceCount + 1 }
          : ws
      )
    );
  }, []);

  const deleteSource = useCallback((workspaceId: string, sourceId: string) => {
    setSources((prev) => ({
      ...prev,
      [workspaceId]: (prev[workspaceId] ?? []).filter((s) => s.id !== sourceId),
    }));
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? { ...ws, sourceCount: Math.max(0, ws.sourceCount - 1) }
          : ws
      )
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        workspaces,
        conversations,
        messages,
        sources,
        activeWorkspaceId,
        activeConversationId,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        setActiveWorkspace,
        createConversation,
        deleteConversation,
        setActiveConversation,
        addMessage,
        addSource,
        deleteSource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}

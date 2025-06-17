'use client';
import React, { createContext, useState, useContext } from 'react';

interface SidebarCtx {
  expanded: boolean;
  setExpanded(v: boolean): void;
}

const Ctx = createContext<SidebarCtx | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(false);
  return <Ctx.Provider value={{ expanded, setExpanded }}>{children}</Ctx.Provider>;
};

export const useSidebar = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
  return ctx;
}; 
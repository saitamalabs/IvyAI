"use client"

import * as React from "react"
import {
  IconDashboard,
  IconHelp,
  IconSettings,
  IconSearch,
  IconCreditCard,
} from "@tabler/icons-react"
import { 
  Code2, 
  GitPullRequest, 
  Bot, 
  FileCode, 
  Sparkles, 
  Rocket,
  TestTube2,
  Shield,
  Zap,
} from 'lucide-react'
import Image from 'next/image'

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from '@/contexts/AuthContext'

const agentCategories = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      isHome: true,
    },
    {
      title: "Features",
      url: "/#features",
      icon: IconSettings,
      isExternal: true,
    },
    {
      title: "Pricing",
      url: "/#pricing",
      icon: IconCreditCard,
      isExternal: true,
    },
  ],
  generation: [
    {
      name: "AI Project Generator",
      url: "/agent/project-generator",
      icon: Rocket,
    },
    {
      name: "Code Generator",
      url: "/agent/code-generator",
      icon: Code2,
    },
  ],
  codeReview: [
    {
      name: "PR Reviewer",
      url: "/agent/pr-reviewer",
      icon: GitPullRequest,
    },
    {
      name: "Security Scanner",
      url: "/agent/security-scanner",
      icon: Shield,
    },
  ],
  repository: [
    {
      name: "GitHub Repo Agent",
      url: "/agent/repo-agent",
      icon: Bot,
    },
  ],
  optimization: [
    {
      name: "Code Refactor",
      url: "/agent/code-refactor",
      icon: Sparkles,
    },
    {
      name: "Performance Optimizer",
      url: "/agent/performance-optimizer",
      icon: Zap,
    },
  ],
  testing: [
    {
      name: "Test Generator",
      url: "/agent/test-generator",
      icon: TestTube2,
    },
  ],
  documentation: [
    {
      name: "Documentation Generator",
      url: "/agent/doc-generator",
      icon: FileCode,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "https://github.com",
      icon: IconHelp,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onAgentSelect?: (agentId: string) => void;
  onDashboardClick?: () => void;
}

export function AppSidebar({ onAgentSelect, onDashboardClick, ...props }: AppSidebarProps) {
  const { user } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onDashboardClick}
              className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer"
            >
              <Image 
                src="/logo.png" 
                alt="IvyAI Logo" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
              <span className="text-base font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">IvyAI</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={agentCategories.navMain} onDashboardClick={onDashboardClick} />
        
        {/* Generation Agents */}
        <NavDocuments 
          title="Generation" 
          items={agentCategories.generation}
          onItemClick={onAgentSelect}
        />
        
        {/* Code Review Agents */}
        <NavDocuments 
          title="Code Review" 
          items={agentCategories.codeReview}
          onItemClick={onAgentSelect}
        />
        
        {/* Repository Agents */}
        <NavDocuments 
          title="Repository" 
          items={agentCategories.repository}
          onItemClick={onAgentSelect}
        />
        
        {/* Optimization Agents */}
        <NavDocuments 
          title="Optimization" 
          items={agentCategories.optimization}
          onItemClick={onAgentSelect}
        />
        
        {/* Testing Agents */}
        <NavDocuments 
          title="Testing" 
          items={agentCategories.testing}
          onItemClick={onAgentSelect}
        />
        
        {/* Documentation Agents */}
        <NavDocuments 
          title="Documentation" 
          items={agentCategories.documentation}
          onItemClick={onAgentSelect}
        />
        
        <NavSecondary items={agentCategories.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name || user?.login || "User",
          email: user?.email || "",
          avatar: user?.avatar_url || "/avatars/default.jpg",
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}

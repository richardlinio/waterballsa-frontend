'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/header'
import { DynamicSidebar } from '@/components/layout/dynamic-sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DynamicSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

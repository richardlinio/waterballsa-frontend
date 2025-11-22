'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/header'
import { AppSidebar } from '@/components/layout/sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

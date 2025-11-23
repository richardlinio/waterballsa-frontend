'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/header'
import { DynamicSidebar } from '@/components/layout/sidebar/dynamic-sidebar'
import { JourneyProvider } from '@/contexts/journey-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <JourneyProvider>
      <SidebarProvider>
        <DynamicSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </JourneyProvider>
  )
}

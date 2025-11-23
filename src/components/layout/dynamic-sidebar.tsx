'use client'

import { usePathname } from 'next/navigation'
import { AppSidebar } from './sidebar'
import { JourneySidebar } from './journey-sidebar'

/**
 * DynamicSidebar - Renders different sidebars based on current route
 *
 * - Mission pages (/journeys/{slug}/chapters/{chapterId}/missions/{missionId}) -> JourneySidebar
 * - All other pages -> AppSidebar
 */
export function DynamicSidebar() {
  const pathname = usePathname()

  // Check if current path is a mission page
  const isMissionPage =
    /\/journeys\/[^/]+\/chapters\/[^/]+\/missions\/[^/]+/.test(pathname)

  if (isMissionPage) {
    return <JourneySidebar />
  }

  return <AppSidebar />
}

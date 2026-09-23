import { ChevronsUpDown, UserCircle2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useRoleStore, type Role } from '@/stores/role-store'

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { currentRole, setRole } = useRoleStore()
  
  const roles: Role[] = ['Guest', 'Staff', 'Team Head', 'Manager']

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <UserCircle2 className='size-4' />
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  Smart Resort 360
                </span>
                <span className='truncate text-xs'>View as: {currentRole}</span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Select Role View
            </DropdownMenuLabel>
            {roles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => setRole(role)}
                className='gap-2 p-2 cursor-pointer'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <UserCircle2 className='size-4 shrink-0' />
                </div>
                {role}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

import { NavLink } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat', label: 'Chat IA', icon: MessageCircle },
];

export function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border/40 bg-sidebar">
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Indicador de role no rodapé */}
      <div className="border-t border-border/40 p-4">
        <div className="rounded-lg bg-muted/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Perfil</p>
          <p className="text-sm font-medium">{isAdmin ? 'Administrador' : 'Usuário'}</p>
        </div>
      </div>
    </aside>
  );
}

import { ComponentChildren } from 'preact';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ComponentChildren;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <TopNav />
      <main class="flex-1 pt-16 pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
} 
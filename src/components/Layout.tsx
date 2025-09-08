import { TopNavigation } from "./TopNavigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <main className="py-8">
        <div className="container mx-auto px-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
import Navbar from '@/Components/navbar/Navbar';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-[72px]">
        {children}
      </main>
    </>
  );
}

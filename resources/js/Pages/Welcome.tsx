import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
   
    return (
        <>
            <Head title="Welcome" />
           <div className='text-3xl justify-center items-center flex h-screen'>
               Selamat datang di home!
           </div>
        </>
    );
}

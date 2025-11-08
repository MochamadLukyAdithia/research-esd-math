import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

interface NewsItem {
    id_news: number;
    title: string;
    image: string;
    description: string;
    created_at: string;
}

export default function Show() {
    const page = usePage().props as any;
    const news: NewsItem = page.news;
    const related: NewsItem[] = page.relatedNews || [];

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <UserLayout>
            <Head title={news.title} />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <article className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-80 w-full overflow-hidden">
                            <img src={`/storage/${news.image}`} alt={news.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-8">
                            <div className="text-sm text-gray-500 mb-2">{formatDate(news.created_at)}</div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-secondary mb-4">{news.title}</h1>
                            <div className="prose prose-slate max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: news.description }} />
                        </div>
                    </article>

                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-secondary mb-4">Berita Terkait</h3>
                            <ul className="space-y-4">
                                {related.length === 0 && <li className="text-gray-500">Tidak ada berita terkait.</li>}
                                {related.map((r) => (
                                    <li key={r.id_news} className="flex items-start gap-3">
                                        <img src={`/storage/${r.image}`} alt={r.title} className="w-16 h-12 object-cover rounded" />
                                        <div>
                                            <Link href={`/news/${r.id_news}`} className="text-sm font-semibold text-secondary hover:text-primary">
                                                {r.title}
                                            </Link>
                                            <div className="text-xs text-gray-500">{formatDate(r.created_at)}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </UserLayout>
    );
}

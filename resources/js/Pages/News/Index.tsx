import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import NewsCard from '@/Components/news/NewsCard';

interface News {
    id_news: number;
    title: string;
    image: string;
    description: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface NewsIndexProps {
    news: {
        data: News[];
        current_page: number;
        last_page: number;
        links: PaginationLink[];
    };
}

export default function Index({ news }: NewsIndexProps) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <UserLayout>
            <Head title="Berita" />
            <div className="bg-gradient-to-r from-secondary to-secondary-light text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Berita Terkini
                    </h1>
                    <p className="text-xl text-gray-200">
                        Informasi dan update terbaru seputar kegiatan kami
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {news.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {news.data.map((item) => (
                                <NewsCard
                                    key={item.id_news}
                                    id={item.id_news}
                                    title={item.title}
                                    image={item.image}
                                    description={item.description}
                                    createdAt={item.created_at}
                                />
                            ))}
                        </div>

                        {news.last_page > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                {news.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(link.url)}
                                        disabled={!link.url}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            link.active
                                                ? 'bg-primary text-white'
                                                : link.url
                                                ? 'bg-white text-secondary hover:bg-primary hover:text-white border border-gray-300 hover:border-primary'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <svg
                            className="w-24 h-24 mx-auto text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Belum Ada Berita
                        </h3>
                        <p className="text-gray-500">
                            Belum ada berita yang dipublikasikan saat ini
                        </p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
}

import React from 'react';
import { Link } from '@inertiajs/react';

interface NewsCardProps {
    id: number;
    title: string;
    image: string;
    description: string;
    createdAt: string;
}

export default function NewsCard({ id, title, image, description, createdAt }: NewsCardProps) {
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={`/storage/${image}`}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
            </div>
            <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                    {formatDate(createdAt)}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3 line-clamp-2">
                    {title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateText(description, 150)}
                </p>
                <Link
                    href={`/news/${id}`}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary-light transition-colors"
                >
                    Baca Selengkapnya
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

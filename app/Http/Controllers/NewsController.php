<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::orderBy('created_at', 'desc')->paginate(9);

        return Inertia::render('News/Index', [
            'news' => $news
        ]);
    }
    public function create()
    {
        return Inertia::render('News/Create');
    }

    public function show($id)
    {
        $news = News::findOrFail($id);
        $relatedNews = News::where('id_news', '!=', $id)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('News/Show', [
            'news' => $news,
            'relatedNews' => $relatedNews
        ]);
    }
}

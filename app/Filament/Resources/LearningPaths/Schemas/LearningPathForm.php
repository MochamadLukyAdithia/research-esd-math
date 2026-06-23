<?php

namespace App\Filament\Resources\LearningPaths\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LearningPathForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Dasar')
                    ->description('Detail utama learning path')
                    ->icon('heroicon-o-information-circle')
                    ->schema([
                        TextInput::make('title')
                            ->label('Judul Learning Path')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: Persamaan Linear Satu Variabel')
                            ->columnSpanFull(),

                        Textarea::make('description')
                            ->label('Deskripsi')
                            ->required()
                            ->rows(3)
                            ->placeholder('Jelaskan tujuan dan isi learning path ini...')
                            ->columnSpanFull(),

                        Grid::make(3)->schema([
                            Select::make('grade')
                                ->label('Tingkat Kelas')
                                ->required()
                                ->options([
                                    7  => 'Kelas 7 (SMP)',
                                    8  => 'Kelas 8 (SMP)',
                                    9  => 'Kelas 9 (SMP)',
                                    10 => 'Kelas 10 (SMA)',
                                    11 => 'Kelas 11 (SMA)',
                                    12 => 'Kelas 12 (SMA)',
                                    13 => 'Mahasiswa',
                                    
                                ])
                                ->native(false),

                            TextInput::make('category')
                                ->label('Kategori / Topik')
                                ->required()
                                ->placeholder('Contoh: Aljabar, Geometri')
                                ->datalist([
                                    'Aljabar',
                                    'Geometri',
                                    'Statistika',
                                    'Trigonometri',
                                    'Bilangan',
                                    'Kalkulus',
                                ]),

                            TextInput::make('estimated_minutes')
                                ->label('Estimasi Waktu (menit)')
                                ->required()
                                ->numeric()
                                ->minValue(1)
                                ->suffix('menit')
                                ->placeholder('60'),
                        ]),
                    ])
                    ->columns(1),


                Section::make('Thumbnail & Status')
                    ->icon('heroicon-o-photo')
                    ->schema([
                        FileUpload::make('thumbnail')
                            ->label('Thumbnail')
                            ->image()
                            ->disk('public')
                            ->directory('learning-paths')
                            ->imagePreviewHeight('180')
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp'])
                            ->helperText('Format: PNG, JPG, WEBP. Rasio 16:9 disarankan.')
                            ->columnSpanFull(),
                        Toggle::make('is_published')
                            ->label('Publikasikan Learning Path')
                            ->helperText('Aktifkan agar learning path bisa diakses siswa.')
                            ->default(false)
                            ->onColor('success')
                            ->offColor('gray'),
                    ]),
                Section::make('Silabus')
    ->description('Informasi kurikulum yang ditampilkan di halaman program')
    ->icon('heroicon-o-academic-cap')
    ->schema([
    
        Textarea::make('kompetensi_dasar')
            ->label('Tujuan Pembelajaran')
            ->rows(3)
            ->placeholder('Contoh: 3.6 Menjelaskan persamaan dan pertidaksamaan linear satu variabel...')
            ->columnSpanFull(),

        TagsInput::make('metode_penilaian')
            ->label('Metode Penilaian')
            ->placeholder('Tambah metode, tekan Enter')
            ->suggestions(['Pre-Test', 'Post-Test', 'Portofolio', 'Observasi', 'Refleksi'])
            ->columnSpanFull(),

        TagsInput::make('sumber_belajar')
            ->label('Sumber Belajar')
            ->placeholder('Tambah sumber, tekan Enter')
            ->suggestions([
                'Buku Paket Matematika Kelas 7',
                'Khan Academy',
                'Modul Ajar Kemendikbud',
            ])
            ->columnSpanFull(),
    ])
    ->collapsible(),
            ]);
    }
}
<?php
// ─────────────────────────────────────────────────────────────────────────────
// File: app/Filament/Resources/Badges/Schemas/BadgeForm.php
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Filament\Resources\Badges\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class BadgeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Detail Badge')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nama Badge')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('Contoh: Bintang Matematika'),

                        Textarea::make('description')
                            ->label('Deskripsi')
                            ->required()
                            ->rows(2)
                            ->placeholder('Deskripsi singkat badge ini...'),

                        FileUpload::make('image_path')
                            ->label('Gambar Badge')
                            ->image()
                            ->directory('badges')
                            ->imagePreviewHeight('100')
                            ->acceptedFileTypes(['image/png', 'image/svg+xml', 'image/webp'])
                            ->helperText('Disarankan format PNG transparan, ukuran 256x256px.'),
                    ]),

                Section::make('Kriteria Pemberian Badge')
                    ->description('Tentukan kondisi apa yang harus dipenuhi siswa untuk mendapat badge ini.')
                    ->schema([
                        Grid::make(2)->schema([
                            Select::make('criteria_type')
                                ->label('Tipe Kriteria')
                                ->required()
                                ->native(false)
                                ->options([
                                    'complete_path' => 'Selesaikan N Learning Path',
                                    'score_above'   => 'Post-Test Score ≥ N',
                                    'perfect_score' => 'Post-Test Score = 100',
                                ])
                                ->helperText('Pilih kondisi yang harus terpenuhi.'),

                            TextInput::make('criteria_value')
                                ->label('Nilai Ambang Batas (N)')
                                ->numeric()
                                ->minValue(0)
                                ->default(1)
                                ->helperText('Contoh: 3 untuk "selesaikan 3 path", 80 untuk "skor ≥ 80".'),
                        ]),
                    ]),
            ]);
    }
}
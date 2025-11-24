<?php

namespace App\Filament\Resources\Questions\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Repeater;
use App\Filament\Forms\Components\MapboxPicker;

use Filament\Forms\Components\FileUpload;
use App\Models\QuestionType;
use Dom\Text;

class QuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Judul Soal')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('question')
                    ->label('Pertanyaan')
                    ->required()
                    ->columnSpanFull()
                    ->rows(12),
                MapboxPicker::make('location')
                    ->label('Pilih Lokasi di Peta')
                    ->defaultLocation(-8.1733, 113.7031)
                    ->defaultZoom(15)
                    ->columnSpanFull(),
                TextInput::make('location_name')
                    ->label('Nama Lokasi')
                    ->required()
                    ->columnSpanFull()
                    ->hint('Auto terisi ketika memilih di peta'),
                TextInput::make('longitude')
                    ->label('Longitude')
                    ->required()
                    ->numeric()
                    ->readonly()
                    ->columnSpan(1)
                    ->hint('Auto terisi dari peta'),
                TextInput::make('latitude')
                    ->label('Latitude')
                    ->required()
                    ->numeric()
                    ->readonly()
                    ->columnSpan(1)
                    ->hint('Auto terisi dari peta'),
                TextInput::make('grade')
                    ->required()
                    ->numeric(),
                Select::make('id_user')
                    ->relationship(
                        name: 'user',
                        titleAttribute: 'name',
                        modifyQueryUsing: fn($query) => $query->where('role', 'admin')
                    )
                    ->required()
                    ->preload()
                    ->searchable(),
                TextInput::make('points')
                    ->label('Points untuk Soal Ini')
                    ->required()
                    ->numeric()
                    ->minValue(0)
                    ->columnSpanFull(),
                Repeater::make('questionImages')
                    ->required()
                    ->label('Gambar Soal')
                    ->relationship('questionImages')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Upload Gambar')
                            ->image()
                            ->directory('questions')
                            ->disk('public')
                            ->maxFiles(1)
                            ->required(),
                    ])
                    ->columnSpanFull()
                    ->collapsible()
                    ->defaultItems(0)
                    ->addActionLabel('Tambah Gambar')
                    ->itemLabel(fn($state) => basename($state['image_path'] ?? 'Gambar Baru'))
                    ->maxItems(3)
                    ->minItems(1),
                Select::make('tags')
                    ->required()
                    ->relationship('tags', 'tag_name')
                    ->preload()
                    ->multiple()
                    ->columnSpanFull(),
                Select::make('id_question_type')
                    ->label('Jenis Soal')
                    ->relationship('questionType', 'question_type')
                    ->reactive()
                    ->required()
                    ->preload()
                    ->searchable()
                    ->columnSpanFull(),
                Textarea::make('correct_answer')
                    ->required()
                    ->columnSpanFull()
                    ->visible(function ($get) {
                        $id = $get('id_question_type');
                        if (!$id) return false;

                        return QuestionType::find($id)?->question_type === 'isian';
                    }),
                Repeater::make('questionOptions')
                    ->label('Pilihan Ganda')
                    ->relationship('questionOptions')
                    ->schema([
                        TextInput::make('option_text')
                            ->label('Opsi Pilihan Ganda')
                            ->required()
                            ->columnSpanFull(),
                        Select::make('is_correct')
                            ->label('Benar/Salah')
                            ->options([
                                0 => 'Salah',
                                1 => 'Benar',
                            ])
                    ])
                    ->defaultItems(0)
                    ->columnSpanFull()
                    ->collapsible()
                    ->reorderable(true)
                    ->itemLabel(
                        fn(array $state): ?string =>
                        $state['option_text'] ?? 'Pilihan Baru'
                    )
                    ->addActionLabel('Tambah Pilihan Ganda')
                    ->visible(function ($get) {
                        $id = $get('id_question_type');
                        if (!$id) return false;

                        return QuestionType::find($id)?->question_type === 'pilihan_ganda';
                    }),
                Repeater::make('hints')
                    ->label('Petunjuk')
                    ->relationship('hints')
                    ->schema([
                        Textarea::make('hint_description')
                            ->label('Deskripsi Petunjuk')
                            ->required()
                            ->columnSpanFull(),
                    ])
                    ->defaultItems(0)
                    ->columnSpanFull()
                    ->collapsible()
                    ->reorderable(true)
                    ->itemLabel(
                        fn(array $state): ?string =>
                        $state['Deskripsi Petunjuk'] ?? 'Petunjuk Baru'
                    )
                    ->addActionLabel('Tambah Petunjuk'),
            ]);
    }
}

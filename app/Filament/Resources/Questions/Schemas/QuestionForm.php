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

class QuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Textarea::make('title')
                    ->label('Judul Soal')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('question')
                    ->label('Pertanyaan')
                    ->required()
                    ->columnSpanFull(),
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
                FileUpload::make('question_image')
                    ->label('Gambar Soal')
                    ->image()
                    ->directory('questions')
                    ->disk('public')
                    ->maxSize(5120)
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/jpg', 'image/gif'])
                    ->columnSpanFull()
                    ->helperText('Format: JPG, PNG, GIF. Maksimal 5MB (Opsional)')
                    ->multiple(false)
                    ->maxFiles(1)
                    ->default(''),
                Select::make('tags')
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
                    // ->required()
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

<?php

namespace App\Filament\Resources\LearningPathModules\RelationManagers;

use App\Models\ModuleQuestion;
use App\Models\QuestionType;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ModuleQuestionsRelationManager extends RelationManager
{
    protected static string $relationship = 'questions';

    protected static ?string $title = 'Daftar Soal';

    protected static ?string $label = 'Soal';

    // ─── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Mapping tipe soal ke label Indonesia.
     * Digunakan di beberapa tempat agar konsisten.
     */
    private static function questionTypeLabel(string $type): string
    {
        return match ($type) {
            'pilihan_ganda'          => 'Pilihan Ganda',
            'pilihan_ganda_kompleks' => 'Pilihan Ganda Kompleks',
            'isian'                  => 'Isian',
            default                  => $type,
        };
    }

    /**
     * Tipe soal yang menggunakan Repeater opsi jawaban.
     */
    private static function isChoiceType(string $type): bool
    {
        return in_array($type, ['pilihan_ganda', 'pilihan_ganda_kompleks']);
    }

    // ─── Form (digunakan saat Edit soal dari dalam modul) ──────────────────────

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Soal')->schema([
                TextInput::make('title')
                    ->label('Judul Soal')
                    ->required()
                    ->maxLength(500)
                    ->columnSpanFull(),

                Textarea::make('question')
                    ->label('Pertanyaan')
                    ->required()
                    ->rows(5)
                    ->columnSpanFull(),

                Grid::make(3)->schema([
                    TextInput::make('grade')
                        ->label('Kelas')
                        ->numeric()
                        ->required()
                        ->default(fn() => $this->getOwnerRecord()->learningPath->grade),

                    TextInput::make('points')
                        ->label('Poin')
                        ->numeric()
                        ->required()
                        ->minValue(0)
                        ->default(10)
                        ->suffix('poin'),

                    Select::make('id_question_type')
                        ->label('Jenis Soal')
                        ->required()
                        ->native(false)
                        ->live()
                        ->options(
                            QuestionType::pluck('question_type', 'id_question_type')
                                ->mapWithKeys(fn($type, $id) => [
                                    $id => self::questionTypeLabel($type),
                                ])
                        ),
                ]),
            ]),

            Section::make('Lokasi')->schema([
                TextInput::make('location_name')
                    ->label('Nama Lokasi')
                    ->default('Learning Path')
                    ->maxLength(255),

                Grid::make(2)->schema([
                    TextInput::make('longitude')
                        ->label('Longitude')
                        ->numeric()
                        ->default(0),

                    TextInput::make('latitude')
                        ->label('Latitude')
                        ->numeric()
                        ->default(0),
                ]),
            ])->collapsible()->collapsed(),

            Section::make('Jawaban')->schema([
                // Hanya untuk isian
                TextInput::make('correct_answer')
                    ->label('Jawaban Benar')
                    ->placeholder('Teks, angka, atau /regex/')
                    ->helperText('Untuk soal isian. Bisa berupa teks, angka, atau pola regex (/pattern/).')
                    ->visible(fn($get) => QuestionType::find($get('id_question_type'))?->question_type === 'isian'),

                // Untuk pilihan_ganda dan pilihan_ganda_kompleks
                Repeater::make('questionOptions')
                    ->label('Pilihan Jawaban')
                    ->relationship('questionOptions')
                    ->schema([
                        TextInput::make('option_text')
                            ->label('Teks Pilihan')
                            ->required()
                            ->columnSpanFull(),

                        Select::make('is_correct')
                            ->label('Status')
                            ->options([0 => 'Salah', 1 => 'Benar'])
                            ->default(0)
                            ->native(false),
                    ])
                    ->defaultItems(0)
                    ->addActionLabel('Tambah Pilihan')
                    ->reorderable()
                    ->collapsible()
                    ->itemLabel(fn($state) => ($state['option_text'] ?? 'Pilihan Baru') . ($state['is_correct'] ? ' ✓' : ''))
                    // Tampil untuk kedua tipe choice
                    ->visible(fn($get) => self::isChoiceType(
                        QuestionType::find($get('id_question_type'))?->question_type ?? ''
                    ))
                    ->helperText(fn($get) =>
                        QuestionType::find($get('id_question_type'))?->question_type === 'pilihan_ganda_kompleks'
                            ? 'Pilihan ganda kompleks: tandai semua opsi yang benar (lebih dari satu diperbolehkan).'
                            : null
                    )
                    ->columnSpanFull(),
            ]),

            Section::make('Gambar Soal')->schema([
                Repeater::make('questionImages')
                    ->label('Gambar')
                    ->relationship('questionImages')
                    ->schema([
                        FileUpload::make('image_path')
                            ->label('Upload Gambar')
                            ->image()
                            ->disk('public')
                            ->directory('questions')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp'])
                            ->required(),
                    ])
                    ->defaultItems(0)
                    ->addActionLabel('Tambah Gambar')
                    ->maxItems(3)
                    ->collapsible()
                    ->itemLabel(fn($state) => basename($state['image_path'] ?? 'Gambar Baru'))
                    ->columnSpanFull(),
            ])->collapsible()->collapsed(),
        ]);
    }

    // ─── Table ─────────────────────────────────────────────────────────────────

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->defaultSort('module_questions.order_number')
            ->columns([
                TextColumn::make('pivot.order_number')
                    ->label('#')
                    ->alignCenter()
                    ->width(40)
                    ->sortable(),

                ImageColumn::make('questionImages.image_path')
                    ->label('')
                    ->width(48)
                    ->height(36)
                    ->stacked()
                    ->limit(1)
                    ->getStateUsing(fn($record) =>
                        $record->questionImages->first()?->image_path
                            ? \Illuminate\Support\Facades\Storage::url($record->questionImages->first()->image_path)
                            : null
                    ),

                TextColumn::make('title')
                    ->label('Judul Soal')
                    ->searchable()
                    ->weight('medium')
                    ->limit(50)
                    ->description(fn($record) => \Illuminate\Support\Str::limit(strip_tags($record->question), 80)),

                TextColumn::make('questionType.question_type')
                    ->label('Jenis')
                    ->badge()
                    ->formatStateUsing(fn($state) => self::questionTypeLabel($state))
                    ->color(fn($state) => match ($state) {
                        'pilihan_ganda'          => 'info',
                        'pilihan_ganda_kompleks' => 'success',
                        'isian'                  => 'warning',
                        default                  => 'gray',
                    }),

                TextColumn::make('points')
                    ->label('Poin')
                    ->numeric()
                    ->suffix(' poin')
                    ->alignCenter()
                    ->color('success'),

                TextColumn::make('options_count')
                    ->label('Pilihan')
                    ->getStateUsing(fn($record) => $record->questionOptions()->count())
                    ->suffix(' opsi')
                    ->alignCenter()
                    ->color('gray'),
            ])
            ->headerActions([
                // ── Pilih soal dari yang sudah ada ─────────────────────────────
                Action::make('attach_existing')
                    ->label('Tambah dari Soal yang Ada')
                    ->icon('heroicon-o-magnifying-glass')
                    ->color('gray')
                    ->form(function () {
                        $grade       = $this->getOwnerRecord()->learningPath->grade;
                        $existingIds = $this->getOwnerRecord()->moduleQuestions()->pluck('id_question')->toArray();

                        return [
                            Select::make('question_ids')
                                ->label("Pilih Soal (Kelas {$grade})")
                                ->multiple()
                                ->searchable()
                                ->options(
                                    \App\Models\Question::where('grade', $grade)
                                        ->with('questionType')
                                        ->get()
                                        ->mapWithKeys(fn($q) => [
                                            $q->id_question =>
                                                '[' . self::questionTypeLabel($q->questionType?->question_type ?? '') . '] '
                                                . $q->title . ' — ' . $q->points . ' poin',
                                        ])
                                )
                                ->default($existingIds)
                                ->helperText("Soal difilter kelas {$grade}. Soal yang sudah di-assign sudah tercentang."),
                        ];
                    })
                    ->action(function (array $data) {
                        $module      = $this->getOwnerRecord();
                        $currentMax  = $module->moduleQuestions()->max('order_number') ?? 0;
                        $existingIds = $module->moduleQuestions()->pluck('id_question')->toArray();
                        $newIds      = array_diff($data['question_ids'] ?? [], $existingIds);

                        foreach ($newIds as $i => $questionId) {
                            ModuleQuestion::create([
                                'id_module'    => $module->id_module,
                                'id_question'  => $questionId,
                                'order_number' => $currentMax + $i + 1,
                            ]);
                        }

                        Notification::make()
                            ->title(count($newIds) . ' soal berhasil ditambahkan')
                            ->success()->send();
                    }),

                // ── Buat soal baru langsung ─────────────────────────────────────
                Action::make('create_question')
                    ->label('Buat Soal Baru')
                    ->icon('heroicon-o-plus')
                    ->color('primary')
                    ->slideOver()
                    ->form([
                        Section::make('Informasi Soal')->schema([
                            TextInput::make('title')
                                ->label('Judul Soal')
                                ->required()
                                ->maxLength(500)
                                ->columnSpanFull(),

                            Textarea::make('question')
                                ->label('Pertanyaan')
                                ->required()
                                ->rows(5)
                                ->columnSpanFull(),

                            Grid::make(2)->schema([
                                TextInput::make('points')
                                    ->label('Poin')
                                    ->numeric()
                                    ->required()
                                    ->minValue(0)
                                    ->default(10)
                                    ->suffix('poin'),

                                Select::make('question_type')
                                    ->label('Jenis Soal')
                                    ->required()
                                    ->native(false)
                                    ->live()
                                    ->options([
                                        'pilihan_ganda'          => 'Pilihan Ganda',
                                        'pilihan_ganda_kompleks' => 'Pilihan Ganda Kompleks',
                                        'isian'                  => 'Isian',
                                    ]),
                            ]),
                        ]),

                        Section::make('Jawaban')->schema([
                            TextInput::make('correct_answer')
                                ->label('Jawaban Benar')
                                ->placeholder('Teks, angka, atau /regex/')
                                ->visible(fn($get) => $get('question_type') === 'isian'),

                            Repeater::make('options')
                                ->label('Pilihan Jawaban')
                                ->schema([
                                    TextInput::make('option_text')
                                        ->label('Teks Pilihan')
                                        ->required()
                                        ->columnSpanFull(),
                                    Select::make('is_correct')
                                        ->label('Status')
                                        ->options([0 => 'Salah', 1 => 'Benar'])
                                        ->default(0)
                                        ->native(false),
                                ])
                                ->defaultItems(4)
                                ->addActionLabel('Tambah Pilihan')
                                ->reorderable()
                                ->collapsible()
                                ->itemLabel(fn($state) => ($state['option_text'] ?? 'Pilihan') . ($state['is_correct'] ? ' ✓' : ''))
                                // Tampil untuk kedua tipe choice
                                ->visible(fn($get) => self::isChoiceType($get('question_type') ?? ''))
                                ->helperText(fn($get) =>
                                    $get('question_type') === 'pilihan_ganda_kompleks'
                                        ? 'Pilihan ganda kompleks: tandai semua opsi yang benar (lebih dari satu diperbolehkan).'
                                        : null
                                ),
                        ]),

                        Section::make('Gambar Soal (opsional)')->schema([
                            FileUpload::make('images')
                                ->label('Gambar')
                                ->multiple()
                                ->image()
                                ->disk('public')
                                ->directory('questions')
                                ->maxFiles(3)
                                ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp'])
                                ->helperText('Maks 3 gambar.'),
                        ])->collapsible()->collapsed(),

                        Section::make('Lokasi (opsional)')->schema([
                            TextInput::make('location_name')
                                ->label('Nama Lokasi')
                                ->default('Learning Path'),
                            Grid::make(2)->schema([
                                TextInput::make('longitude')->numeric()->default(0),
                                TextInput::make('latitude')->numeric()->default(0),
                            ]),
                        ])->collapsible()->collapsed(),
                    ])
                    ->action(function (array $data) {
                        $module = $this->getOwnerRecord();
                        $grade  = $module->learningPath->grade;

                        $questionType = QuestionType::firstOrCreate(
                            ['question_type' => $data['question_type']]
                        );

                        $question = \App\Models\Question::create([
                            'title'            => $data['title'],
                            'question'         => $data['question'],
                            'correct_answer'   => $data['correct_answer'] ?? null,
                            'grade'            => $grade,
                            'points'           => $data['points'],
                            'id_user'          => auth()->id(),
                            'id_question_type' => $questionType->id_question_type,
                            'location_name'    => $data['location_name'] ?? 'Learning Path',
                            'longitude'        => $data['longitude'] ?? 0,
                            'latitude'         => $data['latitude'] ?? 0,
                        ]);

                        // Simpan pilihan (berlaku untuk PG dan PGK)
                        foreach ($data['options'] ?? [] as $opt) {
                            $question->questionOptions()->create([
                                'option_text' => $opt['option_text'],
                                'is_correct'  => (bool) ($opt['is_correct'] ?? false),
                            ]);
                        }

                        // Simpan gambar
                        foreach ((array) ($data['images'] ?? []) as $imagePath) {
                            $question->questionImages()->create(['image_path' => $imagePath]);
                        }

                        // Assign ke modul
                        $nextOrder = $module->moduleQuestions()->max('order_number') + 1;
                        ModuleQuestion::create([
                            'id_module'    => $module->id_module,
                            'id_question'  => $question->id_question,
                            'order_number' => $nextOrder,
                        ]);

                        Notification::make()
                            ->title("Soal \"{$question->title}\" berhasil dibuat dan ditambahkan")
                            ->success()->send();
                    }),
            ])
            ->actions([
                EditAction::make()
                    ->label('Edit Soal')
                    ->slideOver(),

                Action::make('move_up')
                    ->label('')
                    ->icon('heroicon-o-arrow-up')
                    ->color('gray')
                    ->action(function ($record) {
                        $module  = $this->getOwnerRecord();
                        $current = ModuleQuestion::where('id_module', $module->id_module)
                            ->where('id_question', $record->id_question)->first();
                        $prev = ModuleQuestion::where('id_module', $module->id_module)
                            ->where('order_number', '<', $current->order_number)
                            ->orderByDesc('order_number')->first();

                        if ($prev) {
                            [$current->order_number, $prev->order_number] = [$prev->order_number, $current->order_number];
                            $current->save();
                            $prev->save();
                        }
                    }),

                Action::make('move_down')
                    ->label('')
                    ->icon('heroicon-o-arrow-down')
                    ->color('gray')
                    ->action(function ($record) {
                        $module  = $this->getOwnerRecord();
                        $current = ModuleQuestion::where('id_module', $module->id_module)
                            ->where('id_question', $record->id_question)->first();
                        $next = ModuleQuestion::where('id_module', $module->id_module)
                            ->where('order_number', '>', $current->order_number)
                            ->orderBy('order_number')->first();

                        if ($next) {
                            [$current->order_number, $next->order_number] = [$next->order_number, $current->order_number];
                            $current->save();
                            $next->save();
                        }
                    }),

                Action::make('detach')
                    ->label('')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading('Lepas soal dari modul?')
                    ->modalDescription('Soal tidak akan dihapus, hanya dilepas dari modul ini.')
                    ->action(function ($record) {
                        ModuleQuestion::where('id_module', $this->getOwnerRecord()->id_module)
                            ->where('id_question', $record->id_question)
                            ->delete();
                        Notification::make()->title('Soal dilepas dari modul')->success()->send();
                    }),

                DeleteAction::make()
                    ->label('')
                    ->modalHeading('Hapus soal permanen?')
                    ->modalDescription('Soal ini akan dihapus dari semua modul dan database. Tindakan tidak bisa dibatalkan.')
                    ->requiresConfirmation(),
            ])
            ->emptyStateHeading('Belum ada soal')
            ->emptyStateDescription('Tambahkan soal baru atau pilih dari soal yang sudah ada.')
            ->emptyStateIcon('heroicon-o-clipboard-document-list');
    }
}
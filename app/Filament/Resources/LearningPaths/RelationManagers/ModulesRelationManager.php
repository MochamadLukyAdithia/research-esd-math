<?php

namespace App\Filament\Resources\LearningPaths\RelationManagers;

use App\Models\LearningMaterial;
use App\Models\ModuleQuestion;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\QuestionType;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\HtmlString;

class ModulesRelationManager extends RelationManager
{
    protected static string $relationship = 'modules';

    protected static ?string $title = 'KB Pembelajaran';

    protected static ?string $label = 'KB';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')
                ->label('Judul KB')
                ->required()
                ->maxLength(255)
                ->placeholder('Contoh: Pre-Test Awal')
                ->columnSpanFull(),

            Grid::make(2)->schema([
                Select::make('type')
                    ->label('Tipe KB')
                    ->required()
                    ->native(false)
                    ->options([
                        'pre_test'   => 'Pre-Test',
                        'material'   => 'Materi',
                        'activity'   => 'Aktivitas',
                        'post_test'  => 'Post-Test',
                        'reflection' => 'Refleksi',
                    ]),

                TextInput::make('order_number')
                    ->label('Urutan')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->default(fn() =>
                        $this->getOwnerRecord()->modules()->max('order_number') + 1
                    ),
            ]),

            Toggle::make('is_required')
                ->label('Wajib diselesaikan')
                ->default(true)
                ->helperText('Modul berikutnya terkunci sampai ini selesai.')
                ->columnSpanFull(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->defaultSort('order_number')
            ->reorderable('order_number')
            ->columns([
                TextColumn::make('order_number')
                    ->label('#')
                    ->alignCenter()
                    ->width(40)
                    ->sortable(),

                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->formatStateUsing(fn($state) => match ($state) {
                        'pre_test'   => 'Pre-Test',
                        'material'   => 'Materi',
                        'activity'   => 'Aktivitas',
                        'post_test'  => 'Post-Test',
                        'reflection' => 'Refleksi',
                        default      => $state,
                    })
                    ->color(fn($state) => match ($state) {
                        'pre_test'   => 'warning',
                        'material'   => 'info',
                        'activity'   => 'purple',
                        'post_test'  => 'success',
                        'reflection' => 'pink',
                        default      => 'gray',
                    }),

                TextColumn::make('title')
                    ->label('Judul KB')
                    ->searchable()
                    ->weight('medium'),

                IconColumn::make('is_required')
                    ->label('Wajib')
                    ->boolean()
                    ->trueColor('danger')
                    ->falseColor('gray')
                    ->alignCenter(),

                TextColumn::make('questions_count')
                    ->label('Soal')
                    ->getStateUsing(fn($record) => $record->moduleQuestions()->count())
                    ->suffix(' soal')
                    ->alignCenter()
                    ->color('gray'),

                TextColumn::make('materials_count')
                    ->label('Materi')
                    ->getStateUsing(fn($record) => $record->materials()->count())
                    ->suffix(' item')
                    ->alignCenter()
                    ->color('info'),

                TextColumn::make('participants')
                    ->label('Selesai')
                    ->getStateUsing(fn($record) => $record->userProgress()->where('status', 'completed')->count())
                    ->suffix(' siswa')
                    ->alignCenter()
                    ->color('success'),
            ])
            ->headerActions([
                Action::make('create_module')
                    ->label('Tambah KB')
                    ->icon('heroicon-o-plus')
                    ->form([
                        TextInput::make('title')
                            ->label('Judul KB')
                            ->required()
                            ->maxLength(255),

                        Select::make('type')
                            ->label('Tipe KB')
                            ->required()
                            ->native(false)
                            ->options([
                                'pre_test'   => 'Pre-Test',
                                'material'   => 'Materi',
                                'activity'   => 'Aktivitas',
                                'post_test'  => 'Post-Test',
                                'reflection' => 'Refleksi',
                            ]),

                        TextInput::make('order_number')
                            ->label('Urutan')
                            ->required()
                            ->numeric()
                            ->default(fn() =>
                                $this->getOwnerRecord()->modules()->max('order_number') + 1
                            ),

                        Toggle::make('is_required')
                            ->label('Wajib diselesaikan')
                            ->default(true),
                    ])
                    ->action(function (array $data) {
                        $this->getOwnerRecord()->modules()->create($data);
                        Notification::make()->title('Modul berhasil ditambahkan')->success()->send();
                    }),
            ])
            ->actions([

                // ── Kelola Soal — pilih soal lama + buat soal baru dalam satu slide-over
                Action::make('manage_questions')
                    ->label('Kelola Soal')
                    ->icon('heroicon-o-clipboard-document-list')
                    ->color('warning')
                    ->slideOver()
                    ->visible(fn($record) => in_array($record->type, ['pre_test', 'post_test', 'activity']))
                    ->form(function ($record) {
                        $grade       = $this->getOwnerRecord()->grade;
                        $existingIds = $record->moduleQuestions()->pluck('id_question')->toArray();

                        // Soal umum + soal LP eksklusif milik learning path ini saja
                        $lpQuestionIds = ModuleQuestion::whereIn(
                            'id_module',
                            $this->getOwnerRecord()->modules()->pluck('id_module')
                        )->pluck('id_question')->unique();

                        $questionOptions = Question::where('grade', $grade)
                            ->where(function ($q) use ($lpQuestionIds) {
                                $q->where('is_learning_path_only', false)
                                  ->orWhereIn('id_question', $lpQuestionIds);
                            })
                            ->get()
                            ->mapWithKeys(fn($q) => [
                                $q->id_question => ($q->is_learning_path_only ? '🔒 ' : '') .
                                    "[ID:{$q->id_question}] {$q->title} ({$q->points} poin)"
                            ]);

                        return [

                            // ── Section 1: Pilih soal yang sudah ada ──────────
                            Section::make('Pilih Soal yang Sudah Ada')
                                ->description('Soal berlabel 🔒 adalah soal eksklusif learning path ini.')
                                ->schema([
                                    Select::make('question_ids')
                                        ->label('Soal Terpilih')
                                        ->multiple()
                                        ->options($questionOptions)
                                        ->default($existingIds)
                                        ->searchable()
                                        ->live()  // ← reactive: pilih soal → preview muncul di bawah
                                        ->helperText("Soal difilter kelas {$grade}. Buka bagian di bawah untuk membuat soal baru."),

                                    // ── Preview detail soal terpilih ──────────────
               Placeholder::make('question_preview')
    ->label('Detail Soal Terpilih')
    ->live()
    ->content(function ($get): HtmlString {
        $ids = $get('question_ids') ?? [];

        if (empty($ids)) {
            return new HtmlString(
                '<p class="text-sm text-gray-400 italic">Pilih soal di atas untuk melihat detailnya.</p>'
            );
        }

        $questions = Question::with('questionOptions')
            ->whereIn('id_question', $ids)
            ->orderByRaw('FIELD(id_question, ' . implode(',', $ids) . ')')
            ->get();

        $html = '<div class="mt-1">';

        foreach ($questions as $i => $q) {
            $badge = $q->is_learning_path_only
                ? '<span class="ml-2 text-xs bg-amber-100 text-amber-700 rounded px-1.5 py-0.5">Learning Path</span>'
                : '';

            $html .= '<div class="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm mb-4">';
            
            // Nomor + judul
            $html .= '<div class="flex items-start gap-2">';
            $html .= '<span class="shrink-0 font-bold text-gray-500">' . ($i + 1) . '.</span>';
            $html .= '<div class="flex-1">';
            $html .= '<span class="font-semibold text-gray-800">' . e($q->title) . '</span>' . $badge;

            // Teks soal
            $html .= '<p class="mt-1 text-gray-600">' . e($q->question) . '</p>';

            // Opsi jawaban (pilihan ganda)
            if ($q->questionOptions->isNotEmpty()) {
                $html .= '<ul class="mt-2 space-y-1">';
                foreach ($q->questionOptions as $opt) {
                    $icon  = $opt->is_correct
                        ? '✅'
                        : '<span class="text-gray-400">○</span>';

                    $style = $opt->is_correct
                        ? 'text-green-700 font-medium'
                        : 'text-gray-600';

                    $html .= "<li class='flex gap-1.5 {$style}'>{$icon} " . e($opt->option_text) . '</li>';
                }
                $html .= '</ul>';
            }

            // Kunci jawaban (essay / isian)
            if ($q->correct_answer && $q->questionOptions->isEmpty()) {
                $html .= '<p class="mt-2 text-green-700 text-xs">Jawaban: ' . e($q->correct_answer) . '</p>';
            }

            // Poin
            $html .= '<p class="mt-2 text-xs text-gray-400">' . $q->points . ' poin</p>';

            $html .= '</div></div></div>';
        }

        $html .= '</div>';

        return new HtmlString($html);
    })
    ->columnSpanFull(), ]),

                            // ── Section 2: Buat soal baru (collapsed default) ──
                            Section::make('Buat Soal Baru')
                                ->description('Soal baru otomatis eksklusif LP dan langsung masuk ke modul ini.')
                                ->collapsible()
                                ->collapsed(true)
                                ->schema([
                                    TextInput::make('new_title')
                                        ->label('Judul / Ringkasan Soal')
                                        ->maxLength(255)
                                        ->required()
                                        ->placeholder('Contoh: Hitung luas taman berbentuk trapesium'),

                                    Textarea::make('new_question')
                                        ->label('Teks Soal')
                                        ->rows(4)
                                        ->required()
                                        ->placeholder('Tulis soal lengkap di sini...'),

                                    Grid::make(2)->schema([
                                        Select::make('new_question_type_id')
                                            ->label('Tipe Soal')
                                            ->native(false)
                                            ->required()
                                            ->options(
                                                QuestionType::all()->pluck('question_type', 'id_question_type')
                                            )
                                            ->live() // ← pilih tipe → field jawaban menyesuaikan otomatis
                                           ,

                                        TextInput::make('new_points')
                                            ->label('Poin')
                                            ->numeric()
                                            ->helperText('Jumlah poin yang didapat jika jawaban benar.')
                                            ->required()
                                            ->minValue(0)
                                            ->default(10),
                                    ]),

                                    // ── Pilihan Ganda: tampil jika nama tipe mengandung kata kunci MC ──
                                    Repeater::make('new_options')
                                        ->label('Pilihan Jawaban')
                                        ->schema([
                                            TextInput::make('option_text')
                                                ->label('Teks Opsi')
                                                ->required()
                                                ->placeholder('Tulis pilihan jawaban...'),

                                            Toggle::make('is_correct')
                                                ->label('Kunci')
                                                ->default(false),
                                        ])
                                        ->columns(2)
                                        ->minItems(2)
                                        ->maxItems(6)
                                        ->defaultItems(4)
                                        ->addActionLabel('+ Tambah Opsi')
                                        ->reorderable(false)
                                        ->visible(function ($get) {
                                            $id = $get('new_question_type_id');
                                            if (!$id) return false;
                                            $name = strtolower(QuestionType::find($id)?->question_type ?? '');
                                            return str_contains($name, 'pilihan')
                                                || str_contains($name, 'ganda')
                                                || str_contains($name, 'multiple')
                                                || str_contains($name, 'pg');
                                        }),

                                    // ── Isian / Essay: tampil jika nama tipe mengandung kata kunci essay ──
                                    Textarea::make('new_correct_answer')
                                        ->label('Kunci Jawaban')
                                        ->rows(3)
                                        ->placeholder('Tulis jawaban yang benar...')
                                        ->helperText('Dipakai untuk pengecekan otomatis atau panduan koreksi.')
                                        ->visible(function ($get) {
                                            $id = $get('new_question_type_id');
                                            if (!$id) return false;
                                            $name = strtolower(QuestionType::find($id)?->question_type ?? '');
                                            return str_contains($name, 'isian')
                                                || str_contains($name, 'essay')
                                                || str_contains($name, 'uraian')
                                                || str_contains($name, 'singkat');
                                        }),
                                ]),
                        ];
                    })
                    ->action(function ($record, array $data) {
                        // ── 1. Buat soal baru jika new_title & new_question terisi ──
                        $newQuestionId = null;

                        if (!empty($data['new_title']) && !empty($data['new_question'])) {
                            $question = Question::create([
                                'title'                 => $data['new_title'],
                                'question'              => $data['new_question'],
                                'grade'                 => $this->getOwnerRecord()->grade,
                                'points'                => $data['new_points'] ?? 10,
                                'id_user'               => Auth::id(),
                                'id_question_type'      => $data['new_question_type_id'] ?? null,
                                'correct_answer'        => $data['new_correct_answer'] ?? null,
                                'is_learning_path_only' => true,
                                'location_name'         => null,
                                'longitude'             => null,
                                'latitude'              => null,
                            ]);

                            // Simpan opsi jika tipe soal adalah pilihan ganda
                            $typeName = strtolower(
                                QuestionType::find($data['new_question_type_id'] ?? null)?->question_type ?? ''
                            );
                            $isMultipleChoice = str_contains($typeName, 'pilihan')
                                || str_contains($typeName, 'ganda')
                                || str_contains($typeName, 'multiple')
                                || str_contains($typeName, 'pg');

                            if ($isMultipleChoice && !empty($data['new_options'])) {
                                foreach ($data['new_options'] as $opt) {
                                    QuestionOption::create([
                                        'id_question' => $question->id_question,
                                        'option_text' => $opt['option_text'],
                                        'is_correct'  => $opt['is_correct'] ?? false,
                                    ]);
                                }
                            }

                            $newQuestionId = $question->id_question;
                        }

                        // ── 2. Simpan ulang pilihan soal dari Select ───────────
                        ModuleQuestion::where('id_module', $record->id_module)->delete();

                        $selectedIds = $data['question_ids'] ?? [];

                        // Soal baru otomatis masuk ke daftar terpilih
                        if ($newQuestionId && !in_array($newQuestionId, $selectedIds)) {
                            $selectedIds[] = $newQuestionId;
                        }

                        foreach ($selectedIds as $order => $questionId) {
                            ModuleQuestion::create([
                                'id_module'    => $record->id_module,
                                'id_question'  => $questionId,
                                'order_number' => $order + 1,
                            ]);
                        }

                        $msg = $newQuestionId
                            ? 'Soal baru dibuat dan semua soal berhasil disimpan'
                            : 'Soal berhasil disimpan';

                        Notification::make()->title($msg)->success()->send();
                    }),

                // ── Kelola Materi (untuk modul tipe material) ─────────────────
                Action::make('manage_materials')
                    ->label('Kelola Materi')
                    ->icon('heroicon-o-book-open')
                    ->color('info')
                    ->visible(fn($record) => $record->type === 'material')
                    ->slideOver()
                    ->form(function ($record) {
                        $materials = $record->materials()->orderBy('order_number')->get();

                        return [
                            Section::make('Tambah Materi Baru')
                                ->description('Isi form di bawah untuk menambahkan item materi ke modul ini.')
                                ->schema([  
                                    TextInput::make('new_title')
                                        ->label('Judul Materi')
                                        ->placeholder('Contoh: Slide Pengantar Aljabar')
                                        ->maxLength(255),

                                    Select::make('new_content_type')
                                        ->label('Tipe Konten')
                                        ->native(false)
                                        ->options([
                                            'slide'   => 'Slide / PPT',
                                            'video'   => 'Video',
                                            'example' => 'Contoh Soal',
                                            'text'    => 'Teks / Penjelasan',
                                        ])
                                        ->live(),

                                 
                                  FileUpload::make('new_file')
                                    ->label('Upload File')
                                    ->disk('public')
                                    ->directory('learning-materials')
                                    ->visibility('public')
                                    ->maxFiles(1)
                                    ->acceptedFileTypes([
                                        'application/pdf',
                                        'application/vnd.ms-powerpoint',
                                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                        'video/mp4',
                                        'video/webm',
                                        'image/png',
                                        'image/jpeg',
                                        'image/webp',
                                    ])
                                    ->maxSize(10485760) 
                                    
                                    // Helper text disesuaikan agar user tahu limit barunya
                                    ->helperText('PDF, PPT, PPTX, MP4, PNG, JPG. Mendukung file besar hingga 10GB.')
                                    ->visible(fn($get) => in_array($get('new_content_type'), ['slide', 'video'])),

                                    TextInput::make('new_url')
                                        ->label('URL Eksternal')
                                        ->url()
                                        ->placeholder('https://...')
                                        ->helperText('Contoh: URL embed YouTube atau Google Slides.')
                                        ->visible(fn($get) => in_array($get('new_content_type'), ['slide', 'video'])),

                                    Textarea::make('new_content')
                                        ->label('Konten')
                                        ->rows(6)
                                        ->placeholder('Tulis penjelasan materi atau contoh soal di sini...')
                                        ->visible(fn($get) => in_array($get('new_content_type'), ['text', 'example'])),

                                    TextInput::make('new_order')
                                        ->label('Urutan')
                                        ->numeric()
                                        ->default($materials->count() + 1),
                                ]),

                            Section::make('Materi yang Sudah Ada (' . $materials->count() . ' item)')
                                ->description('Daftar materi yang sudah ditambahkan ke modul ini.')
                                ->schema(
                                    $materials->isEmpty()
                                        ? [
                                            Placeholder::make('empty')
                                                ->label('')
                                                ->content('Belum ada materi. Tambahkan menggunakan form di atas.'),
                                          ]
                                        : $materials->map(fn($m) =>
                                            Placeholder::make('material_' . $m->id_material)
                                                ->label("#{$m->order_number} · {$m->content_type_label}")
                                                ->content($m->title)
                                          )->toArray()
                                )
                                ->collapsible(),
                        ];
                    })
                    ->action(function ($record, array $data) {
                        if (empty($data['new_title']) || empty($data['new_content_type'])) {
                            Notification::make()->title('Judul dan tipe konten wajib diisi')->warning()->send();
                            return;
                        }

                        $filePath = null;

                        if (!empty($data['new_file'])) {
                            $filePath = is_array($data['new_file'])
                                ? collect($data['new_file'])->first()
                                : $data['new_file'];
                        } elseif (!empty($data['new_url'])) {
                            $filePath = $data['new_url'];
                        }

                        LearningMaterial::create([
                            'id_module'    => $record->id_module,
                            'title'        => $data['new_title'],
                            'content_type' => $data['new_content_type'],
                            'content'      => $data['new_content'] ?? null,
                            'file_path'    => $filePath,
                            'order_number' => $data['new_order'] ?? ($record->materials()->count() + 1),
                        ]);

                        Notification::make()->title('Materi berhasil ditambahkan')->success()->send();
                    }),

                // ── Edit Modul ─────────────────────────────────────────────────
                Action::make('edit_module')
                    ->label('Edit')
                    ->icon('heroicon-o-pencil')
                    ->color('gray')
                    ->form(fn($record) => [
                        TextInput::make('title')
                            ->label('Judul KB')
                            ->required()
                            ->default($record->title),

                        Select::make('type')
                            ->label('Tipe')
                            ->required()
                            ->native(false)
                            ->default($record->type)
                            ->options([
                                'pre_test'   => 'Pre-Test',
                                'material'   => 'Materi',
                                'activity'   => 'Aktivitas',
                                'post_test'  => 'Post-Test',
                                'reflection' => 'Refleksi',
                            ]),

                        TextInput::make('order_number')
                            ->label('Urutan')
                            ->required()
                            ->numeric()
                            ->default($record->order_number),

                        Toggle::make('is_required')
                            ->label('Wajib')
                            ->default($record->is_required),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update($data);
                        Notification::make()->title('Modul diperbarui')->success()->send();
                    }),

                // ── Naik / Turun urutan ────────────────────────────────────────
                Action::make('move_up')
                    ->label('')
                    ->icon('heroicon-o-arrow-up')
                    ->color('gray')
                    ->action(function ($record) {
                        $prev = $this->getOwnerRecord()->modules()
                            ->where('order_number', '<', $record->order_number)
                            ->orderByDesc('order_number')
                            ->first();

                        if ($prev) {
                            [$record->order_number, $prev->order_number] = [$prev->order_number, $record->order_number];
                            $record->save();
                            $prev->save();
                        }
                    }),

                Action::make('move_down')
                    ->label('')
                    ->icon('heroicon-o-arrow-down')
                    ->color('gray')
                    ->action(function ($record) {
                        $next = $this->getOwnerRecord()->modules()
                            ->where('order_number', '>', $record->order_number)
                            ->orderBy('order_number')
                            ->first();

                        if ($next) {
                            [$record->order_number, $next->order_number] = [$next->order_number, $record->order_number];
                            $record->save();
                            $next->save();
                        }
                    }),

                DeleteAction::make()
                    ->label('')
                    ->requiresConfirmation(),
            ])
            ->emptyStateHeading('Belum ada modul')
            ->emptyStateDescription('Klik "Tambah KB" untuk mulai membangun alur belajar.')
            ->emptyStateIcon('heroicon-o-squares-2x2');
    }
}
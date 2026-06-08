<?php

namespace App\Filament\Resources\LearningPaths\Pages;

use App\Filament\Resources\LearningPaths\LearningPathResource;
use App\Models\LearningPath;
use App\Models\LearningPathModule;
use App\Models\ModuleQuestion;
use App\Models\Question;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

class ManageLearningPathModules extends Page implements HasTable
{
    use InteractsWithTable;

    protected static string $resource = LearningPathResource::class;

    // View bawaan Filament untuk custom page
    protected  string $view = 'filament.resources.learning-paths.pages.manage-learning-path-modules';

    protected static ?string $title = 'Kelola Modul';

    // Record diambil dari route parameter {record}
    public LearningPath $record;

    public function mount(int|string $record): void
    {
        $this->record = LearningPath::findOrFail($record);
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                LearningPathModule::query()
                    ->where('id_learning_path', $this->record->id_learning_path)
                    ->orderBy('order_number')
            )
            ->columns([
                TextColumn::make('order_number')
                    ->label('#')
                    ->alignCenter()
                    ->width(40),

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
                    ->color('gray'),

                TextColumn::make('participants')
                    ->label('Peserta Selesai')
                    ->getStateUsing(fn($record) => $record->userProgress()->where('status', 'completed')->count())
                    ->suffix(' siswa')
                    ->alignCenter()
                    ->color('success'),
            ])
            ->headerActions([
                Action::make('add_module')
                    ->label('Tambah KB')
                    ->icon('heroicon-o-plus')
                    ->form([
                        Grid::make(2)->schema([
                            TextInput::make('title')
                                ->label('Judul KB')
                                ->required()
                                ->maxLength(255)
                                ->placeholder('Contoh: Pre-Test Awal'),

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
                                    LearningPathModule::where('id_learning_path', $this->record->id_learning_path)
                                        ->max('order_number') + 1
                                ),

                            Toggle::make('is_required')
                                ->label('Wajib diselesaikan')
                                ->default(true)
                                ->helperText('Jika aktif, modul berikutnya terkunci sampai ini selesai.'),
                        ]),
                    ])
                    ->action(function (array $data) {
                        LearningPathModule::create([
                            ...$data,
                            'id_learning_path' => $this->record->id_learning_path,
                        ]);
                        Notification::make()->title('Modul berhasil ditambahkan')->success()->send();
                    }),
            ])
            ->actions([
                Action::make('manage_questions')
                    ->label('Soal')
                    ->icon('heroicon-o-clipboard-document-list')
                    ->color('info')
                    ->visible(fn($record) => in_array($record->type, ['pre_test', 'post_test', 'activity']))
                    ->form(function ($record) {
                        $existingIds = $record->moduleQuestions()->pluck('id_question')->toArray();
                        return [
                            Select::make('question_ids')
                                ->label('Pilih Soal')
                                ->multiple()
                                ->options(
                                    Question::where('grade', $this->record->grade)
                                        ->get()
                                        ->mapWithKeys(fn($q) => [
                                            $q->id_question => "[{$q->id_question}] {$q->title} ({$q->points} poin)"
                                        ])
                                )
                                ->default($existingIds)
                                ->searchable()
                                ->helperText('Soal difilter berdasarkan kelas learning path ini.'),
                        ];
                    })
                    ->action(function ($record, array $data) {
                        ModuleQuestion::where('id_module', $record->id_module)->delete();
                        foreach ($data['question_ids'] as $order => $questionId) {
                            ModuleQuestion::create([
                                'id_module'    => $record->id_module,
                                'id_question'  => $questionId,
                                'order_number' => $order + 1,
                            ]);
                        }
                        Notification::make()->title('Soal berhasil disimpan')->success()->send();
                    }),

                Action::make('edit_module')
                    ->label('Edit')
                    ->icon('heroicon-o-pencil')
                    ->color('gray')
                    ->form(fn($record) => [
                        Grid::make(2)->schema([
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
                        ]),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update($data);
                        Notification::make()->title('Modul diperbarui')->success()->send();
                    }),

                Action::make('move_up')
                    ->label('')
                    ->icon('heroicon-o-arrow-up')
                    ->color('gray')
                    ->action(function ($record) {
                        $prev = LearningPathModule::where('id_learning_path', $this->record->id_learning_path)
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
                        $next = LearningPathModule::where('id_learning_path', $this->record->id_learning_path)
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
            ->emptyStateDescription('Tambahkan modul untuk mulai membangun alur belajar.')
            ->emptyStateIcon('heroicon-o-squares-2x2')
            ->reorderable('order_number');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('back_to_list')
                ->label('Kembali ke Daftar')
                ->icon('heroicon-o-arrow-left')
                ->color('gray')
                ->url(LearningPathResource::getUrl('index')),

            Action::make('edit_path')
                ->label('Edit Info Learning Path')
                ->icon('heroicon-o-pencil')
                ->color('warning')
                ->url(LearningPathResource::getUrl('edit', ['record' => $this->record])),
        ];
    }
}
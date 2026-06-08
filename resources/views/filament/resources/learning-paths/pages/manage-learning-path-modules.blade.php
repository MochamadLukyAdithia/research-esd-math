<x-filament-panels::page>

    {{-- Info singkat learning path yang sedang dikelola --}}
    <div class="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 mb-2">
        @if($this->record->thumbnail)
            <img src="{{ Storage::url($this->record->thumbnail) }}"
                 class="w-16 h-10 object-cover rounded-lg shrink-0" />
        @else
            <div class="w-16 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                <x-heroicon-o-academic-cap class="w-6 h-6 text-primary-400" />
            </div>
        @endif

        <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white truncate">
                {{ $this->record->title }}
            </p>
            <div class="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span>Kelas {{ $this->record->grade }}</span>
                <span>·</span>
                <span>{{ $this->record->category }}</span>
                <span>·</span>
                <span>{{ $this->record->modules()->count() }} modul</span>
                <span>·</span>
                <span class="{{ $this->record->is_published ? 'text-green-600' : 'text-gray-400' }}">
                    {{ $this->record->is_published ? 'Dipublikasi' : 'Draft' }}
                </span>
            </div>
        </div>
    </div>

    {{-- Table modul --}}
    {{ $this->table }}

</x-filament-panels::page>
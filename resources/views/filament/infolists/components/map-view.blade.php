<div class="space-y-2">
    <label class="text-sm font-medium text-gray-700">Peta Lokasi</label>
    <div
        id="map-view-{{ $entry->getId() }}"
        style="height: 300px; width: 100%; border-radius: 8px; border: 1px solid #e5e7eb;"
        wire:ignore
    ></div>
    <p class="text-xs text-gray-500">Lokasi berdasarkan koordinat: {{ $getRecord()->latitude }}, {{ $getRecord()->longitude }}</p>
</div>

@push('scripts')
<script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const record = @json($getRecord());

        if (record.latitude && record.longitude) {
            // Set Mapbox access token
            mapboxgl.accessToken = '{{ env('MAPBOX_ACCESS_TOKEN') }}';

            // Initialize map
            const map = new mapboxgl.Map({
                container: 'map-view-{{ $entry->getId() }}',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [record.longitude, record.latitude],
                zoom: 15
            });

            // Add navigation control
            map.addControl(new mapboxgl.NavigationControl());

            // Wait for map to load
            map.on('load', function() {
                // Add marker
                new mapboxgl.Marker({
                    color: '#EF4444',
                    draggable: false
                })
                .setLngLat([record.longitude, record.latitude])
                .setPopup(new mapboxgl.Popup().setHTML(`
                    <div class="p-2">
                        <strong class="text-sm">${record.location_name || 'Lokasi Terpilih'}</strong>
                        <p class="text-xs text-gray-600 mt-1">
                            Lat: ${record.latitude}<br>
                            Lng: ${record.longitude}
                        </p>
                    </div>
                `))
                .addTo(map);

                // Open popup by default
                // marker.togglePopup();
            });
        } else {
            // Jika tidak ada koordinat, tampilkan pesan
            document.getElementById('map-view-{{ $entry->getId() }}').innerHTML = `
                <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <div class="text-center text-gray-500">
                        <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                        <p class="text-sm">Tidak ada data koordinat lokasi</p>
                    </div>
                </div>
            `;
        }
    });
</script>
@endpush

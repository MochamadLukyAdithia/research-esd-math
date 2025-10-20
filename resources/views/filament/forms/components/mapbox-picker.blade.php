<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div x-data="mapboxPicker({
        lat: {{ $getDefaultLat() }},
        lng: {{ $getDefaultLng() }},
        zoom: {{ $getDefaultZoom() }},
        accessToken: '{{ $getAccessToken() }}',
        state: $wire.$entangle('{{ $getStatePath() }}')
    })">
        <div
            id="mapbox-{{ $getId() }}"
            style="height: 300px; width: 100%; border-radius: 8px; border: 1px solid #e5e7eb;"
            wire:ignore
        ></div>
        <div class="mt-2 text-sm text-gray-600 flex justify-between items-center">
            <span>Klik pada peta untuk memilih lokasi</span>
            <button
                type="button"
                x-on:click="clearMarker()"
                class="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
                Hapus Marker
            </button>
        </div>
    </div>

    @push('scripts')
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('mapboxPicker', (config) => ({
                map: null,
                marker: null,

                init() {
                    mapboxgl.accessToken = config.accessToken;
                    this.map = new mapboxgl.Map({
                        container: 'mapbox-{{ $getId() }}',
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: [config.lng, config.lat],
                        zoom: config.zoom
                    });
                    this.map.addControl(new mapboxgl.NavigationControl());
                    this.map.on('load', () => {
                        this.map.on('click', (e) => {
                            this.setMarker(e.lngLat.lat, e.lngLat.lng);
                            this.updateFormFields(e.lngLat.lat, e.lngLat.lng);
                        });
                        if (config.state && config.state.lat && config.state.lng) {
                            this.setMarker(config.state.lat, config.state.lng);
                        }
                    });
                },

                setMarker(lat, lng) {
                    if (this.marker) {
                        this.marker.remove();
                    }
                    this.marker = new mapboxgl.Marker({
                        draggable: true,
                        color: '#3B82F6'
                    })
                    .setLngLat([lng, lat])
                    .addTo(this.map);
                    config.state = { lat: lat, lng: lng };
                    this.marker.on('dragend', () => {
                        const lngLat = this.marker.getLngLat();
                        config.state = { lat: lngLat.lat, lng: lngLat.lng };
                        this.updateFormFields(lngLat.lat, lngLat.lng);
                    });
                    this.map.panTo([lng, lat]);
                },

                clearMarker() {
                    if (this.marker) {
                        this.marker.remove();
                        this.marker = null;
                    }
                    config.state = null;
                    @this.set('data.longitude', '');
                    @this.set('data.latitude', '');
                    @this.set('data.location_name', '');
                },

                updateFormFields(lat, lng) {
                    @this.set('data.longitude', lng);
                    @this.set('data.latitude', lat);
                    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${config.accessToken}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.features && data.features.length > 0) {
                                const placeName = data.features[0].place_name;
                                @this.set('data.location_name', placeName);
                            }
                        })
                        .catch(error => {
                            console.log('Error getting location name:', error);
                            @this.set('data.location_name', `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
                        });
                }
            }));
        });
    </script>
    @endpush
</x-dynamic-component>

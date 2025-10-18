import { useState, useEffect, useMemo, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Map, X } from 'lucide-react';
import TaskFilter, { Filters } from '@/Components/portal/TaskFilter';
import TaskList from '@/Components/portal/TaskList';
import MapComponent from '@/Components/portal/MapComponent';
import TaskDetailModal from '@/Components/portal/TaskModal';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';
import { usePage } from '@inertiajs/react';

export interface Tag {
  id_tag: number;
  tag_name: string;
}

export interface Task {
  id_question: number;
  title: string;
  location_name: string;
  latitude: number;
  longitude: number;
  question_image: string;
  tags: Tag[];
  is_favorite: boolean;
  created_at: string;
  grade: number;
  distance?: number;
}

interface PageProps {
  tasks: Task[];
  tags: Tag[];
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function Index({ tasks: initialTasks, tags }: PageProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [showMap, setShowMap] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    selectedTag: 0,
    showFavorites: false,
    sortBy: 'distance',
    sortDirection: 'asc',
  });

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [viewState, setViewState] = useState({
    longitude: 112.7521,
    latitude: -7.2575,
    zoom: 12,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        setViewState(prev => ({ ...prev, longitude: loc.lng, latitude: loc.lat, zoom: 13 }));
        setIsLoadingLocation(false);
      },
      () => {
        console.error("Gagal mendapatkan lokasi.");
        setIsLoadingLocation(false);
      }
    );
  }, []);

  useEffect(() => {
    setDisplayLimit(10);
  }, [filters]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (userLocation) {
      result = result.map(task => ({
        ...task,
        distance: calculateDistance(userLocation.lat, userLocation.lng, task.latitude, task.longitude),
      }));
    }

    if (filters.searchQuery) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.selectedTag !== 0) {
      result = result.filter(task => task.tags.some(tag => tag.id_tag === filters.selectedTag));
    }

    if (filters.showFavorites) {
      result = result.filter(task => task.is_favorite);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') {
        comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (filters.sortBy === 'distance' && a.distance !== undefined && b.distance !== undefined) {
        comparison = a.distance - b.distance;
      }
      return filters.sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters, userLocation]);

  const displayedTasks = useMemo(() => {
    return filteredTasks.slice(0, displayLimit);
  }, [filteredTasks, displayLimit]);

  const hasMoreTasks = filteredTasks.length > displayLimit;

  const loadMoreTasks = () => {
    setDisplayLimit((prev: number) => prev + 10);
  };

  const toggleFavorite = useCallback((taskId: number) => {
    router.post(`/portal/questions/${taskId}/toggle-favorite`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        setTasks(prev => prev.map(t =>
          t.id_question === taskId ? { ...t, is_favorite: !t.is_favorite } : t
        ));
        if (selectedTask?.id_question === taskId) {
          setSelectedTask(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
        }
      },
      onError: (errors) => {
        console.error('Error toggling favorite:', errors);
        const firstError = Object.values(errors)[0];
        alert(`Gagal: ${firstError || 'Terjadi kesalahan.'}`);
      }
    });
  }, [selectedTask]);

    const { auth } = usePage().props as { auth: { user: Profile | null } };
  return (
    <>
      <Head title="Portal Tugas" />
    <Navbar user={auth.user} />
      <div className="flex flex-col h-screen bg-background pt-[72px]">
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className={`w-full md:w-96 border-r border-gray-200 bg-background overflow-y-auto ${showMap ? 'hidden md:block' : 'block'}`}>
            <div className="h-full overflow-y-auto">
              <TaskFilter tags={tags} filters={filters} onFilterChange={setFilters} />
              <TaskList
                tasks={displayedTasks}
                selectedTask={selectedTask}
                onTaskSelect={(task) => {
                  setSelectedTask(task);
                  setShowMap(true);
                  if (task.latitude && task.longitude) {
                    setViewState(prev => ({
                      ...prev,
                      longitude: task.longitude,
                      latitude: task.latitude,
                      zoom: 15
                    }));
                  }
                }}
                onToggleFavorite={toggleFavorite}
                isLoadingLocation={isLoadingLocation}
              />
              {hasMoreTasks && (
                <div className="px-6 pb-4">
                  <button
                    onClick={loadMoreTasks}
                    className="w-full py-2 bg-secondary border border-secondary text-background text-md rounded-lg border-secondary hover:bg-transparent hover:text-secondary transition-all"
                  >
                    Lihat Lebih Banyak ({filteredTasks.length - displayLimit} tugas lainnya)
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={`flex-1 relative ${showMap ? 'block' : 'hidden md:block'}`}>
            <MapComponent
              tasks={filteredTasks}
              userLocation={userLocation}
              viewState={viewState}
              onViewStateChange={setViewState}
              onTaskSelect={setSelectedTask}
            />
            <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onToggleFavorite={toggleFavorite}
            />
            <button
              onClick={() => setShowMap(false)}
              className="md:hidden absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all z-10"
            >
              <X size={20} className="text-secondary" />
            </button>
          </div>
        </div>

        {!showMap && (
          <button
            onClick={() => setShowMap(true)}
            className="md:hidden fixed bottom-6 right-6 p-4 bg-primary rounded-full shadow-2xl hover:bg-primary/90 transition-all z-20"
          >
            <Map size={24} className="text-secondary" />
          </button>
        )}
      </div>
    </>
  );
}

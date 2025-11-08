import { useState, useEffect, useMemo, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Map, X } from 'lucide-react';
import TaskFilter, { Filters } from '@/Components/portal/TaskFilter';
import TaskList from '@/Components/portal/TaskList';
import MapComponent from '@/Components/portal/MapComponent';
import TaskDetailModal from '@/Components/portal/TaskModal';
import QuestionDetailSidebar from '@/Components/portal/detail/QuestionDetailSidebar';
import Navbar from '@/Components/navbar/Navbar';
import { User as Profile } from '@/types';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

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
  question_type: string;
  distance?: number;
}

interface PageProps {
  tasks: Task[];
  tags: Tag[];
}

interface QuestionOption {
  id_question_option: number;
  option_text: string;
  is_correct: boolean;
}

interface QuestionDetail {
  id_question: number;
  title: string;
  question: string;
  question_type: 'pilihan_ganda' | 'isian';
  location_name: string;
  latitude: number;
  longitude: number;
  question_image: string;
  tags: Tag[];
  grade: number;
  options?: QuestionOption[] | null;
  is_favorite: boolean;
  created_at: string;
  creator: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  hints: Array<{
    id_hint: number;
    image: string;
    hint_description: string;
  }>;
  distance?: number;
  user_answer?: {
    answer: string;
    is_correct: boolean;
    answered_at: string;
  } | null;
  attempt_info?: {
    total_attempts: number;
    max_attempts: number;
    attempts_remaining: number;
    is_cooldown?: boolean;
    cooldown_remaining?: number;
  } | null;
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

  const [showDetailView, setShowDetailView] = useState(false);
  const [questionDetail, setQuestionDetail] = useState<QuestionDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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
    longitude: 0,
    latitude: 0,
    zoom: 12,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        setViewState({
          longitude: loc.lng,
          latitude: loc.lat,
          zoom: 13,
        });
        setIsLoadingLocation(false);
      },
      () => {
        console.warn("User menolak izin lokasi. Menggunakan lokasi default Jember.");
        const jemberLoc = { lat: -8.1723, lng: 113.6995 };
        setUserLocation(jemberLoc);
        setViewState({
          longitude: jemberLoc.lng,
          latitude: jemberLoc.lat,
          zoom: 12,
        });
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

  const loadQuestionDetail = async (taskId: number) => {
    setIsLoadingDetail(true);
    try {
      const response = await axios.get(`/portal/questions/${taskId}/detail`);
      const detail = response.data;

      if (userLocation) {
        detail.distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          detail.latitude,
          detail.longitude
        );
      }

      setQuestionDetail(detail);
      setShowDetailView(true);
    } catch (error) {
      console.error('Error loading question detail:', error);
      alert('Gagal memuat detail soal');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setQuestionDetail(null);
  };

  const handleShowQuestion = (task: Task) => {
    loadQuestionDetail(task.id_question);
    setSelectedTask(null);
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
        if (questionDetail?.id_question === taskId) {
          setQuestionDetail(prev => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
        }
      },
      onError: (errors) => {
        console.error('Error toggling favorite:', errors);
        const firstError = Object.values(errors)[0];
        alert(`Gagal: ${firstError || 'Terjadi kesalahan.'}`);
      }
    });
  }, [selectedTask, questionDetail]);

  const { auth } = usePage().props as { auth: { user: Profile | null } };

  return (
    <>
      <Head title="Portal Tugas" />
      <Navbar user={auth.user} />
      <div className="flex flex-col h-screen bg-background pt-[72px]">
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className={`w-full md:w-96 border-r border-gray-200 bg-background overflow-y-auto ${showMap ? 'hidden md:block' : 'block'}`}>
            {showDetailView ? (
                <QuestionDetailSidebar
                  question={questionDetail}
                  isLoading={isLoadingDetail}
                  onBack={handleBackToList}
                  onToggleFavorite={toggleFavorite}
                />
            ) : (
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
                  onShowQuestion={handleShowQuestion}
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
            )}
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
              onShowQuestion={handleShowQuestion}
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

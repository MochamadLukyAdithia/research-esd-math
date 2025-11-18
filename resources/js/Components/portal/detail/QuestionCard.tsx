import { useState } from 'react';
import { useEffect } from 'react';
import { Globe, GraduationCap, Copy, Check, Star, ImageOff, Trophy, ChevronLeft, ChevronRight, X, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

interface Tag {
  id_tag: number;
  tag_name: string;
}

interface QuestionCardProps {
  questionId: number;
  title: string;
  question: string;
  questionImages: string[];
  tags: Tag[];
  grade: number;
  points: number;
  distance?: number;
  locationName: string;
  isFavorite: boolean;
  isAnswered?: boolean;
  onToggleFavorite: (questionId: number) => void;
}

export default function QuestionCard({
  questionId,
  title,
  question,
  questionImages,
  tags,
  grade,
  points,
  distance,
  locationName,
  isFavorite,
  isAnswered,
  onToggleFavorite
}: QuestionCardProps) {
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const images = Array.isArray(questionImages) && questionImages.length > 0
    ? questionImages.filter((img): img is string => img !== null && img !== undefined)
    : [];

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('QuestionCard - questionId:', questionId, 'images count:', images.length, 'images:', images);
  }, [questionId, images]);

  const currentImage = images.length > 0 ? images[currentImageIndex] : null;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setImageError(false);
    setImageLoading(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setImageError(false);
    setImageLoading(true);
  };

  const handleImageError = () => {
    console.error('Failed to load image at index:', currentImageIndex);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleCopyQuestion = async () => {
    try {
      const textToCopy = `${title}\n\n${question}\n\nLokasi: ${locationName}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(questionId);
  };

  return (
    <div className="bg-background shadow-md overflow-hidden">
      {/* Image Section dengan Prev/Next */}
      <div className="relative w-full h-64 bg-gray-100">
        {images.length > 0 ? (
          <>
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="animate-pulse text-gray-400">
                  <Globe size={32} />
                </div>
              </div>
            )}

            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <ImageOff size={48} className="text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">Gambar tidak tersedia</p>
              </div>
            ) : (
              <>
                <img
                  src={currentImage || ''}
                  alt={`${title} - Image ${currentImageIndex + 1}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  onClick={() => setShowImageModal(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 cursor-pointer hover:opacity-90 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Prev Button */}
                {images.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors z-20"
                    title="Gambar sebelumnya"
                  >
                    <ChevronLeft size={20} className="text-secondary" />
                  </button>
                )}

                {/* Next Button */}
                {images.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors z-20"
                    title="Gambar berikutnya"
                  >
                    <ChevronRight size={20} className="text-secondary" />
                  </button>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium z-20">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Expand Button */}
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-2 left-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors z-20"
                  title="Lihat gambar lebih besar"
                >
                  <Maximize2 size={18} className="text-secondary" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ImageOff size={48} className="text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Gambar tidak tersedia</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-secondary mb-2">{title}</h2>

        <div className="mb-4">
          <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
            {question}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <span
                key={tag.id_tag}
                className="px-3 py-1 text-xs border border-secondary text-secondary rounded-full font-medium"
              >
                {tag.tag_name}
              </span>
            ))}
          </div>
        )}

            <div className="flex items-center justify-end pt-3">
          <div className="flex items-center gap-2 text-secondary">
            <div className="flex items-center gap-1">
              <Globe size={16} />
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap size={16} />
              <span className='mr-1 text-sm'>{grade}</span>
            </div>
            <div className='flex items-center gap-1'>
                <Trophy size={14} />
                <span className="text-sm">{points}</span>
            </div>


            <button
              onClick={handleCopyQuestion}
              className="p-1.5 text-secondary hover:text-secondary-light transition-colors"
              title="Salin soal"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 transition-colors ${
                isFavorite
                  ? 'text-primary'
                  : 'text-secondary hover:text-secondary-light'
              }`}
              title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            >
              <Star size={16} className={isFavorite ? 'fill-primary' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && currentImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg z-10"
              title="Tutup"
            >
              <X size={20} />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-3 left-3 flex gap-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(prev => Math.min(prev + 0.2, 2));
                }}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                title="Zoom in"
              >
                <ZoomIn size={18} className="text-secondary" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(prev => Math.max(prev - 0.2, 1));
                }}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                title="Zoom out"
              >
                <ZoomOut size={18} className="text-secondary" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(1);
                }}
                className="px-3 py-2 bg-white/90 hover:bg-white rounded-full shadow-lg text-xs font-medium text-secondary"
                title="Reset zoom"
              >
                Reset
              </button>
            </div>

            {/* Image Container with Zoom */}
            <div className="relative w-full h-[80vh] overflow-auto bg-gray-50 flex items-center justify-center">
              <img
                src={currentImage}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="max-w-full transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel})`,
                  cursor: zoomLevel > 1 ? 'grab' : 'default'
                }}
              />
            </div>

            {/* Prev Button di Modal */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                  setZoomLevel(1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg z-10"
              >
                <ChevronLeft size={20} className="text-secondary" />
              </button>
            )}

            {/* Next Button di Modal */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                  setZoomLevel(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg z-10"
              >
                <ChevronRight size={20} className="text-secondary" />
              </button>
            )}

            {/* Image Info */}
            <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1.5 rounded text-xs font-medium">
              <p>Gambar {currentImageIndex + 1} dari {images.length} (Zoom: {Math.round(zoomLevel * 100)}%)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

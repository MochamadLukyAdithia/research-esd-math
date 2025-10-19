interface CreatorCardProps {
  creator: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="bg-background shadow-md p-6">
      <div className="flex items-center gap-4">
        {creator.avatar ? (
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-14 h-14 rounded-lg border border-secondary flex items-center justify-center text-secondary text-lg font-bold`}
          >
            {getInitials(creator.name)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{creator.name}</p>
          <p className="text-sm text-gray-600 truncate">{creator.email}</p>
        </div>
      </div>
    </div>
  );
}

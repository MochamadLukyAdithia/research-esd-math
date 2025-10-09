import clsx from "clsx";
import { User as Profile } from '@/types';

interface UserAvatarProps {
    profile: Profile;
    size?: 'sm' | 'md';
}

export function UserAvatar({ profile, size = 'md' }: UserAvatarProps) {
    const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm" };

    return (
        <>
            {profile.avatar ? (
                <img
                    src={profile.avatar}
                    alt="User Avatar"
                    className={clsx("rounded-full border-2 border-secondary/20 object-cover", sizeClasses[size])}
                />
            ) : (
                <div className={clsx(
                    "rounded-full flex items-center justify-center font-bold",
                    sizeClasses[size],
                    "bg-secondary text-primary"
                )}>
                    {profile.name?.charAt(0).toUpperCase()}
                </div>
            )}
        </>
    );
}

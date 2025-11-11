<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

      
        $rank = $this->calculateUserRank($user);

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'userStats' => [
                'total_points' => $user->total_points,
                'questions_solved' => $user->questions_solved,
                'accuracy_rate' => $user->accuracy_rate,
                'rank' => $rank,
            ]
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id_user . ',id_user'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    // Method untuk menghitung rank user
    private function calculateUserRank(User $user): ?int
    {
        $usersWithPoints = User::withSum('points', 'points_earned')
            ->has('points')
            ->orderBy('points_sum_points_earned', 'desc')
            ->get();

        $rank = $usersWithPoints->search(function ($userItem) use ($user) {
            return $userItem->id_user === $user->id_user;
        });

        return $rank !== false ? $rank + 1 : null;
    }
}

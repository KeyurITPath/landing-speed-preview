"use server"
import { cookies } from "next/headers"

export const setCourseFinalURL = async (final_url: any) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'final_url',
        value: final_url,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

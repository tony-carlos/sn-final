// middleware.js
import { NextResponse } from 'next/server';
import { auth } from './lib/firebase'; 
import { getAuth } from 'firebase/auth';

export function middleware(req) {
    const user = getAuth().currentUser;

    // Protect admin and operator routes
    const protectedRoutes = ['/admin/dashboard', '/operator/dashboard'];

    if (protectedRoutes.includes(req.nextUrl.pathname) && !user) {
        return NextResponse.redirect('/login');
    }

    return NextResponse.next();
}

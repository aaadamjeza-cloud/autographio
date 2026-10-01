import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/moje-sbirka(.*)", "/moje-zadosti(.*)", "/nastaveni(.*)", "/vitej(.*)"]);

export const proxy = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      const loginUrl = new URL("/prihlaseni", request.url);
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

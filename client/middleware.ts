import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { baseurl } from "@/utils/config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refresh_token");
  const response = NextResponse.next();

  const res = await fetch(baseurl + "/users/validate", {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(async (res) => {
      const data = await res.json();
      response.cookies.set("access_token", data.access_token); // hasil res body token diset
      return data;
    })
    .catch((err) => {
      return false;
    });

  const validate = res.message == "success" ? true : false;

  const is_verified = res.is_verified;

  if (validate && !is_verified && pathname != "/verification") {
    return NextResponse.redirect(new URL("/verification", request.url));
  } else if (
    (pathname == "/" || pathname.startsWith("/profile")) &&
    !validate
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } else if (
    (pathname.startsWith("/auth") || pathname == "/verification") &&
    is_verified
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/auth/:path*", "/profile/:path*", "/", "/verification"],
};

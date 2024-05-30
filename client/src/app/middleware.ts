import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { baseurl } from "@/utils/config";
import { jwtDecode } from "jwt-decode";
import { TUser } from "@/models/user.model";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = String(request.cookies.get("refresh_token"));
  const response = NextResponse.next();

  const res = await fetch(baseurl + "/users/v3", {
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

  const is_verified = res.isVerified;

  const decode = token
    ? (jwtDecode(token) as { user: TUser; type: string })
    : undefined;

  // const is_verified = decode ? decode.user.isVerified : false;

  const isBuyer = decode?.user.role === "buyer" ? true : false;

  if (
    (validate && isBuyer && pathname == "/users/v1") ||
    pathname == "/users/v2"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (
    (validate && !isBuyer && pathname == "/users/v1") ||
    pathname == "/users/v2"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (validate && isBuyer && pathname == "/dashboard") {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (validate && !isBuyer && pathname == "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}

/*
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
*/

export const config = {
  // matcher: ["/auth/:path*", "/profile/:path*", "/", "/verification"],
  matcher: [],
};

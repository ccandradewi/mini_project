import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { baseurl } from "@/utils/config";
import { jwtDecode } from "jwt-decode";
import { TUser } from "@/models/user.model";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refresh_token")?.value || "";

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
      console.log(res.status);

      if (res.status != 200) throw new Error("");
      const data = await res.json();
      response.cookies.set("access_token", data.access_token);
      return data;
    })
    .catch((err) => {
      return false;
    });

  const access_token = response.cookies.get("access_token")?.value || "";
  let decode = undefined;
  let isBuyer = false;
  let is_verified = false;
  try {
    decode = jwtDecode(access_token) as TUser;
    console.log(decode, "ini decode");

    isBuyer = decode.role === "buyer" && true;
    is_verified = decode.isVerified!;
  } catch (error) {}

  const validate = res ? true : false;
  console.log(res, validate, is_verified);

  if (pathname == "/" && validate && is_verified && !isBuyer) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (pathname == "/dashboard" && !validate) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (
    validate &&
    (pathname == "/" || pathname == "/dashboard") &&
    !is_verified
  )
    return NextResponse.redirect(new URL("/verification", request.url));
  else if (pathname == "/dashboard" && validate && isBuyer) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (validate && pathname.startsWith("/auth")) {
    if (!isBuyer)
      return NextResponse.redirect(new URL("/dashboard", request.url));

    return NextResponse.redirect(new URL("/", request.url));
  } else if (validate && pathname == "/verification" && is_verified) {
    if (!isBuyer)
      return NextResponse.redirect(new URL("/dashboard", request.url));

    return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}

//   } else if (validate && isBuyer && pathname == "/dashboard") {
//     return NextResponse.redirect(new URL("/", request.url));
//   } else if (validate && !isBuyer && pathname == "/") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
//   return response;
// }

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

// export const config = {
//   // matcher: ["/auth/:path*", "/profile/:path*", "/", "/verification"],
//   matcher: [],
// };

// export const config = {
//   matcher: ["/auth/:path*", "/dashboard", "/"],
// };
// };

export const config = {
  matcher: ["/", "/auth/:path*", "/verification", "/dashboard"],
};

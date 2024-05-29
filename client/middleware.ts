import { NextFunction } from "next/server";
import { NextRequest } from "next/server";
import { baseurl } from "/./utils/config";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("refresh_token")
}

export { default } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export async function middleware(request: NextRequest) {
  const url = request.url;
  const token = await getToken({ req: request });
  const auth = token?.Role;
  // console.log(token, auth);
  if (token && url.includes("/account")) {
    if (
      auth === "teacher" ||
      url.includes("/staff") ||
      url.includes("/adminPages")
    ) {
      return NextResponse.redirect(new URL("/pages/Teacher", request.url));
    } else if (
      auth === "staff" ||
      url.includes("/Teacher") ||
      url.includes("/adminPages")
    ) {
      return NextResponse.redirect(new URL("/pages/staff", request.url));
    } else if (
      auth === "adminAccount" ||
      url.includes("/staff") ||
      url.includes("/Teacher")
    ) {
      return NextResponse.redirect(new URL("/pages/adminPages", request.url));
    }
  } else if (
    !token &&
    (url.includes("/adminPages") ||
      url.includes("/Teacher") ||
      url.includes("/staff"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

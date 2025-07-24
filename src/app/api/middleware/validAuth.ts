import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function validateAuth(
  req: NextRequest
): Promise<{ userId: string } | NextResponse> {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Token missing in cookies" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secure-jwt-secret") as {
      id: string;
    };

    return { userId: decoded.id };
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired token" },
      { status: 401 }
    );
  }
}

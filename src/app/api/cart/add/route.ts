import { NextRequest, NextResponse } from "next/server";
import { CartUsecases } from "@/core/usecases/Cart.usecases";
import { CartRepository } from "@/core/repositories/ICartRepository";
import { validateAuth } from "../../middleware/validAuth";
import { AddToCartDTO } from "@/core/dtos/Cart.dto";

const cartUsecases = new CartUsecases(new CartRepository());

export async function POST(req: NextRequest) {
  const auth = await validateAuth(req);

  if (auth instanceof NextResponse) return auth;

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = auth.userId;

  let dto: AddToCartDTO;
  try {
    const body = await req.json();
    if (!body.productVariationId || typeof body.quantity !== 'number' || body.quantity <= 0) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }
    dto = body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const cart = await cartUsecases.addToCart(dto, userId);
    return NextResponse.json(cart, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}


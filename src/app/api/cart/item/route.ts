import { NextRequest, NextResponse } from "next/server";
import { CartUsecases } from "@/core/usecases/Cart.usecases";
import { CartRepository } from "@/core/repositories/ICartRepository";
import { validateAuth } from "../../middleware/validAuth";
import { UpdateCartItemDTO, RemoveFromCartDTO } from "@/core/dtos/Cart.dto";

const cartUsecases = new CartUsecases(new CartRepository());

export async function PUT(req: NextRequest) {
  const auth = await validateAuth(req);
  if (auth instanceof NextResponse) return auth;

  let dto: UpdateCartItemDTO;
  try {
    const body = await req.json();
    if (!body.cartItemId || typeof body.quantity !== "number") {
      return NextResponse.json({ error: "Invalid cartItemId or quantity" }, { status: 400 });
    }
    dto = body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const cart = await cartUsecases.updateCartItem(dto);
    return NextResponse.json(cart, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await validateAuth(req);
  if (auth instanceof NextResponse) return auth;

  let dto: RemoveFromCartDTO;
  try {
    const body = await req.json();
    if (!body.cartItemId) {
      return NextResponse.json({ error: "Invalid cartItemId" }, { status: 400 });
    }
    dto = body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const cart = await cartUsecases.removeCartItem(dto);
    return NextResponse.json(cart, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}

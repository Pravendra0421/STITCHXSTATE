import { NextRequest, NextResponse } from "next/server";
import { AddToCartDTO, UpdateCartItemDTO, RemoveFromCartDTO } from "@/core/dtos/Cart.dto";

type DTOResult =
  | { dto: AddToCartDTO | UpdateCartItemDTO | RemoveFromCartDTO }
  | NextResponse;

export async function validateDTO(
  req: NextRequest,
  dtoType: "AddToCartDTO" | "UpdateCartItemDTO" | "RemoveFromCartDTO" | null
): Promise<DTOResult> {
  if (dtoType === null) return { dto: {} as any };

  const dto = await req.json();

  if (!dto) {
    return NextResponse.json({ error: "Request body is required" }, { status: 400 });
  }

  if (dtoType === "AddToCartDTO") {
    if (!dto.productVariationId || typeof dto.quantity !== "number" || dto.quantity <= 0) {
      return NextResponse.json({ error: "Invalid productVariationId or quantity" }, { status: 400 });
    }
  } else if (dtoType === "UpdateCartItemDTO") {
    if (!dto.cartItemId || typeof dto.quantity !== "number") {
      return NextResponse.json({ error: "Invalid cartItemId or quantity" }, { status: 400 });
    }
  } else if (dtoType === "RemoveFromCartDTO") {
    if (!dto.cartItemId) {
      return NextResponse.json({ error: "Invalid cartItemId" }, { status: 400 });
    }
  }

  return { dto }; // Return typed DTO
}

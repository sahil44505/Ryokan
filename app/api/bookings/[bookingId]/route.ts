import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  bookingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = params;

  if (!bookingId || typeof bookingId !== 'string') {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Delete the booking ensuring it belongs to the current user
  const booking = await prisma.bookings.deleteMany({
    where: {
      id: bookingId,
      userId: currentUser.id
    }
  });

  return NextResponse.json(booking);
}
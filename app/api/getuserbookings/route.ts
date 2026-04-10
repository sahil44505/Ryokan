import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    // 1. Check if user is logged in
    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch bookings with sorting
    const bookings = await prisma.bookings.findMany({
      where: {
        userId: currentUser.id, 
      },
      // Added ordering so the most recent bookings show up at the top
      orderBy: {
        createdAt: 'desc' 
      },
      select: {
        id: true, // Useful for React keys on the frontend
        Image: true,
        title: true,
        ratings: true,
        totalPrice: true,
        startDate: true,
        endDate: true,
        gps_coordinates: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("GET_BOOKINGS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
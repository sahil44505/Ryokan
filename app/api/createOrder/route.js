import { Cashfree } from "cashfree-pg";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";

// Initialize once outside the handler
Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY; // Keep secret on server only
Cashfree.XEnvironment = process.env.NEXT_PUBLIC_CASHFREE_APP_MODE;

const EXCHANGE_RATE = 86;

export async function POST(req) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { bookingDetails } = body;
    const baseUrl =  "https://sandbox.cashfree.com/pg/orders"

    if (!bookingDetails?.price) {
      return NextResponse.json({ error: "Missing booking details" }, { status: 400 });
    }

    // Extract price from string (e.g., "₹ 5,000" -> 5000)
    const Price = Number(bookingDetails.price.replace(/[^0-9.-]+/g, ""));
    
    const orderData = {
      order_amount: Price,
      order_currency: "INR",
      order_id: `order_${Date.now()}`, // Generate unique ID
      customer_details: {
        customer_id: user?.id || "guest_user",
        customer_name: user?.firstName || "Guest",
        customer_email: user?.email || "guest@example.com",
        customer_phone: "9999999999", // Ideally get this from user profile
      },
      order_meta: {
        // Use environment variable for base URL in production
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-status?order_id={order_id}`,
      },
      order_tags: {
        room_name: bookingDetails.roomName.substring(0, 50),
        guests: String(bookingDetails.guests),
        rooms: String(bookingDetails.rooms)
      },
      order_note: `Booking for ${bookingDetails.roomName}`,
    };

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_APP_ID,
        "x-client-secret": process.env.NEXT_PUBLIC_CASHFREE_SECRET_KEY,
        "x-api-version": "2023-08-01", 
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Cashfree API Rejection:", result);
      return NextResponse.json(
        { error: result.message || "Cashfree rejected the request" }, 
        { status: response.status }
      );
    }

    // 5. Success! Return the full object (contains payment_session_id)
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("Cashfree Order Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || "Payment initiation failed" },
      { status: 500 }
    );
  }
}
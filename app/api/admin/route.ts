import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/app/api/dbconfigs/mongose";
import User from "@/app/api/models/user";

export const POST = async (request: NextRequest) => {
  await connectMongo();
  const { action, id, name, email, password, type, phone } =
    await request.json();
  if (action == "fetch") {
    const users = await User.find({});
    return NextResponse.json(users);
  }

  try {
    if (action === "create") {
      const newUser = new User({
        name,
        email,
        password: password,
        type,
        phone,
      });

      await newUser.save();
      return NextResponse.json({ message: "User created successfully" });
    } else if (action === "update") {
      await User.findByIdAndUpdate(id, { name, email, type, phone });
      return NextResponse.json({ message: "User updated successfully" });
    } else if (action === "delete") {
      await User.findByIdAndDelete(id);
      return NextResponse.json({ message: "User deleted successfully" });
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error handling request", error },
      { status: 500 }
    );
  }
};

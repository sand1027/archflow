import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/schema/user";
import connectDB from "@/lib/mongodb";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    return user ? {
      userId: user._id.toString(),
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      }
    } : null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function requireAuth() {
  const auth = await getCurrentUser();
  
  if (!auth) {
    throw new Error("Unauthorized");
  }
  
  return auth;
}
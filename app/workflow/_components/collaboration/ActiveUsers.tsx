"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CollaborationUser } from "@/lib/types";

interface ActiveUsersProps {
  users: CollaborationUser[];
}

export function ActiveUsers({ users }: ActiveUsersProps) {
  return (
    <div className="p-2 border-b">
      <h4 className="text-sm font-medium mb-2">Active Users</h4>
      <div className="space-y-1">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-xs">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs flex-1">{user.name}</span>
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
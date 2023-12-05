import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
  members: (Member & {
    profile: Profile;
  })[];
};

import { Server as NetServer, Socket } from "net";
import { NextResponse } from "next/server";
import { Server as SocketIoServer } from "socket.io";

export type NextResponseServerIo = NextResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};

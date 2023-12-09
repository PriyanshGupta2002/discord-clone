import { Member, Profile, Server } from "@prisma/client";

export type ServerWithMembersWithProfile = Server & {
  members: (Member & {
    profile: Profile;
  })[];
};

import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";

export type NextResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};

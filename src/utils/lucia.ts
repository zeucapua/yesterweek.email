import { Lucia } from "lucia";
import { db, User, Session } from "astro:db";
import { AstroDBAdapter } from "lucia-adapter-astrodb";

const adapter = new AstroDBAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: { 
      secure: import.meta.env.PROD
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    }
  }
});

interface DatabaseUserAttributes { 
  username: string
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
};

import { eq, db, User } from "astro:db";
import { lucia } from "../../utils/lucia";
import { Argon2id } from "oslo/password";
import type { APIContext } from "astro";

export async function POST(context: APIContext) : Promise<Response> {
  const form_data = await context.request.formData();
  const username = form_data.get("username") as string;
  const password = form_data.get("password") as string;

  const [existing_user] = await db.select().from(User).where(eq(User.username, username));

  if (!existing_user) {
    return new Response("Incorrect username or password", { status: 400 });
  }

  const valid_password = await new Argon2id().verify(existing_user.hashed_password, password);
  if (!valid_password) {
    return new Response("Incorrect username or password", { status: 400 });
  }

  const session = await lucia.createSession(existing_user.id, {});
  const session_cookie = lucia.createSessionCookie(session.id);
  context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);

  return context.redirect("/admin");
}

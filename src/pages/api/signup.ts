import { User, db } from "astro:db";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { lucia } from "../../utils/lucia";
import type { APIContext } from "astro";

export async function POST(context: APIContext) : Promise<Response> {
  const form_data = await context.request.formData();
  const secret = form_data.get("secret") as string;

  console.log(import.meta.env.ADMIN_SIGN_UP_SECRET, secret);

  if (secret !== import.meta.env.ADMIN_SIGN_UP_SECRET) {
    return new Response("Invalid secret answer", { status: 400 });
  }

  const username = form_data.get("username");

  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Response("Invalid username", { status: 400 });
  }

  const password = form_data.get("password");
  
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return new Response("Invalid password", { status: 400 });
  }

  const user_id = generateId(15);
  const hashed_password = await new Argon2id().hash(password);

  await db.insert(User).values({
    id: user_id,
    username: username,
    hashed_password: hashed_password
  });

  const session = await lucia.createSession(user_id, {});
  const session_cookie = lucia.createSessionCookie(session.id);
  context.cookies.set(session_cookie.name, session_cookie.value, session_cookie.attributes);

  return context.redirect("/admin");
}

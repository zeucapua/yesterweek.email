import { db, Issue, EditorsNote } from "astro:db";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const headline = formData.get("headline") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  console.log({ headline, title, description });
  const [editorsNote] = await db.insert(EditorsNote).values({
    description
  }).returning();


  const [issue] = await db.insert(Issue).values({
    headline,
    editorsNote: editorsNote.id
  }).returning();

  console.log({ issue, editorsNote });

  return new Response(
    JSON.stringify({
      message: "hi"
    }), {
      status: 201
    }
  );
}

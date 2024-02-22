import { Button, Html, Tailwind } from "@react-email/components";

export default function NewsletterEmail() {
  return (
    <Html>
      <Tailwind>
        <Button
          href="https://twitter.com/zeu_dev"
          className="font-sans rounded-xl w-full h-fit text-center py-4 bg-white text-orange-500"
        >
          Click me  
        </Button>
      </Tailwind>
    </Html>
  );
}


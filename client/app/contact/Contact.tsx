"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const supabase = createClient();

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.from("messages").insert([{ name, email, message }]);
    setName("");
    setEmail("");
    setMessage("");

    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="flex flex-col items-start gap-6 mt-12">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold md:text-3xl">Get in Touch</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Have a question or want to work together? Fill out the form below and
          we&apos;ll get back to you as soon as possible.
        </p>
      </div>
      <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button
          className="w-full"
          disabled={!name || !email || !message}
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

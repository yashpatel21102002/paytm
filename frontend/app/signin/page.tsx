"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

//we will define the formscema here
const formSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must be less than 30 characters",
    })
    .trim()
    .email(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .trim(),
});

function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    console.log(values);
    await axios
      .post("http://localhost:8000/api/v1/user/sign-in", values)
      .then((response) => {
        console.log(response);

        router.push(`/dashboard`);

        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.data.token);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
        toast({
          description: error.response.data.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl font-bold mb-10">
          Sign In - Hey There! Welcome Back.
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-1/4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="abc@gmail.com"
                      {...field}
                      className="shadow-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      {...field}
                      className="shadow-md"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
            <h2 className="text-center">
              Do not have an account?{" "}
              <Link href="/signup" className="underline font-bold">
                SignUp
              </Link>
            </h2>
          </form>
        </Form>
      </div>
    </>
  );
}

export default Page;

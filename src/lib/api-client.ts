"use server";
import { auth } from "@/auth";

// utils/apiClient.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const defaultHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, // TODO - See how to do with JWT
};

const apiClient = async ({
  endpoint,
  method = "GET",
  body,
  headers = {},
}: {
  endpoint: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
}) => {
  const session = await auth();
  const accessToken = session?.accessToken;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
      // token
      Authorization: `Bearer ${accessToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // if (!response.ok) {
  //   const errorData = await response.json();
  //   console.log({ errorData });
  //   return;
  //   // throw new Error(errorData.message || "Something went wrong!");
  // }

  return await response.json();
};

export default apiClient;

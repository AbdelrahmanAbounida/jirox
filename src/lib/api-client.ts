"use server";
import { auth } from "@/auth";

// utils/apiClient.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const apiClient = async ({
  endpoint,
  method = "GET",
  body,
  headers = {},
  isForm = false,
}: {
  endpoint: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  isForm?: boolean;
}) => {
  const session = await auth();
  const accessToken = session?.accessToken;
  var defaultHeaders = {};

  if (!isForm) {
    defaultHeaders = { ...defaultHeaders, "Content-Type": "application/json" };
  }
  const mainHeaders = {
    ...defaultHeaders,
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
  console.log({ mainHeaders });

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: mainHeaders,
    body: body ?? undefined,
  });
  return await response.json();
};

export default apiClient;

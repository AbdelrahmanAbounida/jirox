"use client";

import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/auth/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useRouter } from "next/navigation";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [tokenExists, settokenExists] = useState(false);
  const searchParams = useSearchParams();

  const router = useRouter();
  const token = searchParams.get("token");

  const onSubmit = () => {
    if (success || error || tokenExists) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    if (!tokenExists) {
      newVerification(token)
        .then((data) => {
          setSuccess(data.success);
          if (data.success) {
            settokenExists(true);
            router.push("/login");
          }
          setError(data.error);
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    }
  };

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

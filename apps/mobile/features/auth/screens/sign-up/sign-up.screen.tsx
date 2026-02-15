import { useState } from "react";
import type { RegisterRequest } from "../../api/auth.types";
import { useSignUp } from "../../mutations/use-sign-up.mutation";
import { StepCredentials } from "./step-credentials";
import { StepProfile } from "./step-profile";
import { StepBio } from "./step-bio";

type FormData = Partial<RegisterRequest>;

export function SignUpScreen() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const signUp = useSignUp();

  const updateAndNext = (data: Partial<RegisterRequest>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleSubmit = (data: { bio: string; location: string }) => {
    const fullData = { ...formData, ...data } as RegisterRequest;
    signUp.mutate(fullData);
  };

  switch (step) {
    case 0:
      return (
        <StepCredentials
          initialData={{
            email: formData.email ?? "",
            password: formData.password ?? "",
          }}
          onNext={updateAndNext}
        />
      );
    case 1:
      return (
        <StepProfile
          initialData={{
            userName: formData.userName ?? "",
            name: formData.name ?? "",
          }}
          onNext={updateAndNext}
          onBack={() => setStep(0)}
        />
      );
    case 2:
      return (
        <StepBio
          initialData={{
            bio: formData.bio ?? "",
            location: formData.location ?? "",
          }}
          onSubmit={handleSubmit}
          onBack={() => setStep(1)}
          isPending={signUp.isPending}
          error={signUp.error}
        />
      );
    default:
      return null;
  }
}

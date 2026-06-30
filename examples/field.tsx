"use client";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  useField,
} from "@/components/ui/field";

function FieldInput(props: React.ComponentProps<typeof Input>) {
  const { id, error } = useField();
  return (
    <Input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : `${id}-description`}
      {...props}
    />
  );
}

export function FieldDemo() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <Field required>
        <FieldLabel>Email address</FieldLabel>
        <FieldInput type="email" placeholder="you@example.com" />
        <FieldDescription>
          We'll only use this to send you updates.
        </FieldDescription>
      </Field>

      <Field error="Please enter a valid email address." required>
        <FieldLabel>Email address</FieldLabel>
        <FieldInput type="email" defaultValue="not-an-email" />
        <FieldDescription>
          We'll only use this to send you updates.
        </FieldDescription>
        <FieldError />
      </Field>
    </div>
  );
}

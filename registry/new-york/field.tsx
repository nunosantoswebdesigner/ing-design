"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FieldContextValue = {
  id: string;
  error?: string;
  required?: boolean;
};

const FieldContext = React.createContext<FieldContextValue>({ id: "" });

function useField() {
  return React.useContext(FieldContext);
}

const Field = ({
  id: idProp,
  error,
  required,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  error?: string;
  required?: boolean;
}) => {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  return (
    <FieldContext.Provider value={{ id, error, required }}>
      <div
        data-slot="field"
        data-invalid={error ? "" : undefined}
        className={cn("flex flex-col gap-1.5", className)}
        {...props}
      />
    </FieldContext.Provider>
  );
};

const FieldLabel = ({
  className,
  children,
  ...props
}: React.ComponentProps<"label">) => {
  const { id, error, required } = React.useContext(FieldContext);

  return (
    <label
      data-slot="field-label"
      htmlFor={id}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        error && "text-destructive",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </label>
  );
};

const FieldDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  const { id } = React.useContext(FieldContext);

  return (
    <p
      data-slot="field-description"
      id={`${id}-description`}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

const FieldError = ({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) => {
  const { id, error } = React.useContext(FieldContext);
  const message = children ?? error;

  if (!message) return null;

  return (
    <p
      data-slot="field-error"
      id={`${id}-error`}
      role="alert"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
};

export { Field, FieldLabel, FieldDescription, FieldError, useField };

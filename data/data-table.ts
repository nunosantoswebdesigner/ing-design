export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

export const data: Payment[] = [
  { amount: 100, email: "m@example.com", id: "728ed52f", status: "pending" },
  {
    amount: 125,
    email: "example@gmail.com",
    id: "489e1d42",
    status: "processing",
  },
  {
    amount: 250,
    email: "success@acme.com",
    id: "8ab531a9",
    status: "success",
  },
  { amount: 90, email: "info@company.io", id: "3cd492e8", status: "failed" },
  {
    amount: 300,
    email: "hello@startup.dev",
    id: "7ef5b31a",
    status: "success",
  },
  { amount: 45, email: "jane@corp.com", id: "2ba14c6e", status: "pending" },
  {
    amount: 180,
    email: "bob@example.org",
    id: "9fa72d1b",
    status: "processing",
  },
  { amount: 220, email: "alice@demo.net", id: "1ec38f7c", status: "success" },
];

"use client";

import { DataTable, type DataTableRow } from "@/components/ui/e-data-table";

const rows: DataTableRow[] = [
  // Page 1 — all 4 statuses visible
  { id: "1",  header: "Marco Odermatt",         avatarSrc: "https://i.pravatar.cc/40?img=3",  sectionType: "Giant Slalom", status: "in-process", target: 24, limit: 20, reviewer: "Helmut Krug" },
  { id: "2",  header: "Mikaela Shiffrin",        avatarSrc: "https://i.pravatar.cc/40?img=5",  sectionType: "Slalom",       status: "done",       target: 28, limit: 26, reviewer: "Mike Day" },
  { id: "3",  header: "Sofia Goggia",            avatarSrc: "https://i.pravatar.cc/40?img=10", sectionType: "Downhill",     status: "cancelled",  target: 18, limit: 12, reviewer: "M. Blardone" },
  { id: "4",  header: "Alexis Pinturault",       avatarSrc: "https://i.pravatar.cc/40?img=12", sectionType: "All-round",    status: "pending",    target: 22, limit: 18, reviewer: null },
  { id: "5",  header: "Lara Gut-Behrami",        avatarSrc: "https://i.pravatar.cc/40?img=9",  sectionType: "Super-G",      status: "done",       target: 20, limit: 17, reviewer: "M. Blardone" },
  { id: "6",  header: "Henrik Kristoffersen",    avatarSrc: "https://i.pravatar.cc/40?img=15", sectionType: "Slalom",       status: "in-process", target: 26, limit: 22, reviewer: "Helmut Krug" },
  { id: "7",  header: "Petra Vlhová",            avatarSrc: "https://i.pravatar.cc/40?img=11", sectionType: "Slalom",       status: "pending",    target: 24, limit: 20, reviewer: null },
  { id: "8",  header: "Corinne Suter",           avatarSrc: "https://i.pravatar.cc/40?img=8",  sectionType: "Downhill",     status: "done",       target: 16, limit: 14, reviewer: "M. Blardone" },
  { id: "9",  header: "Matthias Mayer",          avatarSrc: "https://i.pravatar.cc/40?img=20", sectionType: "Super-G",      status: "cancelled",  target: 14, limit: 10, reviewer: "Christian Pravda" },
  { id: "10", header: "Wendy Holdener",          avatarSrc: "https://i.pravatar.cc/40?img=13", sectionType: "All-round",    status: "done",       target: 22, limit: 20, reviewer: null },
  // Page 2
  { id: "11", header: "Loïc Meillard",           avatarSrc: "https://i.pravatar.cc/40?img=17", sectionType: "Giant Slalom", status: "in-process", target: 20, limit: 16, reviewer: "Helmut Krug" },
  { id: "12", header: "Federica Brignone",       avatarSrc: "https://i.pravatar.cc/40?img=16", sectionType: "All-round",    status: "done",       target: 24, limit: 22, reviewer: "M. Blardone" },
  { id: "13", header: "Vincent Kriechmayr",      avatarSrc: "https://i.pravatar.cc/40?img=22", sectionType: "Downhill",     status: "pending",    target: 18, limit: 14, reviewer: null },
  { id: "14", header: "Ragnhild Mowinckel",      avatarSrc: "https://i.pravatar.cc/40?img=19", sectionType: "Giant Slalom", status: "done",       target: 20, limit: 18, reviewer: "Mike Day" },
  { id: "15", header: "Clément Noël",            avatarSrc: "https://i.pravatar.cc/40?img=25", sectionType: "Slalom",       status: "in-process", target: 26, limit: 24, reviewer: "Helmut Krug" },
  { id: "16", header: "Marta Bassino",           avatarSrc: "https://i.pravatar.cc/40?img=18", sectionType: "Giant Slalom", status: "done",       target: 22, limit: 20, reviewer: "M. Blardone" },
  { id: "17", header: "Beat Feuz",               avatarSrc: "https://i.pravatar.cc/40?img=30", sectionType: "Downhill",     status: "cancelled",  target: 16, limit: 12, reviewer: "Christian Pravda" },
  { id: "18", header: "Tessa Worley",            avatarSrc: "https://i.pravatar.cc/40?img=21", sectionType: "Giant Slalom", status: "pending",    target: 20, limit: 16, reviewer: null },
  { id: "19", header: "Zan Kranjec",             avatarSrc: "https://i.pravatar.cc/40?img=33", sectionType: "Giant Slalom", status: "done",       target: 22, limit: 18, reviewer: "Helmut Krug" },
  { id: "20", header: "Katharina Liensberger",   avatarSrc: "https://i.pravatar.cc/40?img=23", sectionType: "Slalom",       status: "in-process", target: 24, limit: 20, reviewer: null },
];

export function DataTableDemo() {
  return <DataTable rows={rows} />;
}

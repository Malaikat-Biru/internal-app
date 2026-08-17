import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  CreditCard,
  Eye,
  MoreHorizontal,
  Search,
  UserPlus,
  Users,
} from "lucide-react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* -------------------------------------------------------------------------- */
/*                                  MOCK DATA                                 */
/* -------------------------------------------------------------------------- */

const usersData = [
  {
    id: "USR-0001",
    name: "Rafi Asshiddiqie",
    email: "rafi@example.com",
    plan: "ULTIMATE",
    status: "ACTIVE",
    characters: 3,
    registeredAt: "2026-07-12",
    lastActiveAt: "2026-08-08 15:42",
  },
  {
    id: "USR-0002",
    name: "Abi Rachman",
    email: "abi@example.com",
    plan: "PLUS",
    status: "ACTIVE",
    characters: 2,
    registeredAt: "2026-07-18",
    lastActiveAt: "2026-08-08 14:21",
  },
  {
    id: "USR-0003",
    name: "Deriel Raditya",
    email: "deriel@example.com",
    plan: "FREE",
    status: "ACTIVE",
    characters: 1,
    registeredAt: "2026-07-21",
    lastActiveAt: "2026-08-08 11:05",
  },
  {
    id: "USR-0004",
    name: "Kuro Neko",
    email: "kuro@example.com",
    plan: "FREE",
    status: "INACTIVE",
    characters: 0,
    registeredAt: "2026-07-22",
    lastActiveAt: "2026-07-29 19:32",
  },
  {
    id: "USR-0005",
    name: "Mika Aoi",
    email: "mika@example.com",
    plan: "ULTIMATE",
    status: "ACTIVE",
    characters: 4,
    registeredAt: "2026-07-24",
    lastActiveAt: "2026-08-08 10:17",
  },
  {
    id: "USR-0006",
    name: "Akira",
    email: "akira@example.com",
    plan: "PLUS",
    status: "ACTIVE",
    characters: 2,
    registeredAt: "2026-07-26",
    lastActiveAt: "2026-08-07 22:11",
  },
  {
    id: "USR-0007",
    name: "Shiro",
    email: "shiro@example.com",
    plan: "FREE",
    status: "INACTIVE",
    characters: 1,
    registeredAt: "2026-07-27",
    lastActiveAt: "2026-08-01 13:24",
  },
  {
    id: "USR-0008",
    name: "Reina",
    email: "reina@example.com",
    plan: "FREE",
    status: "ACTIVE",
    characters: 1,
    registeredAt: "2026-07-30",
    lastActiveAt: "2026-08-08 09:42",
  },
  {
    id: "USR-0009",
    name: "Haru",
    email: "haru@example.com",
    plan: "PLUS",
    status: "ACTIVE",
    characters: 2,
    registeredAt: "2026-08-01",
    lastActiveAt: "2026-08-08 08:15",
  },
  {
    id: "USR-0010",
    name: "Sora",
    email: "sora@example.com",
    plan: "FREE",
    status: "ACTIVE",
    characters: 1,
    registeredAt: "2026-08-02",
    lastActiveAt: "2026-08-07 23:38",
  },
  {
    id: "USR-0011",
    name: "Yuki",
    email: "yuki@example.com",
    plan: "ULTIMATE",
    status: "ACTIVE",
    characters: 5,
    registeredAt: "2026-08-03",
    lastActiveAt: "2026-08-08 12:43",
  },
  {
    id: "USR-0012",
    name: "Ren",
    email: "ren@example.com",
    plan: "FREE",
    status: "INACTIVE",
    characters: 0,
    registeredAt: "2026-08-04",
    lastActiveAt: "2026-08-04 18:20",
  },
  {
    id: "USR-0013",
    name: "Astra",
    email: "astra@example.com",
    plan: "PLUS",
    status: "ACTIVE",
    characters: 3,
    registeredAt: "2026-08-04",
    lastActiveAt: "2026-08-08 13:11",
  },
  {
    id: "USR-0014",
    name: "Nia",
    email: "nia@example.com",
    plan: "FREE",
    status: "ACTIVE",
    characters: 1,
    registeredAt: "2026-08-05",
    lastActiveAt: "2026-08-08 07:58",
  },
  {
    id: "USR-0015",
    name: "Kazuki",
    email: "kazuki@example.com",
    plan: "ULTIMATE",
    status: "ACTIVE",
    characters: 2,
    registeredAt: "2026-08-06",
    lastActiveAt: "2026-08-08 15:02",
  },
];

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function UsersPage() {
  const navigate = useNavigate();

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    return usersData.filter((user) => {
      const matchPlan =
        planFilter === "ALL" || user.plan === planFilter;

      const matchStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchPlan && matchStatus;
    });
  }, [planFilter, statusFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label="User"
          />
        ),
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar name={user.name} />

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/users/${user.id}`)
                  }
                  className="block max-w-[220px] cursor-pointer truncate text-left text-[13px] font-medium text-foreground transition-colors hover:text-primary"
                >
                  {user.name}
                </button>

                <p className="mt-0.5 max-w-[220px] truncate text-[11px] text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "plan",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label="Plan"
          />
        ),
        cell: ({ row }) => (
          <PlanBadge plan={row.original.plan} />
        ),
      },

      {
        accessorKey: "status",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label="Status"
          />
        ),
        cell: ({ row }) => (
          <StatusBadge status={row.original.status} />
        ),
      },

      {
        accessorKey: "characters",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label="Characters"
          />
        ),
        cell: ({ row }) => (
          <p className="text-[13px] text-foreground">
            {row.original.characters}
          </p>
        ),
      },

      {
        accessorKey: "registeredAt",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label="Registered"
          />
        ),
        cell: ({ row }) => (
          <p className="whitespace-nowrap text-[12px] text-muted-foreground">
            {formatDate(row.original.registeredAt)}
          </p>
        ),
      },

      {
        accessorKey: "lastActiveAt",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label="Last Active"
          />
        ),
        cell: ({ row }) => (
          <LastActive value={row.original.lastActiveAt} />
        ),
      },

      {
        id: "actions",
        enableSorting: false,
        header: "",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 cursor-pointer"
                    />
                  }
                >
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/users/${user.id}`)
                      }
                    >
                      <Eye className="size-4" />
                      Lihat detail
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                      <CreditCard className="size-4" />
                      Subscription
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [navigate],
  );

  const table = useReactTable({
    data: filteredData,
    columns,

    state: {
      sorting,
      globalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue
        .toLowerCase()
        .trim();

      if (!search) {
        return true;
      }

      const user = row.original;

      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search)
      );
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const totalUsers = usersData.length;

  const activeUsers = usersData.filter(
    (user) => user.status === "ACTIVE",
  ).length;

  const paidUsers = usersData.filter(
    (user) => user.plan !== "FREE",
  ).length;

  const usersWithCharacters = usersData.filter(
    (user) => user.characters > 0,
  ).length;

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-6 xl:px-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-medium text-primary">
            Account Management
          </p>

          <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
            Users
          </h1>

          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Pantau akun, aktivitas, character, dan subscription pengguna
            Malaikat Biru.
          </p>
        </div>

        <Button
  onClick={() => navigate("/users/create")}
  className="h-9 cursor-pointer gap-2 rounded-lg text-xs"
>
  <UserPlus className="size-4" />
  Add User
</Button>
      </div>

      {/* Metrics */}
      <section className="mt-6 grid grid-cols-4 gap-3">
        <UserMetric
          icon={Users}
          label="Total Users"
          value={totalUsers.toLocaleString()}
          description="Seluruh akun terdaftar"
        />

        <UserMetric
          icon={CircleCheck}
          label="Active Users"
          value={activeUsers.toLocaleString()}
          description="User yang masih aktif"
        />

        <UserMetric
          icon={CreditCard}
          label="Paid Users"
          value={paidUsers.toLocaleString()}
          description="Plus + Ultimate"
        />

        <UserMetric
          icon={Users}
          label="With Character"
          value={usersWithCharacters.toLocaleString()}
          description="Sudah membuat character"
        />
      </section>

      {/* Main User Table */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-[300px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={globalFilter}
                onChange={(event) =>
                  setGlobalFilter(event.target.value)
                }
                placeholder="Cari nama, email, atau user ID..."
                className="h-9 rounded-lg bg-background pl-9 text-xs"
              />
            </div>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(event) =>
                setPlanFilter(event.target.value)
              }
              className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none transition-colors hover:bg-muted/50 focus:border-primary focus:ring-3 focus:ring-primary/10"
            >
              <option value="ALL">
                Semua plan
              </option>

              <option value="FREE">
                Free
              </option>

              <option value="PLUS">
                Plus
              </option>

              <option value="ULTIMATE">
                Ultimate
              </option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-9 cursor-pointer rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none transition-colors hover:bg-muted/50 focus:border-primary focus:ring-3 focus:ring-primary/10"
            >
              <option value="ALL">
                Semua status
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>

          <p className="text-[11px] text-muted-foreground">
            {table.getFilteredRowModel().rows.length} users
          </p>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent"
                >
                  {headerGroup.headers.map(
                    (header) => (
                      <TableHead
                        key={header.id}
                        className="h-11 whitespace-nowrap text-[11px] font-medium text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef
                                .header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="group"
                  >
                    {row
                      .getVisibleCells()
                      .map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="h-[64px]"
                        >
                          {flexRender(
                            cell.column.columnDef
                              .cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-44"
                >
                  <EmptyUsers />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <p className="text-[11px] text-muted-foreground">
              Rows per page
            </p>

            <select
              value={
                table.getState().pagination
                  .pageSize
              }
              onChange={(event) => {
                table.setPageSize(
                  Number(event.target.value),
                );
              }}
              className="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-[11px] outline-none"
            >
              {[5, 10, 20, 50].map(
                (pageSize) => (
                  <option
                    key={pageSize}
                    value={pageSize}
                  >
                    {pageSize}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-[11px] text-muted-foreground">
              Page{" "}
              {table.getState().pagination
                .pageIndex + 1}{" "}
              of{" "}
              {Math.max(
                table.getPageCount(),
                1,
              )}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                type="button"
                disabled={!table.getCanPreviousPage()}
                onClick={() =>
                  table.previousPage()
                }
                className="size-8 cursor-pointer rounded-lg"
              >
                <ChevronLeft className="size-3.5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                type="button"
                disabled={!table.getCanNextPage()}
                onClick={() =>
                  table.nextPage()
                }
                className="size-8 cursor-pointer rounded-lg"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

function UserMetric({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <div>
          <p className="text-[11px] text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 text-xl font-semibold tracking-[-0.035em] text-foreground">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function UserAvatar({ name }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-semibold text-primary">
      {initials}
    </div>
  );
}

function PlanBadge({ plan }) {
  if (plan === "ULTIMATE") {
    return (
      <Badge className="border-primary/15 bg-primary/10 text-[10px] font-medium text-primary hover:bg-primary/10">
        Ultimate
      </Badge>
    );
  }

  if (plan === "PLUS") {
    return (
      <Badge
        variant="secondary"
        className="text-[10px] font-medium"
      >
        Plus
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="text-[10px] font-medium text-muted-foreground"
    >
      Free
    </Badge>
  );
}

function StatusBadge({ status }) {
  const active = status === "ACTIVE";

  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "size-1.5 rounded-full",
          active
            ? "bg-emerald-500"
            : "bg-muted-foreground/50",
        ].join(" ")}
      />

      <span
        className={[
          "text-[11px] font-medium",
          active
            ? "text-foreground"
            : "text-muted-foreground",
        ].join(" ")}
      >
        {active ? "Active" : "Inactive"}
      </span>
    </div>
  );
}

function LastActive({ value }) {
  const isToday =
    value.startsWith("2026-08-08");

  return (
    <div>
      <p className="whitespace-nowrap text-[12px] text-foreground">
        {isToday
          ? value.split(" ")[1]
          : formatDate(
              value.split(" ")[0],
            )}
      </p>

      <p className="mt-0.5 text-[10px] text-muted-foreground">
        {isToday ? "Hari ini" : "Last active"}
      </p>
    </div>
  );
}

function SortableHeader({
  column,
  label,
}) {
  const sort = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() =>
        column.toggleSorting(
          sort === "asc",
        )
      }
      className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-foreground"
    >
      {label}

      {sort === "asc" ? (
        <ArrowUp className="size-3" />
      ) : sort === "desc" ? (
        <ArrowDown className="size-3" />
      ) : (
        <ArrowUpDown className="size-3 opacity-50" />
      )}
    </button>
  );
}

function EmptyUsers() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <CircleX className="size-4" />
      </div>

      <p className="mt-3 text-xs font-medium text-foreground">
        User tidak ditemukan
      </p>

      <p className="mt-1 text-[11px] text-muted-foreground">
        Coba ubah keyword atau filter yang digunakan.
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
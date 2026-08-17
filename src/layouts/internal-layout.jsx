import { useState } from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Award,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  CircleDot,
  CreditCard,
  Database,
  FileMusic,
  Gem,
  LayoutDashboard,
  LogOut,
  Map,
  MapPinned,
  Package,
  ScrollText,
  Settings,
  Sparkles,
  Star,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Separator } from "@/components/ui/separator";

import {
  useCurrentUser,
  useLogout,
} from "@/features/auth/api/auth.query";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getInitials(username) {
  if (!username) {
    return "?";
  }

  return username
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatRole(role) {
  if (!role) {
    return "";
  }

  return role
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

/* -------------------------------------------------------------------------- */
/* NAVIGATION                                                                 */
/* -------------------------------------------------------------------------- */

const navigation = [
  {
    label: "Overview",
    roles: ["OWNER"],

    items: [
      {
        type: "item",
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    label: "Account",
    roles: ["OWNER"],

    items: [
      {
        type: "item",
        label: "Users",
        href: "/users",
        icon: Users,
      },

      {
        type: "item",
        label: "Subscriptions",
        href: "/subscriptions",
        icon: CreditCard,
      },
    ],
  },

  {
    label: "Aoi",
    roles: ["OWNER"],

    items: [
      {
        type: "item",
        label: "Tool Analytics",
        href: "/aoi/tools",
        icon: BarChart3,
      },

      {
        type: "item",
        label: "Data Analytics",
        href: "/aoi/data",
        icon: Database,
      },

      {
        type: "item",
        label: "Aoi AI",
        href: "/aoi/ai",
        icon: Bot,
      },
    ],
  },

  {
    label: "Data",
    roles: ["OWNER", "ADMIN"],

    items: [
      {
        type: "item",
        label: "Items",
        href: "/data/items",
        icon: Package,
      },

      {
        type: "item",
        label: "Monsters",
        href: "/data/monsters",
        icon: Sparkles,
      },

      {
        type: "item",
        label: "Crystas",
        href: "/data/crystas",
        icon: Gem,
      },

      {
        type: "dropdown",
        label: "Worlds",
        icon: Map,

        children: [
          {
            label: "Maps",
            href: "/data/worlds/maps",
            icon: MapPinned,
          },

          {
            label: "NPCs",
            href: "/data/worlds/npcs",
            icon: UserRound,
          },

          {
            label: "Side Quests",
            href: "/data/worlds/side-quests",
            icon: ScrollText,
          },

          {
            label: "BGM",
            href: "/data/worlds/bgms",
            icon: FileMusic,
          },
        ],
      },

      {
        type: "dropdown",
        label: "Character System",
        icon: UserRound,

        children: [
          {
            label: "Emblems",
            href: "/data/character-system/emblems",
            icon: Award,
          },

          {
            label: "Star Gems",
            href: "/data/character-system/star-gems",
            icon: Star,
          },

          {
            label: "Registlets",
            href: "/data/character-system/registlets",
            icon: CircleDot,
          },
        ],
      },
    ],
  },

  {
    label: "Platform",
    roles: ["OWNER", "ADMIN"],

    items: [
      {
        type: "item",
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* LAYOUT                                                                     */
/* -------------------------------------------------------------------------- */

export default function InternalLayout() {
  const {
    data: currentUser,
  } = useCurrentUser();

  const account =
    currentUser?.data ?? null;

  return (
    <>
      {/* ================================================================ */}
      {/* Unsupported Device                                               */}
      {/* ================================================================ */}

      <div className="flex h-dvh w-full items-center justify-center bg-background px-6 lg:hidden">
        <div className="w-full max-w-[420px] text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-muted/40 text-muted-foreground">
            <Wrench className="size-5" />
          </div>

          <h1 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-foreground">
            Gunakan laptop atau desktop
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Malaikat Biru Internal dirancang khusus untuk operasional melalui
            layar desktop.
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Desktop App                                                      */}
      {/* ================================================================ */}

      <div className="hidden h-dvh w-full overflow-hidden bg-background lg:block">
        <div className="grid h-full min-h-0 grid-cols-[240px_minmax(0,1fr)]">
          <Sidebar account={account} />

          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <Header account={account} />

            <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-muted/20">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* SIDEBAR                                                                    */
/* -------------------------------------------------------------------------- */

function Sidebar({
  account,
}) {
  const role = account?.role;

  const visibleNavigation =
    navigation.filter((group) => {
      if (!group.roles) {
        return true;
      }

      return group.roles.includes(role);
    });

  return (
    <aside className="flex min-h-0 flex-col border-r border-border bg-background">
      {/* ================================================================ */}
      {/* Brand                                                            */}
      {/* ================================================================ */}

      <div className="flex h-[68px] shrink-0 items-center px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <span className="text-[13px] font-semibold">
              MB
            </span>
          </div>

          <div className="min-w-0 leading-none">
            <p className="truncate text-[14px] font-semibold tracking-[-0.025em] text-foreground">
              Malaikat Biru
            </p>

            <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">
              Internal
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* ================================================================ */}
      {/* Navigation                                                       */}
      {/* ================================================================ */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-5">
          {visibleNavigation.map(
            (group) => (
              <NavigationGroup
                key={group.label}
                group={group}
              />
            ),
          )}
        </div>
      </nav>

      {/* ================================================================ */}
      {/* Sidebar Footer                                                   */}
      {/* ================================================================ */}

      <div className="shrink-0 border-t border-border p-3">
        <div className="rounded-xl bg-muted/45 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
              <Wrench className="size-3.5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-foreground">
                Malaikat Biru Internal
              </p>

              <p className="mt-1 truncate text-[9px] text-muted-foreground">
                Version 0.1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* NAVIGATION GROUP                                                           */
/* -------------------------------------------------------------------------- */

function NavigationGroup({
  group,
}) {
  return (
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80">
        {group.label}
      </p>

      <div className="space-y-0.5">
        {group.items.map((item) => {
          if (
            item.type === "dropdown"
          ) {
            return (
              <NavigationDropdown
                key={item.label}
                item={item}
              />
            );
          }

          return (
            <NavigationItem
              key={item.href}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* NORMAL NAVIGATION ITEM                                                     */
/* -------------------------------------------------------------------------- */

function NavigationItem({
  item,
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      end={item.href === "/"}
      className={({ isActive }) =>
        [
          "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors",

          isActive
            ? "bg-primary/[0.08] text-primary"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-primary" />
          )}

          <Icon
            className={[
              "size-[16px] shrink-0 transition-colors",

              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground",
            ].join(" ")}
            strokeWidth={1.9}
          />

          <span className="truncate">
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

/* -------------------------------------------------------------------------- */
/* DROPDOWN NAVIGATION                                                        */
/* -------------------------------------------------------------------------- */

function NavigationDropdown({
  item,
}) {
  const location = useLocation();

  const childIsActive =
    item.children.some((child) => {
      if (
        location.pathname === child.href
      ) {
        return true;
      }

      return (
        location.pathname.startsWith(
          `${child.href}/`,
        )
      );
    });

  const [
    manualOpen,
    setManualOpen,
  ] = useState(false);

  const open =
    childIsActive || manualOpen;

  const Icon = item.icon;

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-label={
          open
            ? `Tutup ${item.label}`
            : `Buka ${item.label}`
        }
        onClick={() =>
          setManualOpen(
            (current) => !current,
          )
        }
        className={[
          "group relative flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors",

          childIsActive
            ? "bg-primary/[0.08] text-primary"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        ].join(" ")}
      >
        {childIsActive && (
          <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-primary" />
        )}

        <Icon
          className={[
            "size-[16px] shrink-0 transition-colors",

            childIsActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground",
          ].join(" ")}
          strokeWidth={1.9}
        />

        <span className="min-w-0 flex-1 truncate text-left">
          {item.label}
        </span>

        <ChevronDown
          className={[
            "size-3.5 shrink-0 transition-transform duration-200",

            open
              ? "rotate-0"
              : "-rotate-90",
          ].join(" ")}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="ml-[17px] mt-1 space-y-0.5 border-l border-border/80 pl-3">
          {item.children.map(
            (child) => (
              <NavigationChildItem
                key={child.href}
                child={child}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CHILD NAVIGATION ITEM                                                      */
/* -------------------------------------------------------------------------- */

function NavigationChildItem({
  child,
}) {
  const Icon = child.icon;

  return (
    <NavLink
      to={child.href}
      end
      className={({ isActive }) =>
        [
          "group flex h-8 items-center gap-2 rounded-lg px-2 text-[12px] font-medium transition-colors",

          isActive
            ? "bg-primary/[0.06] text-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={[
              "size-[14px] shrink-0 transition-colors",

              isActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground",
            ].join(" ")}
            strokeWidth={1.8}
          />

          <span className="truncate">
            {child.label}
          </span>
        </>
      )}
    </NavLink>
  );
}

/* -------------------------------------------------------------------------- */
/* HEADER                                                                     */
/* -------------------------------------------------------------------------- */

function Header({
  account,
}) {
  const navigate = useNavigate();
  const logout = useLogout();

  const username =
    account?.username || "Internal User";

  const role =
    formatRole(account?.role);

  const initials =
    getInitials(username);

  async function handleLogout() {
    if (logout.isPending) {
      return;
    }

    try {
      await logout.mutateAsync();

      toast.success(
        "Berhasil keluar",
        {
          description:
            "Sesi internal telah diakhiri.",
        },
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        "Gagal keluar",
        {
          description:
            error?.message ||
            "Tidak dapat mengakhiri sesi.",
        },
      );
    }
  }

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-end gap-2 border-b border-border bg-background px-5 xl:px-6">
      {/* ================================================================ */}
      {/* Notification                                                     */}
      {/* ================================================================ */}

      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="relative size-9 cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
      >
        <Bell className="size-[16px]" />

        <span className="absolute right-[9px] top-[8px] size-1.5 rounded-full bg-primary ring-2 ring-background" />
      </Button>

      <div className="mx-1 h-6 w-px bg-border" />

      {/* ================================================================ */}
      {/* Profile Dropdown                                                 */}
      {/* ================================================================ */}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              className="h-11 cursor-pointer gap-2 rounded-xl px-2 hover:bg-muted"
            />
          }
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[10px] font-semibold text-primary-foreground">
            {initials}
          </div>

          <div className="hidden min-w-[72px] text-left xl:block">
            <p className="max-w-[120px] truncate text-[11px] font-medium leading-none text-foreground">
              {username}
            </p>

            <p className="mt-1.5 text-[9px] leading-none text-muted-foreground">
              {role}
            </p>
          </div>

          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-56"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="py-0.5">
                <p className="truncate text-xs font-medium text-foreground">
                  {username}
                </p>

                <p className="mt-1 truncate text-[11px] font-normal text-muted-foreground">
                  {account?.email || ""}
                </p>

                <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                  Malaikat Biru {role}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                navigate("/settings")
              }
            >
              <Settings className="size-4" />

              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={logout.isPending}
              className="cursor-pointer text-destructive focus:text-destructive disabled:cursor-not-allowed"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />

              {logout.isPending
                ? "Signing out..."
                : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import InternalLayout from "@/layouts/internal-layout";

import ProtectedRoute from "@/features/auth/components/protected-route";
import RoleRoute from "@/features/auth/components/role-route";

import LoginPage from "@/features/auth/pages/login-page";

import OverviewPage from "@/features/overview/page/overview-page";

import UsersPage from "@/features/users/pages/users-page";
import CreateUserPage from "@/features/users/pages/create-user-page";
import UserDetailPage from "@/features/users/pages/user-detail-page";

import SubscriptionsPage from "@/features/subscriptions/pages/subscriptions-page";
import AssignSubscriptionPage from "@/features/subscriptions/pages/assign-subscription-page";

import ToolAnalyticsPage from "@/features/aoi/tools/pages/tool-analytics-page";
import DataAnalyticsPage from "@/features/aoi/data/page/data-analytics-page";
import AoiAIPage from "@/features/aoi/ai/page/aoi-ai-page";

import SettingsPage from "@/features/settings/pages/settings-page";

import MapsPage from "@/features/data/maps/pages/maps-page";
import CreateMapPage from "@/features/data/maps/pages/create-map-page";
import MapDetailPage from "@/features/data/maps/pages/map-detail-page";
import EditMapPage from "@/features/data/maps/pages/edit-map-page";

import NpcsPage from "@/features/data/npcs/pages/npcs-page";
import CreateNpcPage from "@/features/data/npcs/pages/create-npc-page";
import EditNpcPage from "@/features/data/npcs/pages/edit-npc-page";
import NpcDetailPage from "@/features/data/npcs/pages/npc-detail-page";

import SideQuestsPage from "@/features/data/side-quests/pages/side-quests-page";
import CreateSideQuestPage from "@/features/data/side-quests/pages/create-side-quest-page";
import EditSideQuestPage from "@/features/data/side-quests/pages/edit-side-quest-page";
import SideQuestDetailPage from "@/features/data/side-quests/pages/side-quest-detail-page";

import BgmsPage from "@/features/data/bgms/pages/bgms-page";
import CreateBgmPage from "@/features/data/bgms/pages/create-bgm-page";
import EditBgmPage from "@/features/data/bgms/pages/edit-bgm-page";
import BgmDetailPage from "@/features/data/bgms/pages/bgm-detail-page";

import EmblemsPage from "@/features/data/emblems/pages/emblems-page";
import CreateEmblemPage from "@/features/data/emblems/pages/create-emblem-page";
import EditEmblemPage from "@/features/data/emblems/pages/edit-emblem-page";
import EmblemDetailPage from "@/features/data/emblems/pages/emblem-detail-page";

import MonstersPage from "@/features/data/monsters/pages/monsters-page";
import CreateMonsterPage from "@/features/data/monsters/pages/create-monster-page";
import EditMonsterPage from "@/features/data/monsters/pages/edit-monster-page";

import ItemsPage from "@/features/data/items/pages/items-page";
import CreateItemPage from "@/features/data/items/pages/create-item-page";
import EditItemPage from "@/features/data/items/pages/edit-item-page";
import ItemDetailPage from "@/features/data/items/pages/item-detail-page";

import CrystasPage from "@/features/data/crystas/pages/crystas-page";
import CreateCrystaPage from "@/features/data/crystas/pages/create-crysta-page";
import EditCrystaPage from "@/features/data/crystas/pages/edit-crysta-page";
import CrystaDetailPage from "@/features/data/crystas/pages/crysta-detail-page";

function PlaceholderPage({
  title,
  description,
}) {
  return (
    <div className="px-7 py-6 xl:px-8">
      <h1 className="text-2xl font-semibold tracking-[-0.035em] text-foreground">
        {title}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {description ||
          "Halaman ini akan dibuat selanjutnya."}
      </p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    element: <ProtectedRoute />,

    children: [
      {
        element: <InternalLayout />,

        children: [
          /* ============================================================ */
          /* OWNER ONLY                                                   */
          /* ============================================================ */

          {
            element: (
              <RoleRoute
                allowedRoles={["OWNER"]}
                redirectTo="/data/items"
              />
            ),

            children: [
              {
                index: true,
                element: <OverviewPage />,
              },

              /* Account */

              {
                path: "users",
                element: <UsersPage />,
              },

              {
                path: "users/create",
                element: <CreateUserPage />,
              },

              {
                path: "users/:userId",
                element: <UserDetailPage />,
              },

              {
                path: "subscriptions",
                element: <SubscriptionsPage />,
              },

              {
                path: "subscriptions/assign",
                element: <AssignSubscriptionPage />,
              },

              /* Aoi */

              {
                path: "aoi/tools",
                element: <ToolAnalyticsPage />,
              },

              {
                path: "aoi/data",
                element: <DataAnalyticsPage />,
              },

              {
                path: "aoi/ai",
                element: <AoiAIPage />,
              },
            ],
          },

          /* ============================================================ */
          /* OWNER + ADMIN                                                */
          /* ============================================================ */

          {
            path: "data",
            element: (
              <PlaceholderPage
                title="Database"
                description="Kelola database utama Aoi."
              />
            ),
          },

          /* Items */

          {
            path: "data/items",
            element: <ItemsPage />,
          },

          {
            path: "data/items/create",
            element: <CreateItemPage />,
          },

          {
            path: "data/items/:id/edit",
            element: <EditItemPage />,
          },

          {
            path: "data/items/:id",
            element: <ItemDetailPage />,
          },

          /* Monsters */

          {
            path: "data/monsters",
            element: <MonstersPage />,
          },

          {
            path: "data/monsters/create",
            element: <CreateMonsterPage />,
          },

          {
            path: "data/monsters/:id/edit",
            element: <EditMonsterPage />,
          },

          /* Crystas */

          {
            path: "data/crystas",
            element: <CrystasPage />,
          },

          {
            path: "data/crystas/create",
            element: <CreateCrystaPage />,
          },

          {
            path: "data/crystas/:id/edit",
            element: <EditCrystaPage />,
          },

          {
            path: "data/crystas/:id",
            element: <CrystaDetailPage />,
          },

          /* Worlds / Maps */

          {
            path: "data/worlds/maps",
            element: <MapsPage />,
          },

          {
            path: "data/worlds/maps/create",
            element: <CreateMapPage />,
          },

          {
            path: "data/worlds/maps/:id",
            element: <MapDetailPage />,
          },

          {
            path: "data/worlds/maps/:id/edit",
            element: <EditMapPage />,
          },

          /* Worlds / NPCs */

          {
            path: "data/worlds/npcs",
            element: <NpcsPage />,
          },

          {
            path: "data/worlds/npcs/create",
            element: <CreateNpcPage />,
          },

          {
            path: "data/worlds/npcs/:id/edit",
            element: <EditNpcPage />,
          },

          {
            path: "data/worlds/npcs/:id",
            element: <NpcDetailPage />,
          },

          /* Worlds / Side Quests */

          {
            path: "data/worlds/side-quests",
            element: <SideQuestsPage />,
          },

          {
            path: "data/worlds/side-quests/create",
            element: <CreateSideQuestPage />,
          },

          {
            path: "data/worlds/side-quests/:id/edit",
            element: <EditSideQuestPage />,
          },

          {
            path: "data/worlds/side-quests/:id",
            element: <SideQuestDetailPage />,
          },

          /* Worlds / BGM */

          {
            path: "data/worlds/bgms",
            element: <BgmsPage />,
          },

          {
            path: "data/worlds/bgms/create",
            element: <CreateBgmPage />,
          },

          {
            path: "data/worlds/bgms/:id/edit",
            element: <EditBgmPage />,
          },

          {
            path: "data/worlds/bgms/:id",
            element: <BgmDetailPage />,
          },

          /* Character System / Emblems */

          {
            path: "data/character-system/emblems",
            element: <EmblemsPage />,
          },

          {
            path: "data/character-system/emblems/create",
            element: <CreateEmblemPage />,
          },

          {
            path: "data/character-system/emblems/:id/edit",
            element: <EditEmblemPage />,
          },

          {
            path: "data/character-system/emblems/:id",
            element: <EmblemDetailPage />,
          },

          /* Data Health */

          {
            path: "data/health",
            element: (
              <PlaceholderPage
                title="Data Health"
                description="Pantau kelengkapan dan kesehatan data Aoi."
              />
            ),
          },

          /* Platform */

          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.13.2.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as advancedSettings from "../advancedSettings.js";
import type * as appointments from "../appointments.js";
import type * as clients from "../clients.js";
import type * as estimates from "../estimates.js";
import type * as files from "../files.js";
import type * as followUp from "../followUp.js";
import type * as http from "../http.js";
import type * as integrations from "../integrations.js";
import type * as invoices from "../invoices.js";
import type * as organizationMemberships from "../organizationMemberships.js";
import type * as organizationRoles from "../organizationRoles.js";
import type * as permissions from "../permissions.js";
import type * as roles from "../roles.js";
import type * as servicePackages from "../servicePackages.js";
import type * as services from "../services.js";
import type * as tenants from "../tenants.js";
import type * as transactions from "../transactions.js";
import type * as utils_logger from "../utils/logger.js";
import type * as utils_rateLimiter from "../utils/rateLimiter.js";
import type * as vehicleAssessments from "../vehicleAssessments.js";
import type * as webhooks from "../webhooks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  advancedSettings: typeof advancedSettings;
  appointments: typeof appointments;
  clients: typeof clients;
  estimates: typeof estimates;
  files: typeof files;
  followUp: typeof followUp;
  http: typeof http;
  integrations: typeof integrations;
  invoices: typeof invoices;
  organizationMemberships: typeof organizationMemberships;
  organizationRoles: typeof organizationRoles;
  permissions: typeof permissions;
  roles: typeof roles;
  servicePackages: typeof servicePackages;
  services: typeof services;
  tenants: typeof tenants;
  transactions: typeof transactions;
  "utils/logger": typeof utils_logger;
  "utils/rateLimiter": typeof utils_rateLimiter;
  vehicleAssessments: typeof vehicleAssessments;
  webhooks: typeof webhooks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

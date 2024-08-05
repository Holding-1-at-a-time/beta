// File: convex/files.ts

import { mutation, action, query } from "./_generated/server";
import { v } from "convex/values";
import { storageHelper } from "./storageHelper";

export const generateUploadUrl = mutation({
    args: { tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { tenantId } = args;
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveFile = mutation({
    args: {
        tenantId: v.id("tenants"),
        storageId: v.id("_storage"),
        fileName: v.string(),
        fileType: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, storageId, fileName, fileType } = args;
        return await ctx.db.insert("files", {
            tenantId,
            storageId,
            fileName,
            fileType,
            uploadedAt: new Date().toISOString(),
        });
    },
});

export const getSignedUrl = action({
    args: { fileId: v.id("files"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { fileId, tenantId } = args;
        const file = await ctx.runQuery(api.files.getById, { fileId, tenantId });
        if (!file) {
            throw new Error("File not found or unauthorized");
        }
        return await ctx.storage.getUrl(file.storageId);
    },
});

export const getById = query({
    args: { fileId: v.id("files"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { fileId, tenantId } = args;
        const file = await ctx.db.get(fileId);
        if (!file || file.tenantId !== tenantId) {
            throw new Error("File not found or unauthorized");
        }
        return file;
    },
});

export const deleteFile = mutation({
    args: { fileId: v.id("files"), tenantId: v.id("tenants") },
    handler: async (ctx, args) => {
        const { fileId, tenantId } = args;
        const file = await ctx.db.get(fileId);
        if (!file || file.tenantId !== tenantId) {
            throw new Error("File not found or unauthorized");
        }
        await ctx.storage.delete(file.storageId);
        await ctx.db.delete(fileId);
    },
});
import path from "path";
import express, { type Express } from "express";
import type { Server } from "http";

export async function setupVite(server: Server, app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "client", "dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

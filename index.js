var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// index.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var __defProp22 = Object.defineProperty;
var __name22 = /* @__PURE__ */ __name2((target, value) => __defProp22(target, "name", { value, configurable: true }), "__name");
var __defProp222 = Object.defineProperty;
var __name222 = /* @__PURE__ */ __name22((target, value) => __defProp222(target, "name", { value, configurable: true }), "__name");
var ALLOWED_ORIGINS = [
  "https://lessonlab.com.au",
  "https://www.lessonlab.com.au",
  "https://lessonlab-tau.vercel.app",
  "https://lessonlab-git-main-paddy-gallivans-projects.vercel.app"
];
function getCorsHeaders(request) {
  const origin = request ? request.headers.get("Origin") : null;
  const allowed = origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o)) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
__name2(getCorsHeaders, "getCorsHeaders");
__name22(getCorsHeaders, "getCorsHeaders");
var CORS_HEADERS = getCorsHeaders(null);
var VALID_SUBJECTS = ["literacy", "numeracy", "science", "pe", "visual-art", "music", "drama", "french", "digital_tech"];
var VALID_ADDONS = ["year_planner", "cycle_planner", "full_units", "school_branding"];
var MONTHLY_SAVE_LIMIT = 20;
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
__name(json, "json");
__name2(json, "json");
__name22(json, "json");
__name222(json, "json");
function err(message, status = 400) {
  return json({ error: message }, status);
}
__name(err, "err");
__name2(err, "err");
__name22(err, "err");
__name222(err, "err");
function uuid() {
  return crypto.randomUUID();
}
__name(uuid, "uuid");
__name2(uuid, "uuid");
__name22(uuid, "uuid");
__name222(uuid, "uuid");
function getUserSubjects(user) {
  try {
    return JSON.parse(user.subjects || "[]");
  } catch {
    return [];
  }
}
__name(getUserSubjects, "getUserSubjects");
__name2(getUserSubjects, "getUserSubjects");
__name22(getUserSubjects, "getUserSubjects");
__name222(getUserSubjects, "getUserSubjects");
function getUserAddons(user) {
  try {
    return JSON.parse(user.addons || "[]");
  } catch {
    return [];
  }
}
__name(getUserAddons, "getUserAddons");
__name2(getUserAddons, "getUserAddons");
__name22(getUserAddons, "getUserAddons");
__name222(getUserAddons, "getUserAddons");
function hasSubject(user, subject) {
  return getUserSubjects(user).includes(subject);
}
__name(hasSubject, "hasSubject");
__name2(hasSubject, "hasSubject");
__name22(hasSubject, "hasSubject");
__name222(hasSubject, "hasSubject");
function hasAddon(user, addon) {
  return getUserAddons(user).includes(addon);
}
__name(hasAddon, "hasAddon");
__name2(hasAddon, "hasAddon");
__name22(hasAddon, "hasAddon");
__name222(hasAddon, "hasAddon");
function isPaying(user) {
  return getUserSubjects(user).length > 0;
}
__name(isPaying, "isPaying");
__name2(isPaying, "isPaying");
__name22(isPaying, "isPaying");
__name222(isPaying, "isPaying");
function isAnnual(user) {
  return user.plan_interval === "year";
}
__name(isAnnual, "isAnnual");
__name2(isAnnual, "isAnnual");
__name22(isAnnual, "isAnnual");
__name222(isAnnual, "isAnnual");
function getCurrentYearMonth() {
  const now = /* @__PURE__ */ new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}
__name(getCurrentYearMonth, "getCurrentYearMonth");
__name2(getCurrentYearMonth, "getCurrentYearMonth");
__name22(getCurrentYearMonth, "getCurrentYearMonth");
__name222(getCurrentYearMonth, "getCurrentYearMonth");
async function getMonthlyUsage(db, userId) {
  const yearMonth = getCurrentYearMonth();
  const row = await db.prepare("SELECT count FROM lesson_usage WHERE user_id = ? AND year_month = ?").bind(userId, yearMonth).first();
  return row ? row.count : 0;
}
__name(getMonthlyUsage, "getMonthlyUsage");
__name2(getMonthlyUsage, "getMonthlyUsage");
__name22(getMonthlyUsage, "getMonthlyUsage");
__name222(getMonthlyUsage, "getMonthlyUsage");
async function incrementMonthlyUsage(db, userId) {
  const yearMonth = getCurrentYearMonth();
  const id = uuid();
  await db.prepare(`INSERT INTO lesson_usage (id, user_id, year_month, count) VALUES (?, ?, ?, 1) ON CONFLICT(user_id, year_month) DO UPDATE SET count = count + 1, updated_at = datetime('now')`).bind(id, userId, yearMonth).run();
}
__name(incrementMonthlyUsage, "incrementMonthlyUsage");
__name2(incrementMonthlyUsage, "incrementMonthlyUsage");
__name22(incrementMonthlyUsage, "incrementMonthlyUsage");
__name222(incrementMonthlyUsage, "incrementMonthlyUsage");
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" }, key, 256);
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  const saltStr = btoa(String.fromCharCode(...salt));
  return `${saltStr}:${hash}`;
}
__name(hashPassword, "hashPassword");
__name2(hashPassword, "hashPassword");
__name22(hashPassword, "hashPassword");
__name222(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  const [saltStr, hash] = stored.split(":");
  const salt = Uint8Array.from(atob(saltStr), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" }, key, 256);
  const computed = btoa(String.fromCharCode(...new Uint8Array(bits)));
  return computed === hash;
}
__name(verifyPassword, "verifyPassword");
__name2(verifyPassword, "verifyPassword");
__name22(verifyPassword, "verifyPassword");
__name222(verifyPassword, "verifyPassword");
async function getUser(request, db) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const row = await db.prepare(`SELECT u.* FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > datetime('now')`).bind(token).first();
  return row || null;
}
__name(getUser, "getUser");
__name2(getUser, "getUser");
__name22(getUser, "getUser");
__name222(getUser, "getUser");
async function sendEmail(to, subject, html, from, resendApiKey) {
  if (!resendApiKey) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html })
    });
  } catch (e) {
    console.error("Email failed:", e.message);
  }
}
__name(sendEmail, "sendEmail");
__name2(sendEmail, "sendEmail");
__name22(sendEmail, "sendEmail");
__name222(sendEmail, "sendEmail");
async function stripeRequest(path, method, body, secretKey) {
  const opts = { method, headers: { "Authorization": `Bearer ${secretKey}`, "Content-Type": "application/x-www-form-urlencoded" } };
  if (body) opts.body = new URLSearchParams(body).toString();
  const res = await fetch(`https://api.stripe.com/v1${path}`, opts);
  return res.json();
}
__name(stripeRequest, "stripeRequest");
__name2(stripeRequest, "stripeRequest");
__name22(stripeRequest, "stripeRequest");
__name222(stripeRequest, "stripeRequest");
async function verifyStripeWebhook(request, webhookSecret) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) return null;
  const parts = sig.split(",");
  let timestamp = "", signatures = [];
  for (const part of parts) {
    const [k, v] = part.split("=");
    if (k === "t") timestamp = v;
    if (k === "v1") signatures.push(v);
  }
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(webhookSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig_bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`));
  const expected = Array.from(new Uint8Array(sig_bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (!signatures.includes(expected)) return null;
  if (Math.abs(Math.floor(Date.now() / 1e3) - parseInt(timestamp)) > 300) return null;
  return JSON.parse(body);
}
__name(verifyStripeWebhook, "verifyStripeWebhook");
__name2(verifyStripeWebhook, "verifyStripeWebhook");
__name22(verifyStripeWebhook, "verifyStripeWebhook");
__name222(verifyStripeWebhook, "verifyStripeWebhook");
async function addSubjectToUser(db, userId, subject, planInterval) {
  const user = await db.prepare("SELECT subjects, plan_interval, addons FROM users WHERE id = ?").bind(userId).first();
  const subjects = JSON.parse(user?.subjects || "[]");
  if (!subjects.includes(subject)) subjects.push(subject);
  const currentInterval = user?.plan_interval || "month";
  const newInterval = planInterval === "year" || currentInterval === "year" ? "year" : "month";
  const addons = JSON.parse(user?.addons || "[]");
  if (newInterval === "year" && !addons.includes("full_units")) addons.push("full_units");
  await db.prepare("UPDATE users SET subjects = ?, tier = 'pro', plan_interval = ?, addons = ?, updated_at = datetime('now') WHERE id = ?").bind(JSON.stringify(subjects), newInterval, JSON.stringify(addons), userId).run();
}
__name(addSubjectToUser, "addSubjectToUser");
__name2(addSubjectToUser, "addSubjectToUser");
__name22(addSubjectToUser, "addSubjectToUser");
__name222(addSubjectToUser, "addSubjectToUser");
async function removeSubjectFromUser(db, customerId, subject, planInterval) {
  const user = await db.prepare("SELECT id, subjects, addons, plan_interval FROM users WHERE stripe_customer_id = ?").bind(customerId).first();
  if (!user) return;
  const subjects = JSON.parse(user.subjects || "[]").filter((s) => s !== subject);
  const newTier = subjects.length > 0 ? "pro" : "free";
  let addons = JSON.parse(user.addons || "[]");
  const wasAnnual = planInterval === "year" || user.plan_interval === "year";
  if (subjects.length === 0 && wasAnnual) addons = addons.filter((a) => a !== "full_units");
  const newInterval = subjects.length > 0 ? user.plan_interval : null;
  await db.prepare("UPDATE users SET subjects = ?, tier = ?, plan_interval = ?, addons = ?, updated_at = datetime('now') WHERE id = ?").bind(JSON.stringify(subjects), newTier, newInterval, JSON.stringify(addons), user.id).run();
}
__name(removeSubjectFromUser, "removeSubjectFromUser");
__name2(removeSubjectFromUser, "removeSubjectFromUser");
__name22(removeSubjectFromUser, "removeSubjectFromUser");
__name222(removeSubjectFromUser, "removeSubjectFromUser");
async function addAddonToUser(db, userId, addon) {
  const user = await db.prepare("SELECT addons FROM users WHERE id = ?").bind(userId).first();
  const addons = JSON.parse(user?.addons || "[]");
  if (!addons.includes(addon)) addons.push(addon);
  await db.prepare("UPDATE users SET addons = ?, updated_at = datetime('now') WHERE id = ?").bind(JSON.stringify(addons), userId).run();
}
__name(addAddonToUser, "addAddonToUser");
__name2(addAddonToUser, "addAddonToUser");
__name22(addAddonToUser, "addAddonToUser");
__name222(addAddonToUser, "addAddonToUser");
async function removeAddonFromUser(db, customerId, addon) {
  const user = await db.prepare("SELECT id, addons FROM users WHERE stripe_customer_id = ?").bind(customerId).first();
  if (!user) return;
  const addons = JSON.parse(user.addons || "[]").filter((a) => a !== addon);
  await db.prepare("UPDATE users SET addons = ?, updated_at = datetime('now') WHERE id = ?").bind(JSON.stringify(addons), user.id).run();
}
__name(removeAddonFromUser, "removeAddonFromUser");
__name2(removeAddonFromUser, "removeAddonFromUser");
__name22(removeAddonFromUser, "removeAddonFromUser");
__name222(removeAddonFromUser, "removeAddonFromUser");
var worker_default = {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
    const url = new URL(request.url);
    if (url.pathname === "/ping") return new Response(JSON.stringify({ ok: true, worker: "lessonlab-api", ts: (/* @__PURE__ */ new Date()).toISOString() }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
    if (url.pathname === "/health") return new Response(JSON.stringify({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString(), db: !!env.DB }), { headers: { "Content-Type": "application/json", ...getCorsHeaders(request) } });
    const path = url.pathname;
    const method = request.method;
    const db = env.DB;
    const json2 = /* @__PURE__ */ __name22((data, status = 200) => new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    }), "json");
    const err2 = /* @__PURE__ */ __name22((message, status = 400) => json2({ error: message }, status), "err");
    if (!db) return err2("Database not configured", 500);
    if (path.startsWith("/auth/") && method === "POST") {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const rateLimitKey = "rl:" + ip + ":" + path;
      const rlKV = env.RATE_LIMIT_KV;
      if (rlKV) {
        const attempts = parseInt(await rlKV.get(rateLimitKey) || "0");
        if (attempts >= 10) {
          return json2({ error: "Too many attempts. Try again in 15 minutes." }, 429);
        }
        await rlKV.put(rateLimitKey, String(attempts + 1), { expirationTtl: 900 });
      }
    }
    try {
      if (path === "/auth/signup" && method === "POST") {
        const { email, password, display_name, school_name = null } = await request.json();
        if (!email || !password) return err2("Email and password required");
        const emailClean = email.trim().toLowerCase();
        if (password.length < 6) return err2("Password must be at least 6 characters");
        const existing = await db.prepare("SELECT id FROM users WHERE email = ?").bind(emailClean).first();
        if (existing) return err2("Email already registered", 409);
        const id = uuid();
        const password_hash = await hashPassword(password);
        await db.prepare(`INSERT INTO users (id, email, password_hash, display_name, school_name) VALUES (?, ?, ?, ?, ?)`).bind(id, emailClean, password_hash, display_name || "", school_name || "").run();
        const sessionId = uuid();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
        await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sessionId, id, expires).run();
        const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
        delete user.password_hash;
        const adminEmail = env.ADMIN_EMAIL || "pgallivan@outlook.com";
        sendEmail(
          user.email,
          "Welcome to LessonLab \u{1F389}",
          `<div style="font-family:sans-serif;max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);"><div style="background:#2563eb;padding:32px 40px;"><span style="font-size:22px;font-weight:800;color:#fff;">LessonLab</span></div><div style="padding:36px 40px;"><h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#111827;">Welcome, ${user.display_name || "there"}! \u{1F44B}</h1><p style="margin:0 0 20px;color:#374151;line-height:1.6;">You're in \u2014 choose your first subject to start generating lessons in seconds.</p><a href="https://lessonlab.com.au/app" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:13px 24px;border-radius:8px;font-weight:600;">Start generating &rarr;</a></div><div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;"><p style="margin:0;font-size:12px;color:#9ca3af;">LessonLab \xB7 Victorian Curriculum 2.0 \xB7 F\u20136 \xB7 All subjects</p></div></div>`,
          "LessonLab <welcome@lessonlab.com.au>",
          env.RESEND_API_KEY
        );
        sendEmail(
          adminEmail,
          `[LessonLab] New signup: ${user.email}`,
          `<div style="font-family:sans-serif;"><h2 style="color:#2563eb;">\u{1F4DA} New signup</h2><p>Email: <b>${user.email}</b><br>Name: ${user.display_name || "\u2014"}<br>Time: ${(/* @__PURE__ */ new Date()).toLocaleString("en-AU", { timeZone: "Australia/Melbourne" })}</p></div>`,
          "LessonLab <noreply@lessonlab.com.au>",
          env.RESEND_API_KEY
        );
        return json2({ user, token: sessionId });
      }
      if (path === "/auth/signin" && method === "POST") {
        const { email, password } = await request.json();
        if (!email || !password) return err2("Email and password required");
        const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email.trim().toLowerCase()).first();
        if (!user) return err2("Invalid email or password", 401);
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) return err2("Invalid email or password", 401);
        const sessionId = uuid();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
        await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sessionId, user.id, expires).run();
        delete user.password_hash;
        return json2({ user, token: sessionId });
      }
      if (path === "/auth/signout" && method === "POST") {
        const auth = request.headers.get("Authorization");
        if (auth && auth.startsWith("Bearer ")) await db.prepare("DELETE FROM sessions WHERE id = ?").bind(auth.slice(7)).run();
        return json2({ success: true });
      }
      if (path === "/auth/session" && method === "GET") {
        const user = await getUser(request, db);
        if (!user) return json2({ user: null });
        delete user.password_hash;
        return json2({ user });
      }
      if (path === "/auth/update-password" && method === "POST") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const { new_password } = await request.json();
        if (!new_password || new_password.length < 6) return err2("Password must be at least 6 characters");
        const hash = await hashPassword(new_password);
        await db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").bind(hash, user.id).run();
        return json2({ success: true });
      }
      if (path === "/auth/forgot-password" && method === "POST") {
        const { email } = await request.json();
        if (!email) return err2("Email required");
        const user = await db.prepare("SELECT id, email, display_name FROM users WHERE email = ?").bind(email.trim().toLowerCase()).first();
        if (user) {
          const token = uuid();
          const expires = new Date(Date.now() + 60 * 60 * 1e3).toISOString();
          await db.prepare("INSERT INTO password_reset_tokens (id, user_id, expires_at) VALUES (?, ?, ?)").bind(token, user.id, expires).run();
          sendEmail(
            user.email,
            "Reset your LessonLab password",
            `<div style="font-family:sans-serif;max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;"><div style="background:#2563eb;padding:32px 40px;"><span style="font-size:22px;font-weight:800;color:#fff;">LessonLab</span></div><div style="padding:36px 40px;"><h1 style="margin:0 0 12px;font-size:24px;font-weight:700;">Reset your password</h1><p style="margin:0 0 24px;color:#374151;">This link expires in 1 hour.</p><a href="https://lessonlab.com.au/app?reset_token=${token}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:13px 24px;border-radius:8px;font-weight:600;">Reset Password &rarr;</a></div></div>`,
            "LessonLab <noreply@lessonlab.com.au>",
            env.RESEND_API_KEY
          );
        }
        return json2({ success: true, message: "If that email exists, a reset link has been sent." });
      }
      if (path === "/auth/reset-password" && method === "POST") {
        const { token, new_password } = await request.json();
        if (!token || !new_password) return err2("Token and new password required");
        if (new_password.length < 6) return err2("Password must be at least 6 characters");
        const row = await db.prepare("SELECT * FROM password_reset_tokens WHERE id = ? AND used = 0 AND expires_at > datetime('now')").bind(token).first();
        if (!row) return err2("Reset link is invalid or has expired", 400);
        const hash = await hashPassword(new_password);
        await db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").bind(hash, row.user_id).run();
        await db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE user_id = ?").bind(row.user_id).run();
        await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(row.user_id).run();
        return json2({ success: true });
      }
      if (path === "/profile" && method === "GET") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        delete user.password_hash;
        return json2(user);
      }
      if (path === "/profile" && method === "PUT") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const updates = await request.json();
        const allowed = ["display_name", "school_name", "curriculum"];
        const sets = [], vals = [];
        for (const key of allowed) {
          if (updates[key] !== void 0) {
            sets.push(`${key} = ?`);
            vals.push(updates[key]);
          }
        }
        if (sets.length === 0) return err2("No valid fields to update");
        sets.push("updated_at = datetime('now')");
        vals.push(user.id);
        await db.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).bind(...vals).run();
        const updated = await db.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
        delete updated.password_hash;
        return json2(updated);
      }
      if (path === "/api/usage" && method === "GET") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        if (!isPaying(user)) return json2({ count: 0, limit: 0, is_annual: false, year_month: getCurrentYearMonth() });
        const count = await getMonthlyUsage(db, user.id);
        const annual = isAnnual(user);
        return json2({ count, limit: annual ? null : MONTHLY_SAVE_LIMIT, is_annual: annual, remaining: annual ? null : Math.max(0, MONTHLY_SAVE_LIMIT - count), year_month: getCurrentYearMonth() });
      }
      if (path === "/lessons" && method === "GET") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        if (!isPaying(user)) return err2("Subscription required to access saved lessons", 403);
        const { results } = await db.prepare("SELECT * FROM lessons WHERE user_id = ? ORDER BY updated_at DESC").bind(user.id).all();
        return json2(results.map((l) => ({ ...l, success_criteria: JSON.parse(l.success_criteria || "[]"), lesson_data: JSON.parse(l.lesson_data || "{}") })));
      }
      if (path.startsWith("/lessons/") && method === "GET") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        if (!isPaying(user)) return err2("Subscription required", 403);
        const lessonId = path.split("/")[2];
        const lesson = await db.prepare("SELECT * FROM lessons WHERE id = ? AND user_id = ?").bind(lessonId, user.id).first();
        if (!lesson) return err2("Lesson not found", 404);
        lesson.success_criteria = JSON.parse(lesson.success_criteria || "[]");
        lesson.lesson_data = JSON.parse(lesson.lesson_data || "{}");
        return json2(lesson);
      }
      if (path === "/lessons" && method === "POST") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const lesson = await request.json();
        const subject = lesson.subject || "";
        if (!subject) return err2("Subject is required", 400);
        if (!hasSubject(user, subject)) return err2(`You don't have access to ${subject}. Upgrade to add this subject.`, 403);
        if (!isAnnual(user)) {
          const currentCount = await getMonthlyUsage(db, user.id);
          if (currentCount >= MONTHLY_SAVE_LIMIT) return json2({ error: "monthly_limit_reached", message: `You've reached your ${MONTHLY_SAVE_LIMIT} lesson saves for this month.`, count: currentCount, limit: MONTHLY_SAVE_LIMIT }, 429);
        }
        const id = uuid();
        await db.prepare(`INSERT INTO lessons (id, user_id, subject, unit, focus, year_level, term, week, title, learning_intention, success_criteria, equipment, lesson_data, is_template) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, user.id, subject, lesson.unit || "", lesson.focus || "", lesson.year_level || lesson.yearLevel || "", lesson.term || "", lesson.week || "", lesson.title || "Untitled Lesson", lesson.learning_intention || lesson.learningIntention || "", JSON.stringify(lesson.success_criteria || lesson.successCriteria || []), lesson.equipment || "", JSON.stringify(lesson.lesson_data || lesson), lesson.is_template ? 1 : 0).run();
        await incrementMonthlyUsage(db, user.id);
        const created = await db.prepare("SELECT * FROM lessons WHERE id = ?").bind(id).first();
        created.success_criteria = JSON.parse(created.success_criteria || "[]");
        created.lesson_data = JSON.parse(created.lesson_data || "{}");
        return json2(created, 201);
      }
      if (path.startsWith("/lessons/") && method === "PUT") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        if (!isPaying(user)) return err2("Subscription required", 403);
        const lessonId = path.split("/")[2];
        const existing = await db.prepare("SELECT subject FROM lessons WHERE id = ? AND user_id = ?").bind(lessonId, user.id).first();
        if (!existing) return err2("Lesson not found", 404);
        if (!hasSubject(user, existing.subject)) return err2(`You don't have access to ${existing.subject}`, 403);
        const updates = await request.json();
        await db.prepare(`UPDATE lessons SET title = COALESCE(?, title), subject = COALESCE(?, subject), year_level = COALESCE(?, year_level), term = COALESCE(?, term), week = COALESCE(?, week), learning_intention = COALESCE(?, learning_intention), success_criteria = COALESCE(?, success_criteria), equipment = COALESCE(?, equipment), lesson_data = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`).bind(updates.title || null, updates.subject || null, updates.year_level || null, updates.term || null, updates.week || null, updates.learning_intention || null, updates.success_criteria ? JSON.stringify(updates.success_criteria) : null, updates.equipment || null, JSON.stringify(updates.lesson_data || updates), lessonId, user.id).run();
        const updated = await db.prepare("SELECT * FROM lessons WHERE id = ? AND user_id = ?").bind(lessonId, user.id).first();
        updated.success_criteria = JSON.parse(updated.success_criteria || "[]");
        updated.lesson_data = JSON.parse(updated.lesson_data || "{}");
        return json2(updated);
      }
      if (path.startsWith("/lessons/") && method === "DELETE") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const lessonId = path.split("/")[2];
        await db.prepare("DELETE FROM lessons WHERE id = ? AND user_id = ?").bind(lessonId, user.id).run();
        return json2({ success: true });
      }
      if (path.startsWith("/lessons/rate/") && method === "POST") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const lessonId = parseInt(path.split("/")[3]);
        if (!lessonId) return err2("Invalid lesson ID");
        const { rating } = await request.json();
        if (![1, -1].includes(rating)) return err2("Rating must be 1 (good) or -1 (bad)");
        const lesson = await db.prepare("SELECT id, user_id FROM ai_lessons WHERE id = ?").bind(lessonId).first();
        if (!lesson) return err2("Lesson not found", 404);
        if (lesson.user_id && lesson.user_id !== user.id) return err2("Forbidden", 403);
        await db.prepare("UPDATE ai_lessons SET rating = ? WHERE id = ?").bind(rating, lessonId).run();
        return json2({ success: true, lesson_id: lessonId, rating });
      }
      if (path === "/lessons/mark-saved" && method === "POST") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const { ai_lesson_id } = await request.json();
        if (ai_lesson_id) {
          await db.prepare("UPDATE ai_lessons SET saved = 1 WHERE id = ? AND user_id = ?").bind(ai_lesson_id, user.id).run();
        }
        return json2({ success: true });
      }
      if (path === "/lessons/generate" && method === "POST") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const body = await request.json();
        const { subject, unit, focus, week, total_weeks, year_level, duration, school_name, curriculum_standards } = body;
        if (!subject || !unit || !year_level) return err2("subject, unit and year_level required");
        if (!hasSubject(user, subject)) return err2("You don't have access to this subject. Upgrade to add it.", 403);
        const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY;
        if (!ANTHROPIC_KEY) return err2("AI generation not configured", 500);
        const SUBJECT_NAMES = { pe: "Health & Physical Education", literacy: "Literacy", numeracy: "Numeracy", science: "Science", "visual-art": "Visual Arts", music: "Music", drama: "Drama", french: "French", digital_tech: "Digital Technologies" };
        const subjectName = SUBJECT_NAMES[subject] || subject;
        const wk = parseInt(week) || 1;
        const totalWks = parseInt(total_weeks) || 10;
        const dur = parseInt(duration) || 50;
        const phase = wk <= totalWks * 0.3 ? "Introduction \u2014 students are meeting this skill for the first time. Prioritise confidence, clear modelling, high success rate." : wk <= totalWks * 0.7 ? "Development \u2014 students have the basics. Increase complexity, add challenge, introduce variations." : "Application & Assessment \u2014 students should demonstrate competency in game/performance contexts with peer assessment.";
        const stdsList = (curriculum_standards || []).slice(0, 5).map((s) => s.code + ": " + s.desc).join("\n") || "Victorian Curriculum 2.0 - " + subjectName;
        const systemPrompt = "You are an expert Victorian primary school PE teacher with 20+ years experience writing VC2.0-aligned VTLM 2.0 lesson plans. Every field must be specific to the focus activity \u2014 not generic. Two versions of each phase: a full planning version and a short CRT version. CRT versions are written for a relief teacher who walks in 2 minutes before the lesson \u2014 active verbs, student-facing, max 15 words. Respond ONLY with valid JSON. No markdown. No preamble.";
        const userPrompt = `Generate a complete VTLM 2.0 PE lesson for:
Subject: ${subjectName}
Unit: ${unit}
Focus: ${focus}
Year Level: ${year_level}
Duration: ${dur} mins  (Warm-up 5-8 | Teaching 10 | Practice 15 | Game 15 | Reflect 5)
Week: ${wk}/${totalWks} \u2014 ${phase}
School: ${school_name || "Victorian Primary School"}
VC2.0: ${stdsList}

Return ONLY this JSON:
{
  "title": "Specific activity title",
  "li": "I am learning to [specific skill]",
  "sc": ["I can [foundation]","I can [developing]","I can [extending]"],
  "materials": "Item: qty \xB7 Item: qty \xB7 Item: qty",
  "context": "One sentence \u2014 what students already know",
  "entry":         "Full warm-up (3-5 sentences) \u2014 activity name, how it runs, what students do",
  "entry_crt":     "CRT: one sentence \u226415 words \u2014 what students physically do",
  "entrySay":      "Exact opening words to say to the class",
  "teach":         "Full explicit teaching (3-5 sentences) \u2014 I Do, We Do, what to model",
  "teach_crt":     "CRT: one sentence \u226415 words \u2014 the skill being shown",
  "points":        "Cue 1 \xB7 Cue 2 \xB7 Cue 3",
  "cues":          "word \xB7 word \xB7 word \xB7 word",
  "practice":      "Full guided practice (3-5 sentences) \u2014 activity, setup, coaching prompts",
  "practice_crt":  "CRT: one sentence \u226415 words \u2014 what students do",
  "game":          "Full game/application (3-5 sentences) \u2014 name, rules, boundaries",
  "game_crt":      "CRT: one sentence \u226415 words \u2014 game name and core rule",
  "ifWell":        "Specific extension if students nail it",
  "exit":          "Full exit/reflection (2-3 sentences) \u2014 pack up, reflection, question",
  "exit_crt":      "CRT: one sentence \u226415 words \u2014 how students finish",
  "ifNot":         "One specific fix if it breaks down \u2014 exact change, not vague",
  "differentiation": {
    "support":   "Two concrete named adjustments for students needing support",
    "extension": "Two concrete named challenges for advanced students"
  }
}`;
        try {
          const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1600, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] })
          });
          const aiData = await aiRes.json();
          if (!aiRes.ok) return err2("AI generation failed: " + (aiData.error?.message || "Unknown"), 500);
          const rawFull = aiData.content?.[0]?.text || "";
          const jsonMatch = rawFull.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          let rawText = (jsonMatch ? jsonMatch[1] : rawFull).trim();
          const jStart = rawText.indexOf("{");
          const jEnd = rawText.lastIndexOf("}");
          if (jStart > 0 || jEnd < rawText.length - 1) rawText = rawText.slice(jStart, jEnd + 1);
          let lesson;
          try {
            lesson = JSON.parse(rawText);
          } catch (e) {
            return err2("AI returned invalid JSON. Please try again.", 500);
          }
          if (typeof lesson.sc === "string") lesson.sc = lesson.sc.split("\n").filter((s) => s.trim());
          lesson.sc_string = Array.isArray(lesson.sc) ? lesson.sc.join("\n") : lesson.sc || "";
          if (lesson.differentiation) {
            lesson.differentiation.support = lesson.differentiation.support || lesson.differentiation.enabling || "";
            lesson.differentiation.extension = lesson.differentiation.extension || lesson.differentiation.extending || "";
            delete lesson.differentiation.enabling;
            delete lesson.differentiation.extending;
          }
          if (lesson.context && typeof lesson.context === "object") {
            lesson.context = "Building on prior learning from previous lessons.";
          }
          if (lesson.materials && !lesson.equipment) lesson.equipment = lesson.materials;
          if (lesson.equipment && !lesson.materials) lesson.materials = lesson.equipment;
          const _fs = /* @__PURE__ */ __name((t) => {
            if (!t) return "";
            for (let i = 25; i < t.length; i++) {
              if ("!?.".includes(t[i])) return t.slice(0, i + 1).trim();
            }
            return t.slice(0, 120).trim();
          }, "_fs");
          if (!lesson.entry_crt) lesson.entry_crt = _fs(lesson.entry);
          if (!lesson.teach_crt) lesson.teach_crt = _fs(lesson.teach);
          if (!lesson.practice_crt) lesson.practice_crt = _fs(lesson.practice);
          if (!lesson.game_crt) lesson.game_crt = _fs(lesson.game);
          if (!lesson.exit_crt) lesson.exit_crt = _fs(lesson.exit);
          if (!lesson.entry_crt) lesson.entry_crt = _fs(lesson.entry);
          if (!lesson.teach_crt) lesson.teach_crt = _fs(lesson.teach);
          if (!lesson.practice_crt) lesson.practice_crt = _fs(lesson.practice);
          if (!lesson.game_crt) lesson.game_crt = _fs(lesson.game);
          if (!lesson.exit_crt) lesson.exit_crt = _fs(lesson.exit);
          const liOk = lesson.li && lesson.li.toLowerCase().startsWith("i am learning to");
          const scOk = Array.isArray(lesson.sc) && lesson.sc.length === 3 && lesson.sc.every((s) => s.toLowerCase().startsWith("i can"));
          if (!liOk || !scOk) {
            try {
              await db.prepare("INSERT INTO generate_errors (subject, year_level, error_message) VALUES (?, ?, ?)").bind(subject, year_level, "Validation: li_ok=" + liOk + " sc_ok=" + scOk + " title=" + (lesson.title || "?").slice(0, 50)).run();
            } catch (e) {
            }
            if (!liOk && lesson.li) lesson.li = "I am learning to " + lesson.li.replace(/^(to |learn |students will |we will )/i, "");
            if (!scOk && Array.isArray(lesson.sc)) lesson.sc = lesson.sc.map((s) => s.toLowerCase().startsWith("i can") ? s : "I can " + s.replace(/^(students can |you can |to )/i, ""));
          }
          try {
            await db.prepare("INSERT INTO ai_lessons (topic, year_level, duration, lesson_json, prompt_version, subject, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))").bind(lesson.title || focus, year_level, dur, JSON.stringify(lesson), 3, subject, user.id).run();
          } catch (e) {
          }
          let aiLessonId = null;
          try {
            const logged = await db.prepare("SELECT id FROM ai_lessons WHERE user_id = ? ORDER BY id DESC LIMIT 1").bind(user.id).first();
            aiLessonId = logged?.id || null;
          } catch (e) {
          }
          return json2({ lesson, generated_by: "claude", model: "claude-haiku-4-5-20251001", ai_lesson_id: aiLessonId });
        } catch (e) {
          try {
            await db.prepare("INSERT INTO generate_errors (subject, year_level, error_message) VALUES (?, ?, ?)").bind(subject || "?", year_level || "?", e.message.slice(0, 200)).run();
            const recentErrors = await db.prepare("SELECT COUNT(*) as n FROM generate_errors WHERE created_at > datetime('now', '-1 hour')").first();
            if ((recentErrors?.n || 0) >= 5) {
              const alertMsg = "\u{1F6A8} LessonLab AI generation failing: " + (recentErrors?.n || 0) + " errors in last hour. Check ANTHROPIC_API_KEY and model availability.";
              if (env.COMMS_HUB_URL) {
                fetch(env.COMMS_HUB_URL + "/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ channel: "lessonlab", type: "alert", message: alertMsg })
                }).catch(() => {
                });
              }
              if (env.SLACK_BRIDGE_URL) {
                fetch(env.SLACK_BRIDGE_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ channel: "C0AU8EQ2B89", message: alertMsg })
                  // #asgard-alerts
                }).catch(() => {
                });
              }
            }
          } catch (_) {
          }
          return err2("Generation failed: " + e.message, 500);
        }
      }
      if (path === "/debug/generate" && method === "POST") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const body = await request.json();
        const ANTHROPIC_KEY = env.ANTHROPIC_API_KEY;
        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 200,
            messages: [{ role: "user", content: 'Return this exact JSON: {"test": true, "num": 42}' }]
          })
        });
        const data = await aiRes.json();
        return json2({ status: aiRes.status, data, raw_text: data.content?.[0]?.text });
      }
      if (path === "/stripe/checkout" && method === "POST") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        const { type, subject, addon, interval } = await request.json();
        const appUrl = "https://lessonlab.com.au/app";
        let priceId, metadata, mode = "subscription";
        const planInterval = interval === "year" ? "year" : "month";
        if (type === "subject") {
          if (!subject || !VALID_SUBJECTS.includes(subject)) return err2("Invalid subject");
          if (hasSubject(user, subject)) return err2("You already have access to this subject");
          const isFirstSubject = getUserSubjects(user).length === 0;
          if (planInterval === "year") {
            priceId = isFirstSubject ? env.STRIPE_PRICE_SUBJECT_BASE_ANNUAL : env.STRIPE_PRICE_SUBJECT_EXTRA_ANNUAL;
          } else {
            priceId = isFirstSubject ? env.STRIPE_PRICE_SUBJECT_BASE : env.STRIPE_PRICE_SUBJECT_EXTRA;
          }
          metadata = { user_id: user.id, type: "subject", subject, plan_interval: planInterval };
        } else if (type === "addon") {
          if (!addon || !VALID_ADDONS.includes(addon)) return err2("Invalid addon");
          if (hasAddon(user, addon)) return err2("You already have this add-on");
          if (addon === "full_units") {
            priceId = env.STRIPE_PRICE_FULL_UNITS;
            mode = "payment";
          } else if (addon === "school_branding") {
            priceId = env.STRIPE_PRICE_SCHOOL_BRANDING;
          } else return err2("This addon is now included with your subscription");
          metadata = { user_id: user.id, type: "addon", addon };
        } else {
          return err2("Invalid checkout type");
        }
        if (!priceId) return err2("Stripe price not configured for this item", 500);
        const sessionParams = { "mode": mode, "payment_method_types[]": "card", ...user.stripe_customer_id ? { "customer": user.stripe_customer_id } : { "customer_email": user.email }, "line_items[0][price]": priceId, "line_items[0][quantity]": "1", "allow_promotion_codes": "true", "automatic_tax[enabled]": "true", "success_url": `${appUrl}?upgrade=success&type=${type}`, "cancel_url": `${appUrl}?upgrade=cancelled` };
        Object.entries(metadata).forEach(([k, v]) => {
          sessionParams[`metadata[${k}]`] = v;
        });
        if (mode === "subscription") Object.entries(metadata).forEach(([k, v]) => {
          sessionParams[`subscription_data[metadata][${k}]`] = v;
        });
        const session = await stripeRequest("/checkout/sessions", "POST", sessionParams, env.STRIPE_SECRET_KEY);
        if (session.error) return err2(session.error.message, 400);
        return json2({ url: session.url });
      }
      if (path === "/stripe/webhook" && method === "POST") {
        const event = await verifyStripeWebhook(request, env.STRIPE_WEBHOOK_SECRET);
        if (!event) return err2("Invalid webhook signature", 400);
        if (event.type === "checkout.session.completed") {
          const session = event.data.object;
          const { user_id, type, subject, addon, plan_interval } = session.metadata || {};
          if (!user_id) return json2({ received: true });
          if (session.customer) await db.prepare("UPDATE users SET stripe_customer_id = COALESCE(stripe_customer_id, ?), updated_at = datetime('now') WHERE id = ?").bind(session.customer, user_id).run();
          if (type === "subject" && subject && VALID_SUBJECTS.includes(subject)) {
            await addSubjectToUser(db, user_id, subject, plan_interval);
            const paidUser = await db.prepare("SELECT email FROM users WHERE id = ?").bind(user_id).first();
            const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "\u2014";
            sendEmail(
              env.ADMIN_EMAIL || "pgallivan@outlook.com",
              `[LessonLab] \u{1F4B0} Payment: ${paidUser?.email}`,
              `<div style="font-family:sans-serif;"><h2 style="color:#16a34a;">\u{1F4B0} New payment</h2><p>Email: <b>${paidUser?.email}</b><br>Subject: ${subject}<br>Plan: ${plan_interval}<br>Amount: ${amount}</p></div>`,
              "LessonLab <noreply@lessonlab.com.au>",
              env.RESEND_API_KEY
            );
          } else if (type === "addon" && addon && VALID_ADDONS.includes(addon)) {
            await addAddonToUser(db, user_id, addon);
          }
        }
        if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
          const sub = event.data.object;
          if (sub.status === "active" && sub.metadata?.user_id) {
            const { user_id, type, subject, addon, plan_interval } = sub.metadata;
            if (type === "subject" && subject && VALID_SUBJECTS.includes(subject)) await addSubjectToUser(db, user_id, subject, plan_interval);
            else if (type === "addon" && addon && VALID_ADDONS.includes(addon)) await addAddonToUser(db, user_id, addon);
          }
        }
        if (event.type === "customer.subscription.deleted") {
          const sub = event.data.object;
          const { type, subject, addon, plan_interval } = sub.metadata || {};
          if (type === "subject" && subject) await removeSubjectFromUser(db, sub.customer, subject, plan_interval);
          else if (type === "addon" && addon) await removeAddonFromUser(db, sub.customer, addon);
        }
        if (event.type === "invoice.payment_failed" || event.type === "invoice.payment_action_required") {
          const invoice = event.data.object;
          const customerId = invoice.customer;
          const user = await db.prepare("SELECT email, display_name FROM users WHERE stripe_customer_id = ?").bind(customerId).first();
          if (user && env.RESEND_API_KEY) {
            sendEmail(
              env.ADMIN_EMAIL || "pgallivan@outlook.com",
              "[LessonLab] \u26A0\uFE0F Payment failed: " + user.email,
              `<div style="font-family:sans-serif;"><h2 style="color:#dc2626;">\u26A0\uFE0F Payment failed</h2><p>Email: <b>${user.email}</b><br>Amount: $${((invoice.amount_due || 0) / 100).toFixed(2)}<br>Attempt: ${invoice.attempt_count || 1}<br>Next retry: ${invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1e3).toLocaleString("en-AU") : "N/A"}</p></div>`,
              "LessonLab <noreply@lessonlab.com.au>",
              env.RESEND_API_KEY
            );
          }
        }
        return json2({ received: true });
      }
      if (path === "/admin/resend-status" && method === "GET") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const res = await fetch("https://api.resend.com/domains", {
          headers: { "Authorization": "Bearer " + env.RESEND_API_KEY }
        });
        const domains = await res.json();
        let verifyResults = [];
        for (const dom of domains.data || []) {
          if (dom.name && dom.name.includes("lessonlab")) {
            const vr = await fetch("https://api.resend.com/domains/" + dom.id + "/verify", {
              method: "POST",
              headers: { "Authorization": "Bearer " + env.RESEND_API_KEY }
            });
            verifyResults.push({ domain: dom.name, status: dom.status, records: dom.records, verify: await vr.json() });
          }
        }
        return json2({ domains: domains.data || [], verifyResults });
      }
      if (path === "/admin/resend-records" && method === "GET") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const res = await fetch("https://api.resend.com/domains/c3eff848-f79b-4929-b0cb-b415bfbebd68", {
          headers: { "Authorization": "Bearer " + env.RESEND_API_KEY }
        });
        return json2(await res.json());
      }
      if (path === "/admin/content-health" && method === "GET") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const since = url.searchParams.get("since") || "7 days ago";
        const [generated, rated, errors, saved] = await Promise.all([
          db.prepare("SELECT COUNT(*) as n, subject, AVG(CASE WHEN rating IS NOT NULL THEN 1 ELSE 0 END) as rated_pct FROM ai_lessons WHERE created_at > datetime('now', '-7 days') GROUP BY subject ORDER BY n DESC").all(),
          db.prepare("SELECT COUNT(*) as n, AVG(rating) as avg_rating, subject FROM ai_lessons WHERE rating IS NOT NULL AND created_at > datetime('now', '-7 days') GROUP BY subject").all(),
          db.prepare("SELECT COUNT(*) as n, subject, error_message FROM generate_errors WHERE created_at > datetime('now', '-7 days') GROUP BY subject ORDER BY n DESC LIMIT 20").all(),
          db.prepare("SELECT COUNT(*) as saved_count FROM ai_lessons WHERE saved = 1 AND created_at > datetime('now', '-7 days')").first()
        ]);
        const totalGenerated = (generated.results || []).reduce((a, b) => a + (b.n || 0), 0);
        const errorCount = (errors.results || []).reduce((a, b) => a + (b.n || 0), 0);
        const errorRate = totalGenerated > 0 ? (errorCount / totalGenerated * 100).toFixed(1) : "0";
        return json2({
          period: "last 7 days",
          total_generated: totalGenerated,
          total_saved: saved?.saved_count || 0,
          save_rate: totalGenerated > 0 ? ((saved?.saved_count || 0) / totalGenerated * 100).toFixed(1) + "%" : "0%",
          error_count: errorCount,
          error_rate: errorRate + "%",
          alert: parseFloat(errorRate) > 5 ? "\u26A0\uFE0F ERROR RATE ABOVE 5% \u2014 CHECK GENERATE ENDPOINT" : "\u2705 Healthy",
          by_subject: generated.results || [],
          ratings: rated.results || [],
          recent_errors: errors.results || []
        });
      }
      if (path === "/admin/stripe-fix" && method === "POST") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const { action, price_id, webhook_id, nickname } = await request.json();
        const results = {};
        if (action === "list_webhooks") {
          const wh = await stripeRequest("/webhook_endpoints?limit=10", "GET", null, env.STRIPE_SECRET_KEY);
          results.webhooks = (wh.data || []).map((w) => ({ id: w.id, url: w.url, events: w.enabled_events, status: w.status }));
        }
        if (action === "update_webhook" && webhook_id) {
          const body = {
            "enabled_events[0]": "checkout.session.completed",
            "enabled_events[1]": "customer.subscription.created",
            "enabled_events[2]": "customer.subscription.updated",
            "enabled_events[3]": "customer.subscription.deleted",
            "enabled_events[4]": "invoice.payment_failed",
            "enabled_events[5]": "invoice.payment_action_required"
          };
          results.webhook = await stripeRequest("/webhook_endpoints/" + webhook_id, "POST", body, env.STRIPE_SECRET_KEY);
        }
        return json2(results);
      }
      if (path === "/admin/stripe-status" && method === "GET") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const webhooks = await stripeRequest("/webhook_endpoints?limit=10", "GET", null, env.STRIPE_SECRET_KEY);
        const prices = await stripeRequest("/prices?limit=10&active=true", "GET", null, env.STRIPE_SECRET_KEY);
        return json2({ webhooks: webhooks.data || webhooks, prices: prices.data || prices, mode: (env.STRIPE_SECRET_KEY || "").startsWith("sk_live") ? "live" : "test" });
      }
      if (path === "/stripe/portal" && method === "POST") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        if (!user.stripe_customer_id) return err2("No active subscription found", 404);
        const portal = await stripeRequest("/billing_portal/sessions", "POST", { "customer": user.stripe_customer_id, "return_url": "https://lessonlab.com.au" }, env.STRIPE_SECRET_KEY);
        if (portal.error) return err2(portal.error.message, 400);
        return json2({ url: portal.url });
      }
      if (path === "/admin/users" && method === "GET") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const { results } = await db.prepare("SELECT id, email, display_name, tier, subjects, addons, plan_interval, school_name, stripe_customer_id, created_at FROM users ORDER BY created_at DESC LIMIT 200").all();
        const lessonCounts = await db.prepare("SELECT user_id, COUNT(*) as count FROM lessons GROUP BY user_id").all();
        const countMap = {};
        (lessonCounts.results || []).forEach((r) => {
          countMap[r.user_id] = r.count;
        });
        const users = results.map((u) => ({ ...u, lesson_count: countMap[u.id] || 0 }));
        return json2({ users, stats: { total: users.length, paying: users.filter((u) => JSON.parse(u.subjects || "[]").length > 0).length, free: users.filter((u) => JSON.parse(u.subjects || "[]").length === 0).length, annual: users.filter((u) => u.plan_interval === "year").length, totalLessons: Object.values(countMap).reduce((a, b) => a + b, 0) } });
      }
      if (path === "/admin/set-subjects" && method === "POST") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const { email, subjects, addons } = await request.json();
        if (!email) return err2("Email required");
        const target = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email.toLowerCase()).first();
        if (!target) return err2("User not found", 404);
        const updates = [], vals = [];
        if (subjects !== void 0) {
          updates.push("subjects = ?");
          vals.push(JSON.stringify(subjects));
        }
        if (addons !== void 0) {
          updates.push("addons = ?");
          vals.push(JSON.stringify(addons));
        }
        if (updates.length === 0) return err2("Nothing to update");
        updates.push("updated_at = datetime('now')");
        vals.push(target.id);
        await db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).bind(...vals).run();
        return json2({ success: true, email, subjects, addons });
      }
      if (path === "/admin/set-tier" && method === "POST") {
        const user = await getUser(request, db);
        if (!user || !user.is_admin) return err2("Forbidden", 403);
        const { email, tier } = await request.json();
        if (!email || !["free", "pro", "school"].includes(tier)) return err2("Invalid params");
        const target = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email.toLowerCase()).first();
        if (!target) return err2("User not found", 404);
        await db.prepare("UPDATE users SET tier = ?, updated_at = datetime('now') WHERE id = ?").bind(tier, target.id).run();
        return json2({ success: true, email, tier });
      }
      if (path === "/users" && method === "GET") {
        const user = await getUser(request, db);
        if (!user) return err2("Not authenticated", 401);
        delete user.password_hash;
        return json2(user);
      }
      return err2("Not found", 404);
    } catch (e) {
      console.error(e);
      return err2("Internal server error: " + e.message, 500);
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=index.js.map
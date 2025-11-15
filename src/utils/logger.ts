export const logger = {
  info: (...a: any[]) => console.log("[info]", ...a),
  error: (...a: any[]) => console.error("[error]", ...a),
  warn:  (...a: any[]) => console.warn("[warn]", ...a)
};

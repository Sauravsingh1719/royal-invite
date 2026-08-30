export interface GuestPayload {
  n: string;
  t?: "f" | "p";          
  c?: number;           
  fn?: string;           
  m?: string;            
  fam?: string;           
}

export function encodeGuestPayload(data: GuestPayload): string {
  try {
    const jsonString = JSON.stringify(data);
    if (typeof window === "undefined") {
      return Buffer.from(jsonString).toString("base64");
    }
    return btoa(unescape(encodeURIComponent(jsonString)));
  } catch (err) {
    console.error("Encoding guest payload failed:", err);
    return "";
  }
}

export function decodeGuestPayload(id: string | null): GuestPayload | null {
  if (!id) return null;
  try {
    if (typeof window === "undefined") {
      const decoded = Buffer.from(id, "base64").toString("utf-8");
      return JSON.parse(decoded);
    }
    const decoded = decodeURIComponent(escape(atob(id)));
    return JSON.parse(decoded);
  } catch (err) {
    console.warn("Invalid guest token format:", err);
    return null;
  }
}
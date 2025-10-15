export function getFilenameFromDisposition(header?: string | null, fallback = "export.xlsx") {
    if (!header) return fallback;
    // Content-Disposition: attachment; filename="usuarios_20251014_120000.xlsx"
    const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(header);
    if (!match) return fallback;
    try {
        // Soporta filename*=UTF-8''... con percent-encoding
        return decodeURIComponent(match[1].replace(/\"/g, ""));
    } catch {
        return match[1].replace(/\"/g, "") || fallback;
    }
}

export async function downloadExcelWithFetch(url: string) {
    const resp = await fetch(url, { method: "GET", credentials: "include" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const blob = await resp.blob();
    const disp = resp.headers.get("Content-Disposition");
    const filename = getFilenameFromDisposition(disp);

    const link = document.createElement("a");
    const href = URL.createObjectURL(blob);
    link.href = href;
    link.download = filename || "export.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
}

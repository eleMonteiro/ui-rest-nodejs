export const filterFIQL = (filter = {}) => {
  return Object.entries(filter)
    .map(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        return null;
      }

      if (key == "id") {
        const safeValue = value.trim();
        return safeValue ? `${key}==${safeValue}` : null;
      }

      if (Array.isArray(value)) {
        return `${key}=in=(${value.join(",")})`;
      }

      if (typeof value === "object") {
        if ("op" in value && "value" in value && value.value) {
          return `${key}=${value.op}=${value.value}`;
        }
        return null;
      }

      if (!isNaN(new Date(value))) {
        return `${key}==${value}`;
      }

      if (typeof value === "string") {
        const safeValue = value.trim();
        return safeValue ? `${key}=like=${safeValue}` : null;
      }

      return null;
    })
    .filter(Boolean)
    .join(";");
};

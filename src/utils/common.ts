export function removeUndefinedValues(obj: any) {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc: any, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

// Helper to safely check for your specific falsy values, empty arrays, and empty plain objects
const isFalsyOrEmpty = (v: unknown) => {
  // 1. Catch null, undefined, and empty strings
  if (v === "" || v === null || v === undefined) return true;
  
  // 2. Catch empty arrays
  if (Array.isArray(v) && v.length === 0) return true;
  
  // 3. Catch strictly plain empty objects (safely ignores Date, RegExp, etc.)
  if (Object.prototype.toString.call(v) === '[object Object]' && Object.keys(v).length === 0) {
    return true;
  }
  
  return false;
};

export function filterFalslyValues(obj: object): object {
  if (Array.isArray(obj)) {
    return obj
      .map(filterFalslyValues) // 1. Clean the children first
      .filter((item) => !isFalsyOrEmpty(item)); // 2. Remove if they became empty
  } 
  
  // Safely check for plain objects only so we don't accidentally shred Date objects
  else if (Object.prototype.toString.call(obj) === '[object Object]') {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([k, v]) => [k, filterFalslyValues(v)]) // 1. Clean the values first
        .filter(([_, v]) => !isFalsyOrEmpty(v)) // 2. Remove keys that became empty
    );
  }
  
  // Return primitives, Dates, RegExps, etc. as they are
  return obj;
}


export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export function getRecColor (val: string | boolean, token: any) {
  switch (val) {
      case true:
        return token["green7"];
      case false:
        return token["red7"];
      case "failed":
        return token["red7"];
      case "pending":
        return token["yellow7"];
      case "successful":
        return token["green7"];
      default:
        return "rgb(52, 67, 87)";
    }
}
export function removeUndefinedValues(obj: any) {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc: any, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
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
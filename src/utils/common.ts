export function removeUndefinedValues(obj: any) {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc: any, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}


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
import { Direction, TelNumber, WorkHours } from "./AppUser";

export function strDirection(direction: Direction | undefined) {
  if (!direction) return ("(Ex. C. Balmes, 8, 08001 Barcelona Barcelona, Espanya)")
  const properties = ["streetType", "street", "number", "postalCode", "city", "province", "country"] as const;
  return (
    properties.reduce<string|undefined>((total, item)=>{
      if (direction[item] !== "") { 
        if (item == "number" || item == "province" || item == "country") {
          total += ", " + direction[item]
        } else {
          total += " " + direction[item]
        }
      }
      return total
    }, "")
  )
}

export function strTelNumber(telNumber: TelNumber) {
  const properties = ["code", "number"] as const;
  return (
    properties.reduce<string|undefined>((total, item)=>{
      if (telNumber[item]) {
        if (item === "code") {
          return (total += "+" + String(telNumber[item])) + " "
        }
        return (total += String(telNumber[item]))
      }
    }, "")
  )
}

export function strWorkHours(workHours: WorkHours) {
  const properties = ["start", "end"] as const;
  return (
    properties.reduce<string|undefined>((total, item, index)=>{
      if (workHours[item]) {
        if (index === properties.length-1) {
          return (total += String(workHours[item]))
        }
        return (total += String(workHours[item])) + "-"
      }
    }, "")
  )
}
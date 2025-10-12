export interface ParsedIngredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  bought: boolean;
}

// Common Norwegian units
const UNITS = [
  'kg', 'hg', 'g', 'mg',
  'l', 'dl', 'cl', 'ml',
  'stk', 'ss', 'ts', 'klype',
  'pakke', 'pakker', 'pose', 'poser', 'boks', 'bokser',
  'flaske', 'flasker', 'bunt', 'bunter',
  'skive', 'skiver', 'bit', 'biter',
  'kopp', 'kopper', 'glass'
];

/**
 * Parses an ingredient string and extracts quantity, unit, and name
 * Examples:
 * - "2 egg" → {quantity: 2, unit: "stk", name: "egg"}
 * - "500 g ost" → {quantity: 500, unit: "g", name: "ost"}
 * - "2,5 dl melk" → {quantity: 2.5, unit: "dl", name: "melk"}
 * - "salt" → {quantity: null, unit: null, name: "salt"}
 */
export function parseIngredient(ingredientStr: string): Omit<ParsedIngredient, 'bought'> {
  const trimmed = ingredientStr.trim();
  
  // Pattern: optional quantity (with comma or dot as decimal separator), optional unit, then name
  // Example: "2.5 dl melk" or "2,5 dl melk" or "2 egg" or "salt"
  const pattern = /^(\d+[.,]?\d*)\s*([a-zæøå]+)?\s+(.+)$/i;
  const match = trimmed.match(pattern);
  
  if (!match) {
    // No quantity found, treat entire string as name
    return {
      name: trimmed,
      quantity: null,
      unit: null
    };
  }
  
  const [, quantityStr, possibleUnit, restOfString] = match;
  const quantity = parseFloat(quantityStr.replace(',', '.'));
  
  // Check if possibleUnit is actually a known unit
  const unitLower = possibleUnit?.toLowerCase();
  const isKnownUnit = unitLower && UNITS.includes(unitLower);
  
  if (isKnownUnit) {
    // We have quantity + unit + name
    return {
      name: restOfString.trim(),
      quantity,
      unit: unitLower
    };
  } else if (possibleUnit) {
    // possibleUnit is actually part of the name (e.g., "2 egg" where "egg" is not in UNITS)
    return {
      name: `${possibleUnit} ${restOfString}`.trim(),
      quantity,
      unit: 'stk' // Default unit
    };
  } else {
    // Just quantity and name
    return {
      name: restOfString.trim(),
      quantity,
      unit: 'stk' // Default unit
    };
  }
}

/**
 * Formats a parsed ingredient back to a string
 */
export function formatIngredient(item: ParsedIngredient | Omit<ParsedIngredient, 'bought'>): string {
  if (item.quantity === null || item.quantity === undefined) {
    return item.name;
  }
  
  // Format quantity to remove unnecessary decimals
  const formattedQuantity = item.quantity % 1 === 0 
    ? item.quantity.toString() 
    : item.quantity.toFixed(1).replace('.', ',');
  
  if (item.unit) {
    return `${formattedQuantity} ${item.unit} ${item.name}`;
  }
  
  return `${formattedQuantity} ${item.name}`;
}

/**
 * Merges two parsed ingredients with the same name
 * Returns null if they can't be merged (different units)
 */
export function mergeIngredients(
  existing: ParsedIngredient, 
  toAdd: Omit<ParsedIngredient, 'bought'>
): ParsedIngredient | null {
  // Names must match (case-insensitive)
  if (existing.name.toLowerCase() !== toAdd.name.toLowerCase()) {
    return null;
  }
  
  // If both have no quantity, just keep the existing one
  if (existing.quantity === null && toAdd.quantity === null) {
    return existing;
  }
  
  // If one has quantity and the other doesn't, we'll add the new one separately
  if ((existing.quantity === null) !== (toAdd.quantity === null)) {
    return null;
  }
  
  // Both have quantities - check if units are compatible
  const existingUnit = existing.unit?.toLowerCase();
  const toAddUnit = toAdd.unit?.toLowerCase();
  
  if (existingUnit !== toAddUnit) {
    // Units don't match, can't merge
    return null;
  }
  
  // Merge quantities
  return {
    ...existing,
    quantity: (existing.quantity || 0) + (toAdd.quantity || 0),
    unit: existing.unit || toAdd.unit
  };
}

/**
 * Finds an existing item in the list that matches the new item
 * Returns the index or -1 if not found
 */
export function findMatchingItem(
  items: ParsedIngredient[], 
  newItem: Omit<ParsedIngredient, 'bought'>
): number {
  return items.findIndex(item => 
    item.name.toLowerCase() === newItem.name.toLowerCase() &&
    item.unit?.toLowerCase() === newItem.unit?.toLowerCase()
  );
}


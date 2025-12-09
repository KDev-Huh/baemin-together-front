export function getStoreImage(category?: string, storeId?: string): string {
  if (!category) return '/food_chicken.png'; // Default fallback

  if (category.includes('치킨')) return '/food_chicken.png';
  if (category.includes('피자')) return '/food_pizza.png';
  if (category.includes('한식')) return '/food_chicken.png'; // Fallback until korean is generated
  if (category.includes('분식')) return '/food_pizza.png'; // Fallback
  
  // Deterministic fallback based on storeId char code
  if (storeId) {
     const hash = storeId.charCodeAt(0) % 2;
     return hash === 0 ? '/food_chicken.png' : '/food_pizza.png';
  }

  return '/food_chicken.png';
}

export function getMenuImage(menuName: string, menuId?: string): string {
  if (menuName.includes('치킨')) return '/food_chicken.png';
  if (menuName.includes('피자')) return '/food_pizza.png';
  
  if (menuId) {
    const hash = menuId.charCodeAt(menuId.length - 1) % 2;
    return hash === 0 ? '/food_chicken.png' : '/food_pizza.png';
  }
  
  return '/food_chicken.png';
}

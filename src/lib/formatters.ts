export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function formatSlot(slot: string) {
  const map = {
    morning: "Morning ☀️",
    afternoon: "Afternoon 🌤️",
    evening: "Evening 🌙",
  };

  return map[slot as keyof typeof map] || slot;
}

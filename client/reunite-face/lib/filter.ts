// Simple debounce implementation
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Calculate age group based on DOB
export const calculateAgeGroup = (dob: string): string => {
  if (!dob) return "All Ages";
  const birthDate = new Date(dob);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  if (age <= 12) return "Child (0-12)";
  if (age <= 17) return "Teen (13-17)";
  return "Adult (18+)";
};

// Calculate time missing
export const calculateTimeMissing = (missingSince: string): string => {
  if (!missingSince) return "Any Time";
  const missingDate = new Date(missingSince);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - missingDate.getFullYear()) * 12 + 
                    (now.getMonth() - missingDate.getMonth());
  
  if (monthsDiff < 1) return "Less than 1 month";
  if (monthsDiff <= 6) return "1-6 months";
  if (monthsDiff <= 12) return "6 months-1year";
  return "Greater than 1 year";
};
import { subDays } from "date-fns";

export type Category =
  | "FOOD"
  | "HOUSING"
  | "TRANSPORT"
  | "SHOPPING"
  | "TRAVEL"
  | "HEALTH"
  | "ENTERTAINMENT"
  | "SUBSCRIPTIONS"
  | "INVESTMENTS"
  | "INCOME"
  | "UTILITIES"
  | "EDUCATION";

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: Category;
  date: string;
  notes: string;
  tags: string[];
  source: string;
  confidence: number;
};

export type Budget = {
  id: string;
  category: Category;
  limit: number;
  spent: number;
  rollover: number;
};

const baseTransactions = [
  ["Salary Credit", 185000, "INCOME"],
  ["Freelance Invoice", 32000, "INCOME"],
  ["Rent", -42000, "HOUSING"],
  ["Swiggy Instamart", -920, "FOOD"],
  ["Zomato Dining", -1680, "FOOD"],
  ["Blue Tokai Coffee", -420, "FOOD"],
  ["Uber India", -620, "TRANSPORT"],
  ["Metro Recharge", -600, "TRANSPORT"],
  ["Amazon India", -3199, "SHOPPING"],
  ["BESCOM Electricity", -2180, "UTILITIES"],
  ["Airtel Fiber", -999, "UTILITIES"],
  ["Netflix", -649, "SUBSCRIPTIONS"],
  ["Spotify", -119, "SUBSCRIPTIONS"],
  ["Apollo Pharmacy", -860, "HEALTH"],
  ["Cult Fit", -1799, "HEALTH"],
  ["BookMyShow", -1500, "ENTERTAINMENT"],
  ["Indigo Airlines", -6320, "TRAVEL"],
  ["SIP Nifty 50", -10000, "INVESTMENTS"]
] as const;

const categoryMap: Record<string, Category> = {
  Salary: "INCOME",
  Freelance: "INCOME",
  Rent: "HOUSING",
  Swiggy: "FOOD",
  Zomato: "FOOD",
  Blue: "FOOD",
  Uber: "TRANSPORT",
  Metro: "TRANSPORT",
  Amazon: "SHOPPING",
  BESCOM: "UTILITIES",
  Airtel: "UTILITIES",
  Netflix: "SUBSCRIPTIONS",
  Spotify: "SUBSCRIPTIONS",
  Apollo: "HEALTH",
  Cult: "HEALTH",
  BookMyShow: "ENTERTAINMENT",
  Indigo: "TRAVEL",
  SIP: "INVESTMENTS"
};

export const demoTransactions: Transaction[] = Array.from({ length: 50 }, (_, index) => {
  const item = baseTransactions[index % baseTransactions.length];
  const amount = item[1] + (item[1] < 0 ? -(index % 6) * 91 : (index % 4) * 2500);
  const key = item[0].split(" ")[0];
  return {
    id: `txn_${index + 1}`,
    merchant: item[0],
    amount,
    type: amount > 0 ? "INCOME" : "EXPENSE",
    category: categoryMap[key],
    date: subDays(new Date(), index * 2).toISOString(),
    notes: index % 4 === 0 ? "Reviewed by AI" : "",
    tags: index % 5 === 0 ? ["review"] : index % 3 === 0 ? ["recurring"] : [],
    source: index % 2 === 0 ? "HDFC CSV" : "Manual",
    confidence: 84 + (index % 15)
  };
});

export const demoBudgets: Budget[] = [
  { id: "b1", category: "FOOD", limit: 18000, spent: 14320, rollover: 1200 },
  { id: "b2", category: "TRANSPORT", limit: 7000, spent: 4280, rollover: 0 },
  { id: "b3", category: "SHOPPING", limit: 15000, spent: 13240, rollover: 2800 },
  { id: "b4", category: "TRAVEL", limit: 25000, spent: 9240, rollover: 5400 },
  { id: "b5", category: "HEALTH", limit: 9000, spent: 6110, rollover: 0 },
  { id: "b6", category: "SUBSCRIPTIONS", limit: 4000, spent: 2218, rollover: 0 }
];

export const cashFlow = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  value: 91000 + Math.sin(index / 2.7) * 8000 + index * 980
}));

export const monthlyReport = [
  { month: "Jan", income: 180000, expense: 116000 },
  { month: "Feb", income: 188000, expense: 123000 },
  { month: "Mar", income: 211000, expense: 128500 },
  { month: "Apr", income: 195000, expense: 109000 },
  { month: "May", income: 217000, expense: 121000 },
  { month: "Jun", income: 226000, expense: 134000 },
  { month: "Jul", income: 232000, expense: 126000 },
  { month: "Aug", income: 229000, expense: 119000 },
  { month: "Sep", income: 241000, expense: 131000 },
  { month: "Oct", income: 238000, expense: 124000 },
  { month: "Nov", income: 252000, expense: 137000 },
  { month: "Dec", income: 268000, expense: 142000 }
];

export const yoyReport = [
  { quarter: "Q1", current: 246000, previous: 184000 },
  { quarter: "Q2", current: 274000, previous: 203000 },
  { quarter: "Q3", current: 298000, previous: 237000 },
  { quarter: "Q4", current: 312000, previous: 259000 }
];

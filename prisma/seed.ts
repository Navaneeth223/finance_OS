import { PrismaClient, TransactionCategory, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

const userEmail = "demo@financeos.dev";

const merchants = [
  ["Swiggy Instamart", "FOOD", -780],
  ["Zomato Dining", "FOOD", -1240],
  ["Blue Tokai Coffee", "FOOD", -420],
  ["Metro Card Recharge", "TRANSPORT", -600],
  ["Uber India", "TRANSPORT", -510],
  ["BESCOM Electricity", "UTILITIES", -2180],
  ["Airtel Fiber", "UTILITIES", -999],
  ["Netflix", "SUBSCRIPTIONS", -649],
  ["Spotify", "SUBSCRIPTIONS", -119],
  ["Amazon India", "SHOPPING", -2499],
  ["Apollo Pharmacy", "HEALTH", -860],
  ["Cult Fit", "HEALTH", -1799],
  ["BookMyShow", "ENTERTAINMENT", -1500],
  ["Indigo Airlines", "TRAVEL", -6320],
  ["SIP Nifty 50", "INVESTMENTS", -10000],
  ["Salary Credit", "INCOME", 185000],
  ["Freelance Invoice", "INCOME", 32000],
  ["Rent", "HOUSING", -42000],
  ["Coursera", "EDUCATION", -3999]
] as const;

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: "Aarav Mehta",
      image: "https://api.dicebear.com/9.x/notionists/svg?seed=Aarav"
    }
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.chatMessage.deleteMany({ where: { userId: user.id } });

  const transactions = Array.from({ length: 50 }, (_, index) => {
    const merchant = merchants[index % merchants.length];
    const amount = merchant[2] + (merchant[2] < 0 ? -(index % 7) * 73 : (index % 5) * 2500);
    return {
      userId: user.id,
      merchant: merchant[0],
      amount,
      type: amount > 0 ? TransactionType.INCOME : TransactionType.EXPENSE,
      category: merchant[1] as TransactionCategory,
      date: daysAgo(index * 2),
      notes: index % 4 === 0 ? "Auto-imported from bank statement" : "",
      tags: index % 3 === 0 ? ["recurring"] : index % 5 === 0 ? ["review"] : [],
      source: index % 2 === 0 ? "HDFC CSV" : "Manual",
      confidence: 82 + (index % 16)
    };
  });

  await prisma.transaction.createMany({ data: transactions });

  const month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: "FOOD", limit: 18000, rollover: 1200, month },
      { userId: user.id, category: "TRANSPORT", limit: 7000, rollover: 0, month },
      { userId: user.id, category: "SHOPPING", limit: 15000, rollover: 2800, month },
      { userId: user.id, category: "TRAVEL", limit: 25000, rollover: 5400, month },
      { userId: user.id, category: "HEALTH", limit: 9000, rollover: 0, month },
      { userId: user.id, category: "SUBSCRIPTIONS", limit: 4000, rollover: 0, month }
    ]
  });

  await prisma.chatMessage.createMany({
    data: [
      { userId: user.id, role: "USER", content: "Where am I overspending?" },
      {
        userId: user.id,
        role: "ASSISTANT",
        content:
          "Food delivery and shopping are trending above plan. A 12 percent reduction in weekday orders would recover roughly Rs 5,400 this month."
      }
    ]
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

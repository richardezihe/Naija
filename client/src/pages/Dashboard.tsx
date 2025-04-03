import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  username: string;
  telegramId: string;
  balance: number;
  totalEarnings: number;
  totalReferrals: number;
  referralCode: string;
  isActive: boolean;
  joinedAt: string;
}

export default function Dashboard() {
  // Fetch all users from the API
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg text-white">
        <div className="animate-pulse">Loading dashboard data...</div>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const totalBalance = users?.reduce((sum, user) => sum + user.balance, 0) || 0;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">𝐍𝐀𝐈𝐉𝐀 𝐕𝐀𝐋𝐔𝐄 Bot Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 rounded-lg shadow-md bg-blue-500 text-white">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-4xl font-bold">{totalUsers}</p>
        </Card>
        
        <Card className="p-6 rounded-lg shadow-md bg-green-500 text-white">
          <h2 className="text-lg font-semibold mb-2">Total Balance</h2>
          <p className="text-4xl font-bold">₦{totalBalance.toLocaleString()}</p>
        </Card>
      </div>
      
      <div className="rounded-lg overflow-hidden shadow-lg">
        <Table>
          <TableCaption>List of registered users in the system</TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Total Referrals</TableHead>
              <TableHead>Total Earnings</TableHead>
              <TableHead>Joined At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>₦{user.balance.toLocaleString()}</TableCell>
                  <TableCell>{user.totalReferrals}</TableCell>
                  <TableCell>₦{user.totalEarnings.toLocaleString()}</TableCell>
                  <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Film, 
  Users, 
  Newspaper, 
  BookOpen, 
  BarChart3, 
  Trophy, 
  MessageSquare, 
  UserCheck,
  TrendingUp,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="bg-card border-border hover:border-gold/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-display text-foreground">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

export function AdminOverview() {
  const [stats, setStats] = useState({
    movies: 0,
    celebrities: 0,
    news: 0,
    blogs: 0,
    polls: 0,
    users: 0,
    reviews: 0,
    comments: 0,
    feedback: 0,
    promotions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const collections = [
          { name: 'movies', key: 'movies' },
          { name: 'celebrities', key: 'celebrities' },
          { name: 'news', key: 'news' },
          { name: 'blogs', key: 'blogs' },
          { name: 'polls', key: 'polls' },
          { name: 'users', key: 'users' },
          { name: 'reviews', key: 'reviews' },
          { name: 'comments', key: 'comments' },
          { name: 'feedback', key: 'feedback' },
          { name: 'promotionInquiries', key: 'promotions' },
        ];

        const counts: Record<string, number> = {};
        
        for (const col of collections) {
          try {
            const snapshot = await getCountFromServer(collection(db, col.name));
            counts[col.key] = snapshot.data().count;
          } catch {
            counts[col.key] = 0;
          }
        }

        setStats(counts as typeof stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Movies", value: stats.movies, icon: Film, color: "bg-blue-500" },
    { title: "Celebrities", value: stats.celebrities, icon: Users, color: "bg-purple-500" },
    { title: "News Articles", value: stats.news, icon: Newspaper, color: "bg-green-500" },
    { title: "Blog Posts", value: stats.blogs, icon: BookOpen, color: "bg-orange-500" },
    { title: "Active Polls", value: stats.polls, icon: BarChart3, color: "bg-cyan-500" },
    { title: "Registered Users", value: stats.users, icon: UserCheck, color: "bg-gold" },
    { title: "Reviews", value: stats.reviews, icon: MessageSquare, color: "bg-pink-500" },
    { title: "Comments", value: stats.comments, icon: MessageSquare, color: "bg-indigo-500" },
    { title: "Feedback", value: stats.feedback, icon: MessageSquare, color: "bg-teal-500" },
    { title: "Promotion Inquiries", value: stats.promotions, icon: Trophy, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome to Movie Reporter Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Connect to Firebase to view recent activity across your platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gold" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Content</span>
                <span className="font-semibold text-foreground">
                  {stats.movies + stats.news + stats.blogs}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">User Engagement</span>
                <span className="font-semibold text-foreground">
                  {stats.reviews + stats.comments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Inquiries</span>
                <span className="font-semibold text-gold">
                  {stats.feedback + stats.promotions}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

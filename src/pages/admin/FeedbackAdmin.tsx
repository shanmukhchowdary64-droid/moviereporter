import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trash2, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PAGE_SIZE = 10;

interface Feedback {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
}

export function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  async function fetchFeedbacks(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "feedback"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "feedback"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newFeedbacks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Feedback[];

      if (loadMore) {
        setFeedbacks(prev => [...prev, ...newFeedbacks]);
      } else {
        setFeedbacks(newFeedbacks);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(feedback: Feedback) {
    if (!confirm("Are you sure you want to delete this feedback?")) return;
    
    try {
      await deleteDoc(doc(db, "feedback", feedback.id));
      toast.success("Feedback deleted");
      setFeedbacks(prev => prev.filter(f => f.id !== feedback.id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  }

  const filteredFeedbacks = feedbacks.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase()) ||
    f.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h1 className="text-2xl font-display text-foreground flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-gold" />
          Feedback ({feedbacks.length})
        </h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading && feedbacks.length === 0 ? (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" />
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-8 text-center text-muted-foreground">
            No feedback found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map(feedback => (
            <Card key={feedback.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{feedback.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {feedback.email} • {feedback.createdAt && format(feedback.createdAt.toDate(), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(feedback)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{feedback.message}</p>
              </CardContent>
            </Card>
          ))}
          
          {hasMore && (
            <div className="text-center">
              <Button variant="outline" onClick={() => fetchFeedbacks(true)} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

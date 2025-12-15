import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Trash2, Star, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PAGE_SIZE = 10;

interface Review {
  id: string;
  userId: string;
  userEmail: string;
  movieId: string;
  movieName: string;
  rating: number;
  content: string;
  createdAt: Timestamp;
}

interface Comment {
  id: string;
  userId: string;
  userEmail: string;
  articleId: string;
  articleTitle: string;
  articleType: 'news' | 'blog';
  content: string;
  createdAt: Timestamp;
}

export function ModerationAdmin() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastReviewDoc, setLastReviewDoc] = useState<any>(null);
  const [lastCommentDoc, setLastCommentDoc] = useState<any>(null);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    } else {
      fetchComments();
    }
  }, [activeTab]);

  async function fetchReviews(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastReviewDoc) {
        q = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc"),
          startAfter(lastReviewDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];

      if (loadMore) {
        setReviews(prev => [...prev, ...newReviews]);
      } else {
        setReviews(newReviews);
      }

      setLastReviewDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreReviews(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "comments"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastCommentDoc) {
        q = query(
          collection(db, "comments"),
          orderBy("createdAt", "desc"),
          startAfter(lastCommentDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];

      if (loadMore) {
        setComments(prev => [...prev, ...newComments]);
      } else {
        setComments(newComments);
      }

      setLastCommentDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMoreComments(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteReview(review: Review) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    try {
      await deleteDoc(doc(db, "reviews", review.id));
      toast.success("Review deleted");
      setReviews(prev => prev.filter(r => r.id !== review.id));
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  }

  async function handleDeleteComment(comment: Comment) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    try {
      await deleteDoc(doc(db, "comments", comment.id));
      toast.success("Comment deleted");
      setComments(prev => prev.filter(c => c.id !== comment.id));
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  }

  const filteredReviews = reviews.filter(r =>
    r.content.toLowerCase().includes(search.toLowerCase()) ||
    r.movieName?.toLowerCase().includes(search.toLowerCase()) ||
    r.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredComments = comments.filter(c =>
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.articleTitle?.toLowerCase().includes(search.toLowerCase()) ||
    c.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h1 className="text-2xl font-display text-foreground">Content Moderation</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comments ({comments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4 mt-4">
          {loading && reviews.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center text-muted-foreground">
                No reviews found
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredReviews.map(review => (
                <Card key={review.id} className="bg-card border-border">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {review.movieName}
                        <span className="flex items-center text-gold text-sm">
                          <Star className="w-4 h-4 fill-current mr-1" />
                          {review.rating}/5
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        By {review.userEmail} • {review.createdAt && format(review.createdAt.toDate(), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteReview(review)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
              
              {hasMoreReviews && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => fetchReviews(true)} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4 mt-4">
          {loading && comments.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" />
            </div>
          ) : filteredComments.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-center text-muted-foreground">
                No comments found
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredComments.map(comment => (
                <Card key={comment.id} className="bg-card border-border">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div>
                      <CardTitle className="text-base">
                        {comment.articleTitle}
                        <span className="text-muted-foreground text-sm ml-2">({comment.articleType})</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        By {comment.userEmail} • {comment.createdAt && format(comment.createdAt.toDate(), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteComment(comment)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
              
              {hasMoreComments && (
                <div className="text-center">
                  <Button variant="outline" onClick={() => fetchComments(true)} disabled={loading}>
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

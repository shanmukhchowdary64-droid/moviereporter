import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trash2, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PAGE_SIZE = 10;

interface PromotionInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  promotionType: string;
  message: string;
  createdAt: Timestamp;
}

export function PromotionsAdmin() {
  const [inquiries, setInquiries] = useState<PromotionInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "promotionInquiries"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "promotionInquiries"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newInquiries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as PromotionInquiry[];

      if (loadMore) {
        setInquiries(prev => [...prev, ...newInquiries]);
      } else {
        setInquiries(newInquiries);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to fetch promotion inquiries");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(inquiry: PromotionInquiry) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    
    try {
      await deleteDoc(doc(db, "promotionInquiries", inquiry.id));
      toast.success("Inquiry deleted");
      setInquiries(prev => prev.filter(i => i.id !== inquiry.id));
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry");
    }
  }

  const filteredInquiries = inquiries.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.company?.toLowerCase().includes(search.toLowerCase()) ||
    i.promotionType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h1 className="text-2xl font-display text-foreground flex items-center gap-2">
          <Mail className="w-6 h-6 text-gold" />
          Promotion Inquiries ({inquiries.length})
        </h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading && inquiries.length === 0 ? (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" />
        </div>
      ) : filteredInquiries.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-8 text-center text-muted-foreground">
            No promotion inquiries found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map(inquiry => (
            <Card key={inquiry.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {inquiry.name}
                    {inquiry.company && (
                      <span className="text-muted-foreground text-sm">({inquiry.company})</span>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.email} {inquiry.phone && `• ${inquiry.phone}`}
                  </p>
                  <p className="text-sm text-gold mt-1">
                    Type: {inquiry.promotionType}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inquiry.createdAt && format(inquiry.createdAt.toDate(), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => handleDelete(inquiry)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
              </CardContent>
            </Card>
          ))}
          
          {hasMore && (
            <div className="text-center">
              <Button variant="outline" onClick={() => fetchInquiries(true)} disabled={loading}>
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

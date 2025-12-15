import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, addDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const CATEGORIES = [
  "Tollywood", "Bollywood", "Kollywood", "Sandalwood", "Hollywood", "Mollywood", "Pan India",
  "Sports", "Cricket", "Technology", "Politics", "Finance"
];
const PAGE_SIZE = 10;

interface NewsArticle {
  id: string;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  isPromotion: boolean;
  isWeeklyMagazine: boolean;
  scheduledAt?: Timestamp;
  createdAt: Timestamp;
}

export function NewsAdmin() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    category: "",
    isPromotion: false,
    isWeeklyMagazine: false,
    scheduledAt: "",
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "news"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "news"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newArticles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as NewsArticle[];

      if (loadMore) {
        setArticles(prev => [...prev, ...newArticles]);
      } else {
        setArticles(newArticles);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch news articles");
    } finally {
      setLoading(false);
    }
  }

  function openAddDialog() {
    setEditingArticle(null);
    setFormData({
      title: "",
      author: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      category: "",
      isPromotion: false,
      isWeeklyMagazine: false,
      scheduledAt: "",
    });
    setDialogOpen(true);
  }

  function openEditDialog(article: NewsArticle) {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      author: article.author,
      content: article.content,
      excerpt: article.excerpt,
      imageUrl: article.imageUrl,
      category: article.category,
      isPromotion: article.isPromotion,
      isWeeklyMagazine: article.isWeeklyMagazine,
      scheduledAt: article.scheduledAt ? format(article.scheduledAt.toDate(), "yyyy-MM-ddTHH:mm") : "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const articleData = {
        title: formData.title,
        author: formData.author,
        content: formData.content,
        excerpt: formData.excerpt,
        imageUrl: formData.imageUrl,
        category: formData.category,
        isPromotion: formData.isPromotion,
        isWeeklyMagazine: formData.isWeeklyMagazine,
        scheduledAt: formData.scheduledAt ? Timestamp.fromDate(new Date(formData.scheduledAt)) : null,
        updatedAt: Timestamp.now(),
      };

      if (editingArticle) {
        await updateDoc(doc(db, "news", editingArticle.id), articleData);
        toast.success("News article updated successfully");
      } else {
        await addDoc(collection(db, "news"), {
          ...articleData,
          createdAt: Timestamp.now(),
        });
        toast.success("News article added successfully");
      }

      setDialogOpen(false);
      fetchArticles();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save news article");
    }
  }

  async function handleDelete(article: NewsArticle) {
    if (!confirm(`Are you sure you want to delete "${article.title}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "news", article.id));
      toast.success("News article deleted successfully");
      setArticles(prev => prev.filter(a => a.id !== article.id));
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete news article");
    }
  }

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Image",
      accessor: (article: NewsArticle) => (
        <img 
          src={article.imageUrl || "/placeholder.svg"} 
          alt={article.title}
          className="w-16 h-10 object-cover rounded"
        />
      ),
      className: "w-20",
    },
    { 
      header: "Title", 
      accessor: (article: NewsArticle) => (
        <span className="line-clamp-1">{article.title}</span>
      ),
    },
    { header: "Author", accessor: "author" as keyof NewsArticle },
    { header: "Category", accessor: "category" as keyof NewsArticle },
    {
      header: "Promo",
      accessor: (article: NewsArticle) => article.isPromotion ? "✓" : "-",
      className: "text-center",
    },
    {
      header: "Magazine",
      accessor: (article: NewsArticle) => article.isWeeklyMagazine ? "✓" : "-",
      className: "text-center",
    },
    {
      header: "Date",
      accessor: (article: NewsArticle) => format(article.createdAt.toDate(), "MMM dd, yyyy"),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="News Management"
        data={filteredArticles}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onAddNew={openAddDialog}
        addNewLabel="Add News"
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchArticles(true)}
        renderActions={(article) => (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => openEditDialog(article)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(article)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit News Article" : "Add News Article"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author *</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                placeholder="Brief summary..."
              />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Scheduled Publishing</Label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isPromotion"
                  checked={formData.isPromotion}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPromotion: !!checked }))}
                />
                <Label htmlFor="isPromotion">Is Promotion?</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isWeeklyMagazine"
                  checked={formData.isWeeklyMagazine}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isWeeklyMagazine: !!checked }))}
                />
                <Label htmlFor="isWeeklyMagazine">Is Weekly Magazine?</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                {editingArticle ? "Update Article" : "Add Article"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

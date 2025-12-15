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
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PAGE_SIZE = 10;

interface BlogPost {
  id: string;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  isPromotion: boolean;
  isWeeklyMagazine: boolean;
  scheduledAt?: Timestamp;
  createdAt: Timestamp;
}

export function BlogsAdmin() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    isPromotion: false,
    isWeeklyMagazine: false,
    scheduledAt: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "blogs"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newBlogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as BlogPost[];

      if (loadMore) {
        setBlogs(prev => [...prev, ...newBlogs]);
      } else {
        setBlogs(newBlogs);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  }

  function openAddDialog() {
    setEditingBlog(null);
    setFormData({
      title: "",
      author: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      isPromotion: false,
      isWeeklyMagazine: false,
      scheduledAt: "",
    });
    setDialogOpen(true);
  }

  function openEditDialog(blog: BlogPost) {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      author: blog.author,
      content: blog.content,
      excerpt: blog.excerpt,
      imageUrl: blog.imageUrl,
      isPromotion: blog.isPromotion,
      isWeeklyMagazine: blog.isWeeklyMagazine,
      scheduledAt: blog.scheduledAt ? format(blog.scheduledAt.toDate(), "yyyy-MM-ddTHH:mm") : "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const blogData = {
        title: formData.title,
        author: formData.author,
        content: formData.content,
        excerpt: formData.excerpt,
        imageUrl: formData.imageUrl,
        isPromotion: formData.isPromotion,
        isWeeklyMagazine: formData.isWeeklyMagazine,
        scheduledAt: formData.scheduledAt ? Timestamp.fromDate(new Date(formData.scheduledAt)) : null,
        updatedAt: Timestamp.now(),
      };

      if (editingBlog) {
        await updateDoc(doc(db, "blogs", editingBlog.id), blogData);
        toast.success("Blog post updated successfully");
      } else {
        await addDoc(collection(db, "blogs"), {
          ...blogData,
          createdAt: Timestamp.now(),
        });
        toast.success("Blog post added successfully");
      }

      setDialogOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog post");
    }
  }

  async function handleDelete(blog: BlogPost) {
    if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "blogs", blog.id));
      toast.success("Blog post deleted successfully");
      setBlogs(prev => prev.filter(b => b.id !== blog.id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog post");
    }
  }

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Image",
      accessor: (blog: BlogPost) => (
        <img 
          src={blog.imageUrl || "/placeholder.svg"} 
          alt={blog.title}
          className="w-16 h-10 object-cover rounded"
        />
      ),
      className: "w-20",
    },
    { 
      header: "Title", 
      accessor: (blog: BlogPost) => (
        <span className="line-clamp-1">{blog.title}</span>
      ),
    },
    { header: "Author", accessor: "author" as keyof BlogPost },
    {
      header: "Promo",
      accessor: (blog: BlogPost) => blog.isPromotion ? "✓" : "-",
      className: "text-center",
    },
    {
      header: "Magazine",
      accessor: (blog: BlogPost) => blog.isWeeklyMagazine ? "✓" : "-",
      className: "text-center",
    },
    {
      header: "Date",
      accessor: (blog: BlogPost) => format(blog.createdAt.toDate(), "MMM dd, yyyy"),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Blogs Management"
        data={filteredBlogs}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onAddNew={openAddDialog}
        addNewLabel="Add Blog"
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchBlogs(true)}
        renderActions={(blog) => (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => openEditDialog(blog)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(blog)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{editingBlog ? "Edit Blog Post" : "Add Blog Post"}</DialogTitle>
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

            <div className="space-y-2">
              <Label>Author *</Label>
              <Input
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                required
              />
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
                {editingBlog ? "Update Blog" : "Add Blog"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

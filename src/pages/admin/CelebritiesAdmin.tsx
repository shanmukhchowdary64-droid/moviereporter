import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, addDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

interface Celebrity {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  createdAt: Timestamp;
}

export function CelebritiesAdmin() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCelebrity, setEditingCelebrity] = useState<Celebrity | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchCelebrities();
  }, []);

  async function fetchCelebrities(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "celebrities"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "celebrities"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newCelebrities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Celebrity[];

      if (loadMore) {
        setCelebrities(prev => [...prev, ...newCelebrities]);
      } else {
        setCelebrities(newCelebrities);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching celebrities:", error);
      toast.error("Failed to fetch celebrities");
    } finally {
      setLoading(false);
    }
  }

  function openAddDialog() {
    setEditingCelebrity(null);
    setFormData({ name: "", role: "", description: "", imageUrl: "" });
    setDialogOpen(true);
  }

  function openEditDialog(celebrity: Celebrity) {
    setEditingCelebrity(celebrity);
    setFormData({
      name: celebrity.name,
      role: celebrity.role,
      description: celebrity.description,
      imageUrl: celebrity.imageUrl,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const celebrityData = {
        name: formData.name,
        role: formData.role,
        description: formData.description,
        imageUrl: formData.imageUrl,
        updatedAt: Timestamp.now(),
      };

      if (editingCelebrity) {
        await updateDoc(doc(db, "celebrities", editingCelebrity.id), celebrityData);
        toast.success("Celebrity updated successfully");
      } else {
        await addDoc(collection(db, "celebrities"), {
          ...celebrityData,
          createdAt: Timestamp.now(),
        });
        toast.success("Celebrity added successfully");
      }

      setDialogOpen(false);
      fetchCelebrities();
    } catch (error) {
      console.error("Error saving celebrity:", error);
      toast.error("Failed to save celebrity");
    }
  }

  async function handleDelete(celebrity: Celebrity) {
    if (!confirm(`Are you sure you want to delete "${celebrity.name}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "celebrities", celebrity.id));
      toast.success("Celebrity deleted successfully");
      setCelebrities(prev => prev.filter(c => c.id !== celebrity.id));
    } catch (error) {
      console.error("Error deleting celebrity:", error);
      toast.error("Failed to delete celebrity");
    }
  }

  const filteredCelebrities = celebrities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Image",
      accessor: (celebrity: Celebrity) => (
        <img 
          src={celebrity.imageUrl || "/placeholder.svg"} 
          alt={celebrity.name}
          className="w-12 h-12 object-cover rounded-full"
        />
      ),
      className: "w-16",
    },
    { header: "Name", accessor: "name" as keyof Celebrity },
    { header: "Role", accessor: "role" as keyof Celebrity },
    {
      header: "Description",
      accessor: (celebrity: Celebrity) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {celebrity.description || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Celebrities Management"
        data={filteredCelebrities}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onAddNew={openAddDialog}
        addNewLabel="Add Celebrity"
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchCelebrities(true)}
        renderActions={(celebrity) => (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => openEditDialog(celebrity)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(celebrity)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle>{editingCelebrity ? "Edit Celebrity" : "Add New Celebrity"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role/Profession *</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                required
                placeholder="Actor, Director, Producer..."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
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

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                {editingCelebrity ? "Update Celebrity" : "Add Celebrity"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

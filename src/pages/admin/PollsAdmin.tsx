import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, addDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PAGE_SIZE = 10;

interface PollOption {
  id: string;
  text: string;
  imageUrl?: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  startTime: Timestamp;
  endTime: Timestamp;
  createdAt: Timestamp;
}

export function PollsAdmin() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  
  const [formData, setFormData] = useState({
    question: "",
    options: [{ id: "1", text: "", imageUrl: "", votes: 0 }],
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetchPolls();
  }, []);

  async function fetchPolls(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "polls"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "polls"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newPolls = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Poll[];

      if (loadMore) {
        setPolls(prev => [...prev, ...newPolls]);
      } else {
        setPolls(newPolls);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching polls:", error);
      toast.error("Failed to fetch polls");
    } finally {
      setLoading(false);
    }
  }

  function openAddDialog() {
    setEditingPoll(null);
    setFormData({
      question: "",
      options: [{ id: "1", text: "", imageUrl: "", votes: 0 }],
      startTime: "",
      endTime: "",
    });
    setDialogOpen(true);
  }

  function openEditDialog(poll: Poll) {
    setEditingPoll(poll);
    setFormData({
      question: poll.question,
      options: poll.options,
      startTime: format(poll.startTime.toDate(), "yyyy-MM-ddTHH:mm"),
      endTime: format(poll.endTime.toDate(), "yyyy-MM-ddTHH:mm"),
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (formData.options.filter(o => o.text.trim()).length < 2) {
      toast.error("Please add at least 2 options");
      return;
    }

    try {
      const pollData = {
        question: formData.question,
        options: formData.options.filter(o => o.text.trim()).map((o, idx) => ({
          ...o,
          id: o.id || String(idx + 1),
        })),
        startTime: Timestamp.fromDate(new Date(formData.startTime)),
        endTime: Timestamp.fromDate(new Date(formData.endTime)),
        updatedAt: Timestamp.now(),
      };

      if (editingPoll) {
        await updateDoc(doc(db, "polls", editingPoll.id), pollData);
        toast.success("Poll updated successfully");
      } else {
        await addDoc(collection(db, "polls"), {
          ...pollData,
          createdAt: Timestamp.now(),
        });
        toast.success("Poll added successfully");
      }

      setDialogOpen(false);
      fetchPolls();
    } catch (error) {
      console.error("Error saving poll:", error);
      toast.error("Failed to save poll");
    }
  }

  async function handleDelete(poll: Poll) {
    if (!confirm(`Are you sure you want to delete this poll?`)) return;
    
    try {
      await deleteDoc(doc(db, "polls", poll.id));
      toast.success("Poll deleted successfully");
      setPolls(prev => prev.filter(p => p.id !== poll.id));
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll");
    }
  }

  function addOption() {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { id: String(Date.now()), text: "", imageUrl: "", votes: 0 }],
    }));
  }

  function removeOption(index: number) {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  }

  function updateOption(index: number, field: 'text' | 'imageUrl', value: string) {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      ),
    }));
  }

  const filteredPolls = polls.filter(p =>
    p.question.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      header: "Question", 
      accessor: (poll: Poll) => (
        <span className="line-clamp-2">{poll.question}</span>
      ),
    },
    { 
      header: "Options", 
      accessor: (poll: Poll) => poll.options.length,
      className: "text-center",
    },
    {
      header: "Total Votes",
      accessor: (poll: Poll) => poll.options.reduce((sum, o) => sum + (o.votes || 0), 0),
      className: "text-center",
    },
    {
      header: "Start",
      accessor: (poll: Poll) => format(poll.startTime.toDate(), "MMM dd, yyyy HH:mm"),
    },
    {
      header: "End",
      accessor: (poll: Poll) => format(poll.endTime.toDate(), "MMM dd, yyyy HH:mm"),
    },
    {
      header: "Status",
      accessor: (poll: Poll) => {
        const now = new Date();
        const start = poll.startTime.toDate();
        const end = poll.endTime.toDate();
        if (now < start) return <span className="text-yellow-500">Scheduled</span>;
        if (now > end) return <span className="text-muted-foreground">Ended</span>;
        return <span className="text-green-500">Active</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Polls Management"
        data={filteredPolls}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onAddNew={openAddDialog}
        addNewLabel="Add Poll"
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchPolls(true)}
        renderActions={(poll) => (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => openEditDialog(poll)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(poll)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{editingPoll ? "Edit Poll" : "Add New Poll"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Question *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options (min 2)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>
              
              {formData.options.map((option, index) => (
                <div key={option.id} className="flex gap-2 items-start p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Option ${index + 1} text`}
                      value={option.text}
                      onChange={(e) => updateOption(index, 'text', e.target.value)}
                    />
                    <Input
                      placeholder="Image URL (optional)"
                      value={option.imageUrl}
                      onChange={(e) => updateOption(index, 'imageUrl', e.target.value)}
                    />
                  </div>
                  {formData.options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>End Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                {editingPoll ? "Update Poll" : "Add Poll"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

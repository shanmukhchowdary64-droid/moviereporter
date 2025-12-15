import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, deleteDoc, addDoc, updateDoc, Timestamp, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, X, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const INDUSTRIES = ["Tollywood", "Bollywood", "Kollywood", "Sandalwood", "Hollywood", "Mollywood", "Pan India"];
const OTT_PLATFORMS = [
  { id: "netflix", name: "Netflix", icon: "🎬" },
  { id: "prime", name: "Amazon Prime", icon: "📺" },
  { id: "hotstar", name: "Disney+ Hotstar", icon: "⭐" },
  { id: "zee5", name: "ZEE5", icon: "🎥" },
  { id: "sonyliv", name: "SonyLIV", icon: "📱" },
  { id: "aha", name: "Aha", icon: "🎭" },
  { id: "jiocinema", name: "JioCinema", icon: "📡" },
];
const PAGE_SIZE = 10;

interface Movie {
  id: string;
  name: string;
  genre: string;
  industry: string;
  releaseDate: Timestamp;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  isTopBoxOffice: boolean;
  ottPlatforms: string[];
  cast: { id: string; name: string }[];
  scheduledAt?: Timestamp;
  createdAt: Timestamp;
}

interface Celebrity {
  id: string;
  name: string;
}

export function MoviesAdmin() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    industry: "",
    releaseDate: "",
    description: "",
    posterUrl: "",
    trailerUrl: "",
    isTopBoxOffice: false,
    ottPlatforms: [] as string[],
    cast: [] as { id: string; name: string }[],
    scheduledAt: "",
  });

  // Cast search
  const [castSearch, setCastSearch] = useState("");
  const [castSuggestions, setCastSuggestions] = useState<Celebrity[]>([]);
  const [showCastSuggestions, setShowCastSuggestions] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (castSearch.length >= 2) {
      searchCelebrities(castSearch);
    } else {
      setCastSuggestions([]);
    }
  }, [castSearch]);

  async function searchCelebrities(searchTerm: string) {
    try {
      const q = query(
        collection(db, "celebrities"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      setCastSuggestions(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
      setShowCastSuggestions(true);
    } catch (error) {
      console.error("Error searching celebrities:", error);
    }
  }

  async function fetchMovies(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "movies"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "movies"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newMovies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Movie[];

      if (loadMore) {
        setMovies(prev => [...prev, ...newMovies]);
      } else {
        setMovies(newMovies);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }

  function openAddDialog() {
    setEditingMovie(null);
    setFormData({
      name: "",
      genre: "",
      industry: "",
      releaseDate: "",
      description: "",
      posterUrl: "",
      trailerUrl: "",
      isTopBoxOffice: false,
      ottPlatforms: [],
      cast: [],
      scheduledAt: "",
    });
    setDialogOpen(true);
  }

  function openEditDialog(movie: Movie) {
    setEditingMovie(movie);
    setFormData({
      name: movie.name,
      genre: movie.genre,
      industry: movie.industry,
      releaseDate: movie.releaseDate ? format(movie.releaseDate.toDate(), "yyyy-MM-dd") : "",
      description: movie.description,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      isTopBoxOffice: movie.isTopBoxOffice,
      ottPlatforms: movie.ottPlatforms || [],
      cast: movie.cast || [],
      scheduledAt: movie.scheduledAt ? format(movie.scheduledAt.toDate(), "yyyy-MM-ddTHH:mm") : "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const movieData = {
        name: formData.name,
        genre: formData.genre,
        industry: formData.industry,
        releaseDate: Timestamp.fromDate(new Date(formData.releaseDate)),
        description: formData.description,
        posterUrl: formData.posterUrl,
        trailerUrl: formData.trailerUrl,
        isTopBoxOffice: formData.isTopBoxOffice,
        ottPlatforms: formData.ottPlatforms,
        cast: formData.cast,
        scheduledAt: formData.scheduledAt ? Timestamp.fromDate(new Date(formData.scheduledAt)) : null,
        updatedAt: Timestamp.now(),
      };

      if (editingMovie) {
        await updateDoc(doc(db, "movies", editingMovie.id), movieData);
        toast.success("Movie updated successfully");
      } else {
        await addDoc(collection(db, "movies"), {
          ...movieData,
          createdAt: Timestamp.now(),
        });
        toast.success("Movie added successfully");
      }

      setDialogOpen(false);
      fetchMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
      toast.error("Failed to save movie");
    }
  }

  async function handleDelete(movie: Movie) {
    if (!confirm(`Are you sure you want to delete "${movie.name}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "movies", movie.id));
      toast.success("Movie deleted successfully");
      setMovies(prev => prev.filter(m => m.id !== movie.id));
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    }
  }

  function addCastMember(celebrity: Celebrity) {
    if (!formData.cast.find(c => c.id === celebrity.id)) {
      setFormData(prev => ({
        ...prev,
        cast: [...prev.cast, celebrity],
      }));
    }
    setCastSearch("");
    setShowCastSuggestions(false);
  }

  function removeCastMember(id: string) {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter(c => c.id !== id),
    }));
  }

  function toggleOttPlatform(platformId: string) {
    setFormData(prev => ({
      ...prev,
      ottPlatforms: prev.ottPlatforms.includes(platformId)
        ? prev.ottPlatforms.filter(p => p !== platformId)
        : [...prev.ottPlatforms, platformId],
    }));
  }

  const filteredMovies = movies.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      header: "Poster",
      accessor: (movie: Movie) => (
        <img 
          src={movie.posterUrl || "/placeholder.svg"} 
          alt={movie.name}
          className="w-12 h-16 object-cover rounded"
        />
      ),
      className: "w-16",
    },
    { header: "Name", accessor: "name" as keyof Movie },
    { header: "Industry", accessor: "industry" as keyof Movie },
    { header: "Genre", accessor: "genre" as keyof Movie },
    {
      header: "Release Date",
      accessor: (movie: Movie) => movie.releaseDate ? format(movie.releaseDate.toDate(), "MMM dd, yyyy") : "-",
    },
    {
      header: "Top Box Office",
      accessor: (movie: Movie) => movie.isTopBoxOffice ? "✓" : "-",
      className: "text-center",
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Movies Management"
        data={filteredMovies}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onAddNew={openAddDialog}
        addNewLabel="Add Movie"
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchMovies(true)}
        renderActions={(movie) => (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => openEditDialog(movie)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(movie)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Movie Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Genre *</Label>
                <Input
                  value={formData.genre}
                  onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                  required
                  placeholder="Action, Drama, Comedy..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {INDUSTRIES.map(ind => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Release Date *</Label>
                <Input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Poster Image URL</Label>
                <Input
                  value={formData.posterUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, posterUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>YouTube Trailer URL</Label>
                <Input
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, trailerUrl: e.target.value }))}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Scheduled Publishing</Label>
              <Input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              />
            </div>

            {/* OTT Platforms */}
            <div className="space-y-2">
              <Label>OTT Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {OTT_PLATFORMS.map(platform => (
                  <Button
                    key={platform.id}
                    type="button"
                    variant={formData.ottPlatforms.includes(platform.id) ? "gold" : "outline"}
                    size="sm"
                    onClick={() => toggleOttPlatform(platform.id)}
                  >
                    {platform.icon} {platform.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cast */}
            <div className="space-y-2">
              <Label>Cast Members</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={castSearch}
                  onChange={(e) => setCastSearch(e.target.value)}
                  placeholder="Search celebrities..."
                  className="pl-9"
                  onFocus={() => castSuggestions.length > 0 && setShowCastSuggestions(true)}
                />
                {showCastSuggestions && castSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                    {castSuggestions.map(celeb => (
                      <button
                        key={celeb.id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-secondary"
                        onClick={() => addCastMember(celeb)}
                      >
                        {celeb.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {formData.cast.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.cast.map(member => (
                    <div key={member.id} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
                      <span className="text-sm">{member.name}</span>
                      <button type="button" onClick={() => removeCastMember(member.id)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Box Office */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="topBoxOffice"
                checked={formData.isTopBoxOffice}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTopBoxOffice: !!checked }))}
              />
              <Label htmlFor="topBoxOffice">Mark as Top Box Office</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                {editingMovie ? "Update Movie" : "Add Movie"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

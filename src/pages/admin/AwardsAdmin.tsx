import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, doc, deleteDoc, addDoc, updateDoc, Timestamp, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2, Plus, Search, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const INDUSTRIES = ["Tollywood", "Bollywood", "Kollywood", "Sandalwood", "Hollywood", "Mollywood", "Pan India"];

interface Nominee {
  id: string;
  celebrityId: string;
  celebrityName: string;
  movieId: string;
  movieName: string;
  votes: number;
}

interface Category {
  id: string;
  name: string;
  industry: string;
  startTime: Timestamp;
  endTime: Timestamp;
  nominees: Nominee[];
  createdAt: Timestamp;
}

interface Celebrity {
  id: string;
  name: string;
}

interface Movie {
  id: string;
  name: string;
}

export function AwardsAdmin() {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Category dialog
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });

  // Nominee dialog
  const [nomineeDialogOpen, setNomineeDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [nomineeForm, setNomineeForm] = useState({
    celebrityId: "",
    celebrityName: "",
    movieId: "",
    movieName: "",
  });

  // Search suggestions
  const [celebritySearch, setCelebritySearch] = useState("");
  const [celebritySuggestions, setCelebritySuggestions] = useState<Celebrity[]>([]);
  const [showCelebritySuggestions, setShowCelebritySuggestions] = useState(false);
  
  const [movieSearch, setMovieSearch] = useState("");
  const [movieSuggestions, setMovieSuggestions] = useState<Movie[]>([]);
  const [showMovieSuggestions, setShowMovieSuggestions] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [selectedIndustry]);

  useEffect(() => {
    if (celebritySearch.length >= 2) {
      searchCelebrities(celebritySearch);
    } else {
      setCelebritySuggestions([]);
    }
  }, [celebritySearch]);

  useEffect(() => {
    if (movieSearch.length >= 2) {
      searchMovies(movieSearch);
    } else {
      setMovieSuggestions([]);
    }
  }, [movieSearch]);

  async function searchCelebrities(searchTerm: string) {
    try {
      const q = query(
        collection(db, "celebrities"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      setCelebritySuggestions(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
      setShowCelebritySuggestions(true);
    } catch (error) {
      console.error("Error searching celebrities:", error);
    }
  }

  async function searchMovies(searchTerm: string) {
    try {
      const q = query(
        collection(db, "movies"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      setMovieSuggestions(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
      setShowMovieSuggestions(true);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  }

  async function fetchCategories() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "awardCategories"),
        where("industry", "==", selectedIndustry),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setCategories(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch award categories");
    } finally {
      setLoading(false);
    }
  }

  function openAddCategoryDialog() {
    setEditingCategory(null);
    setCategoryForm({ name: "", startTime: "", endTime: "" });
    setCategoryDialogOpen(true);
  }

  function openEditCategoryDialog(category: Category) {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      startTime: format(category.startTime.toDate(), "yyyy-MM-ddTHH:mm"),
      endTime: format(category.endTime.toDate(), "yyyy-MM-ddTHH:mm"),
    });
    setCategoryDialogOpen(true);
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const categoryData = {
        name: categoryForm.name,
        industry: selectedIndustry,
        startTime: Timestamp.fromDate(new Date(categoryForm.startTime)),
        endTime: Timestamp.fromDate(new Date(categoryForm.endTime)),
        updatedAt: Timestamp.now(),
      };

      if (editingCategory) {
        await updateDoc(doc(db, "awardCategories", editingCategory.id), categoryData);
        toast.success("Category updated successfully");
      } else {
        await addDoc(collection(db, "awardCategories"), {
          ...categoryData,
          nominees: [],
          createdAt: Timestamp.now(),
        });
        toast.success("Category added successfully");
      }

      setCategoryDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  }

  async function handleDeleteCategory(category: Category) {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    
    try {
      await deleteDoc(doc(db, "awardCategories", category.id));
      toast.success("Category deleted successfully");
      setCategories(prev => prev.filter(c => c.id !== category.id));
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  }

  function openNomineeDialog(category: Category) {
    setSelectedCategory(category);
    setNomineeForm({ celebrityId: "", celebrityName: "", movieId: "", movieName: "" });
    setCelebritySearch("");
    setMovieSearch("");
    setNomineeDialogOpen(true);
  }

  function selectCelebrity(celebrity: Celebrity) {
    setNomineeForm(prev => ({
      ...prev,
      celebrityId: celebrity.id,
      celebrityName: celebrity.name,
    }));
    setCelebritySearch(celebrity.name);
    setShowCelebritySuggestions(false);
  }

  function selectMovie(movie: Movie) {
    setNomineeForm(prev => ({
      ...prev,
      movieId: movie.id,
      movieName: movie.name,
    }));
    setMovieSearch(movie.name);
    setShowMovieSuggestions(false);
  }

  async function handleAddNominee(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCategory || !nomineeForm.celebrityId || !nomineeForm.movieId) {
      toast.error("Please select both celebrity and movie");
      return;
    }

    try {
      const newNominee: Nominee = {
        id: String(Date.now()),
        celebrityId: nomineeForm.celebrityId,
        celebrityName: nomineeForm.celebrityName,
        movieId: nomineeForm.movieId,
        movieName: nomineeForm.movieName,
        votes: 0,
      };

      await updateDoc(doc(db, "awardCategories", selectedCategory.id), {
        nominees: [...(selectedCategory.nominees || []), newNominee],
        updatedAt: Timestamp.now(),
      });

      toast.success("Nominee added successfully");
      setNomineeDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding nominee:", error);
      toast.error("Failed to add nominee");
    }
  }

  async function handleRemoveNominee(category: Category, nomineeId: string) {
    if (!confirm("Are you sure you want to remove this nominee?")) return;

    try {
      await updateDoc(doc(db, "awardCategories", category.id), {
        nominees: category.nominees.filter(n => n.id !== nomineeId),
        updatedAt: Timestamp.now(),
      });

      toast.success("Nominee removed successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error removing nominee:", error);
      toast.error("Failed to remove nominee");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h1 className="text-2xl font-display text-foreground">Awards Management</h1>
        <div className="flex gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {INDUSTRIES.map(ind => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="gold" onClick={openAddCategoryDialog}>
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : categories.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-8 text-center text-muted-foreground">
            No categories found for {selectedIndustry}. Add a category to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {categories.map(category => (
            <Card key={category.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-gold" />
                    {category.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(category.startTime.toDate(), "MMM dd, yyyy")} - {format(category.endTime.toDate(), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => openNomineeDialog(category)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Nominee
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEditCategoryDialog(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteCategory(category)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {category.nominees && category.nominees.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.nominees.map(nominee => (
                      <div key={nominee.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium">{nominee.celebrityName}</p>
                          <p className="text-sm text-muted-foreground">{nominee.movieName}</p>
                          <p className="text-sm text-gold">{nominee.votes || 0} votes</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleRemoveNominee(category, nominee.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No nominees added yet</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                required
                placeholder="Best Actor, Best Director..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voting Start Time *</Label>
                <Input
                  type="datetime-local"
                  value={categoryForm.startTime}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Voting End Time *</Label>
                <Input
                  type="datetime-local"
                  value={categoryForm.endTime}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                {editingCategory ? "Update Category" : "Add Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Nominee Dialog */}
      <Dialog open={nomineeDialogOpen} onOpenChange={setNomineeDialogOpen}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader>
            <DialogTitle>Add Nominee to {selectedCategory?.name}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddNominee} className="space-y-4">
            <div className="space-y-2">
              <Label>Celebrity *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={celebritySearch}
                  onChange={(e) => setCelebritySearch(e.target.value)}
                  placeholder="Search celebrity..."
                  className="pl-9"
                  onFocus={() => celebritySuggestions.length > 0 && setShowCelebritySuggestions(true)}
                />
                {showCelebritySuggestions && celebritySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                    {celebritySuggestions.map(celeb => (
                      <button
                        key={celeb.id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-secondary"
                        onClick={() => selectCelebrity(celeb)}
                      >
                        {celeb.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Movie (Nominated For) *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  placeholder="Search movie..."
                  className="pl-9"
                  onFocus={() => movieSuggestions.length > 0 && setShowMovieSuggestions(true)}
                />
                {showMovieSuggestions && movieSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">
                    {movieSuggestions.map(movie => (
                      <button
                        key={movie.id}
                        type="button"
                        className="w-full px-4 py-2 text-left hover:bg-secondary"
                        onClick={() => selectMovie(movie)}
                      >
                        {movie.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setNomineeDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold">
                Add Nominee
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

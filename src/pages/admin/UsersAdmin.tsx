import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Ban, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PAGE_SIZE = 10;

interface User {
  id: string;
  email: string;
  username?: string;
  phone?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  isActive?: boolean;
  createdAt: Timestamp;
  lastActiveAt?: Timestamp;
}

export function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(loadMore = false) {
    setLoading(true);
    try {
      let q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);
      const newUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      if (loadMore) {
        setUsers(prev => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function handlePromoteToAdmin(user: User) {
    if (!confirm(`Promote ${user.email} to admin?`)) return;
    
    try {
      await updateDoc(doc(db, "users", user.id), { role: 'admin' });
      toast.success("User promoted to admin");
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: 'admin' } : u));
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user");
    }
  }

  async function handleDemoteToUser(user: User) {
    if (!confirm(`Remove admin privileges from ${user.email}?`)) return;
    
    try {
      await updateDoc(doc(db, "users", user.id), { role: 'user' });
      toast.success("Admin privileges removed");
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: 'user' } : u));
    } catch (error) {
      console.error("Error demoting user:", error);
      toast.error("Failed to demote user");
    }
  }

  async function handleBlockUser(user: User) {
    const action = user.isBlocked ? "unblock" : "block";
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.email}?`)) return;
    
    try {
      await updateDoc(doc(db, "users", user.id), { isBlocked: !user.isBlocked });
      toast.success(`User ${action}ed`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(`Failed to ${action} user`);
    }
  }

  async function handleDeleteUser(user: User) {
    if (!confirm(`Are you sure you want to delete ${user.email}? This action cannot be undone.`)) return;
    
    try {
      await deleteDoc(doc(db, "users", user.id));
      toast.success("User deleted");
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      header: "Email", 
      accessor: "email" as keyof User,
    },
    { 
      header: "Username", 
      accessor: (user: User) => user.username || "-",
    },
    { 
      header: "Phone", 
      accessor: (user: User) => user.phone || "-",
    },
    { 
      header: "Role", 
      accessor: (user: User) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-gold text-background' : ''}>
          {user.role}
        </Badge>
      ),
    },
    { 
      header: "Status", 
      accessor: (user: User) => (
        <div className="flex gap-1">
          {user.isBlocked && (
            <Badge variant="destructive">Blocked</Badge>
          )}
          {user.isActive && !user.isBlocked && (
            <Badge variant="default" className="bg-green-500">Active</Badge>
          )}
        </div>
      ),
    },
    { 
      header: "Joined", 
      accessor: (user: User) => user.createdAt ? format(user.createdAt.toDate(), "MMM dd, yyyy") : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Users Management"
        data={filteredUsers}
        columns={columns}
        searchValue={search}
        onSearchChange={setSearch}
        onAddNew={() => {}}
        addNewLabel=""
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchUsers(true)}
        renderActions={(user) => (
          <div className="flex gap-1">
            {user.role === 'user' ? (
              <Button size="icon" variant="ghost" title="Promote to Admin" onClick={() => handlePromoteToAdmin(user)}>
                <Shield className="w-4 h-4 text-gold" />
              </Button>
            ) : (
              <Button size="icon" variant="ghost" title="Demote to User" onClick={() => handleDemoteToUser(user)}>
                <UserCheck className="w-4 h-4" />
              </Button>
            )}
            <Button 
              size="icon" 
              variant="ghost" 
              title={user.isBlocked ? "Unblock" : "Block"}
              onClick={() => handleBlockUser(user)}
            >
              <Ban className={`w-4 h-4 ${user.isBlocked ? 'text-green-500' : 'text-yellow-500'}`} />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-destructive"
              title="Delete"
              onClick={() => handleDeleteUser(user)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}

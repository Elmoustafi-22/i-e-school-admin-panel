"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Class } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: "", teacher: "", description: "" })
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const { toast } = useToast()

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data: Class[] = await response.json();
      setClasses(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load classes",
        variant: "destructive",
      });
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.teacher) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClass.name,
          teacher: newClass.teacher,
          description: newClass.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add class");
      }

      setNewClass({ name: "", teacher: "", description: "" });
      setIsAddDialogOpen(false);
      fetchClasses(); // Refresh the list of classes

      toast({
        title: "Success",
        description: "Class added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add class",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;

    if (!editingClass.name || !editingClass.teacher) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/classes/${editingClass._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingClass.name,
          teacher: editingClass.teacher,
          description: editingClass.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update class");
      }

      setIsEditDialogOpen(false);
      setEditingClass(null);
      fetchClasses();

      toast({
        title: "Success",
        description: "Class updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update class",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (classItem: Class) => {
    setEditingClass(classItem);
    setIsEditDialogOpen(true);
  };
  
  const handleEditingClassChange = (field: keyof Omit<Class, '_id' | 'createdAt' | 'updatedAt' | 'numberOfStudents'>, value: string) => {
    setEditingClass(prev => {
        if (!prev) return null;
        return { ...prev, [field]: value };
    });
  };

  const handleDeleteClass = async (id: string) => {
    try {
      const response = await fetch(`/api/classes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete class");
      }

      fetchClasses(); // Refresh the list of classes
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete class",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Classes</h2>
          <p className="mt-2 text-muted-foreground">Manage all classes and courses</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>Create a new class with teacher and description</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Mathematics 101"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher Name *</Label>
                <Input
                  id="teacher"
                  placeholder="e.g., Dr. Sarah Johnson"
                  value={newClass.teacher}
                  onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the class"
                  value={newClass.description}
                  onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClass}>Add Class</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>A list of all classes with their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>No. of Students</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem: Class) => (
                <TableRow key={classItem._id}>
                  <TableCell className="font-medium">{classItem.name}</TableCell>
                  <TableCell>{classItem.teacher}</TableCell>
                  <TableCell>{classItem.numberOfStudents}</TableCell>
                  <TableCell className="max-w-xs truncate">{classItem.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(classItem)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(classItem._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit Class Dialog */}
      {editingClass && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
              <DialogDescription>Update the details of the class.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Class Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Mathematics 101"
                  value={editingClass.name}
                  onChange={(e) => handleEditingClassChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-teacher">Teacher Name *</Label>
                <Input
                  id="edit-teacher"
                  placeholder="e.g., Dr. Sarah Johnson"
                  value={editingClass.teacher}
                  onChange={(e) => handleEditingClassChange('teacher', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Brief description of the class"
                  value={editingClass.description || ''}
                  onChange={(e) => handleEditingClassChange('description', e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setEditingClass(null); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateClass}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
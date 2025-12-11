"use client"
import { useState, useEffect, useCallback } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Student, Class } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

type StudentFormData = Omit<Student, 'id' | '_id' | 'createdAt' | 'updatedAt'>;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [availableClasses, setAvailableClasses] = useState<Class[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const [currentStudent, setCurrentStudent] = useState<Partial<StudentFormData & { _id?: string }>>({ name: "", className: "", email: "", status: "Active" })
  const [loading, setLoading] = useState(true);
  const { toast } = useToast()

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsResponse, classesResponse] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes"),
      ]);

      if (!studentsResponse.ok) {
        throw new Error("Failed to fetch students");
      }
      if (!classesResponse.ok) {
        throw new Error("Failed to fetch classes");
      }

      const studentsData: Student[] = await studentsResponse.json();
      const classesData: Class[] = await classesResponse.json();
      
      setStudents(studentsData);
      setAvailableClasses(classesData);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load page data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const resetDialog = () => {
    setDialogMode('add');
    setCurrentStudent({ name: "", className: "", email: "", status: "Active" });
    setIsDialogOpen(false);
  };

  const handleAddStudent = async () => {
    if (!currentStudent.name || !currentStudent.className) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentStudent,
          email: currentStudent.email || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add student");
      }

      resetDialog();
      await fetchPageData();

      toast({
        title: "Success",
        description: "Student added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async () => {
    if (!currentStudent._id) return;

    try {
      const response = await fetch(`/api/students/${currentStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentStudent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update student");
      }

      resetDialog();
      await fetchPageData();

      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update student",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete student");
      }

      await fetchPageData();
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (student: Student) => {
    setDialogMode('edit');
    setCurrentStudent(student);
    setIsDialogOpen(true);
  };

  const handleDialogSubmit = () => {
    if (dialogMode === 'edit') {
      handleUpdateStudent();
    } else {
      handleAddStudent();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Students</h2>
          <p className="mt-2 text-muted-foreground">Manage all enrolled students</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          if (!isOpen) resetDialog();
          setIsDialogOpen(isOpen);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setDialogMode('add')}>
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogMode === 'edit' ? 'Edit Student' : 'Add New Student'}</DialogTitle>
              <DialogDescription>
                {dialogMode === 'edit' ? 'Update the details of the student.' : 'Enroll a new student in a class.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Name *</Label>
                <Input
                  id="student-name"
                  placeholder="e.g., John Doe"
                  value={currentStudent.name || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={currentStudent.className || ''}
                  onValueChange={(value) => setCurrentStudent({ ...currentStudent, className: value })}
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                  {availableClasses.map((classItem) => (
                      <SelectItem key={classItem._id} value={classItem.name}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={currentStudent.email || ''}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={currentStudent.status}
                  onValueChange={(value) => setCurrentStudent({ ...currentStudent, status: value as 'Active' | 'Inactive' })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>
                Cancel
              </Button>
              <Button onClick={handleDialogSubmit}>
                {dialogMode === 'edit' ? 'Save Changes' : 'Add Student'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>A list of all enrolled students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.email || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student._id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

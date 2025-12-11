"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AttendanceEntry, Class, Student } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface EnhancedAttendanceEntry extends AttendanceEntry {
  classId: string;
  className: string;
  date: string;
}

export default function AttendancePage() {
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [selectedClassName, setSelectedClassName] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [availableClasses, setAvailableClasses] = useState<Class[]>([])
  const [attendance, setAttendance] = useState<EnhancedAttendanceEntry[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchAvailableClasses();
  }, []);

  const fetchAvailableClasses = async () => {
    try {
      const response = await fetch("/api/classes");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data: Class[] = await response.json();
      setAvailableClasses(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load classes",
        variant: "destructive",
      });
    }
  };

  const loadAttendance = async () => {
    if (!selectedClassId) {
      toast({
        title: "Error",
        description: "Please select a class first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch students for the selected class
      const studentsResponse = await fetch(`/api/students?className=${selectedClassName}`);
      if (!studentsResponse.ok) {
        throw new Error("Failed to fetch students");
      }
      const students: Student[] = await studentsResponse.json();

      // Fetch existing attendance for the selected class and date
      const attendanceResponse = await fetch(
        `/api/attendance?classId=${selectedClassId}&date=${selectedDate}`
      );
      if (!attendanceResponse.ok) {
        throw new Error("Failed to fetch attendance records");
      }
      const existingAttendance: EnhancedAttendanceEntry[] = await attendanceResponse.json();

      // Combine students with existing attendance
      const combinedAttendance: EnhancedAttendanceEntry[] = students.map((student) => {
        const existingRecord = existingAttendance.find(
          (record) => String(record.studentId) === String(student._id)
        );
        return {
          studentId: student._id!,
          studentName: student.name,
          classId: selectedClassId,
          className: selectedClassName,
          date: selectedDate,
          status: existingRecord ? existingRecord.status : "Present", // Default to Present if no record
        };
      });

      setAttendance(combinedAttendance);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load attendance",
        variant: "destructive",
      });
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) =>
      prev.map((entry) =>
        String(entry.studentId) === String(studentId)
          ? { ...entry, status: entry.status === "Present" ? "Absent" : "Present" }
          : entry,
      ),
    );
  };

  const handleSaveAttendance = async () => {
    if (attendance.length === 0) {
      toast({
        title: "Error",
        description: "Please select a class and load students first",
        variant: "destructive",
      });
      return;
    }

    try {
      const recordsToSave = attendance.map((entry) => ({
        studentId: entry.studentId,
        studentName: entry.studentName,
        classId: entry.classId,
        className: entry.className,
        date: entry.date,
        status: entry.status,
      }));

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: recordsToSave }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save attendance");
      }

      const data = await response.json();
      toast({
        title: "Attendance Saved",
        description: data.message || "Attendance saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save attendance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Attendance</h2>
        <p className="mt-2 text-muted-foreground">Mark student attendance for classes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Class and Date</CardTitle>
          <CardDescription>Choose a class and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="class-select">Class</Label>
              <Select
                value={selectedClassId}
                onValueChange={(value) => {
                  setSelectedClassId(value);
                  const selectedClassItem = availableClasses.find(c => c._id === value);
                  setSelectedClassName(selectedClassItem ? selectedClassItem.name : "");
                  setAttendance([]); // Clear attendance when class changes
                }}
              >
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((classItem) => (
                    <SelectItem key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-select">Date</Label>
              <input
                title="date"
                id="date-select"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={loadAttendance} disabled={!selectedClassId} className="w-full">
                Load Students
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {attendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Click on status to toggle between Present and Absent</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((entry) => (
                  <TableRow key={entry.studentId}>
                    <TableCell className="font-medium">{entry.studentName}</TableCell>
                    <TableCell>
                      <Button
                        variant={entry.status === "Present" ? "default" : "destructive"}
                        size="sm"
                        onClick={() => toggleAttendance(entry.studentId)}
                      >
                        {entry.status}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveAttendance} size="lg">
                Save Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

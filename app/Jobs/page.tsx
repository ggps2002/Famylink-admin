"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { fetchAllJobs } from "@/redux/slices/jobSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { withAuth } from "@/lib/authWrapper";

interface JobListing {
  id: number;
  title: string;
  description: string;
  familyId: number;
  location: string;
  hourlyRate: number;
  schedule: string;
  requirements: string;
  childrenAges: string;
  isActive: boolean;
  createdAt: string;
  family?: {
    firstName: string;
    lastName: string;
    city?: string;
    state?: string;
  };
}

function Jobs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteJobId, setDeleteJobId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { allJobs, isLoading, error } = useSelector(
    (state: RootState) => state.jobs
  );
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    dispatch(fetchAllJobs());
  },[dispatch])

  const filteredJobs =
    allJobs?.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.family &&
          `${job.family.firstName} ${job.family.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && job.isActive) ||
        (statusFilter === "inactive" && !job.isActive);

      return matchesSearch && matchesStatus;
    }) || [];

  const handleDeleteJob = (jobId: number) => {
    setDeleteJobId(jobId);
  };

  // const confirmDelete = () => {
  //   if (deleteJobId) {
  //     deleteJobMutation.mutate(deleteJobId);
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} isMobile={isMobile} />

        {/* Page Content */}
        <main className="p-6 space-y-6 fade-in">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Job Listings
              </h2>
              <p className="text-muted-foreground">
                Manage all job postings from families
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search jobs by title, location, or family..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Jobs List */}
          <Card>
            <CardHeader>
              <CardTitle>Jobs ({filteredJobs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-64 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No jobs found matching your criteria
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-foreground text-lg">
                              {job.title}
                            </h3>
                            <Badge
                              variant={job.isActive ? "default" : "secondary"}
                            >
                              {job.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {job.family && (
                            <p className="text-sm text-muted-foreground">
                              Posted by {job.family.firstName}{" "}
                              {job.family.lastName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4 " />
                         {job.hourlyRate}/hour
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          Ages:{Object.values(job.childrenAges?.info || {}).join(", ")}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {job.schedule}
                        </div>
                      </div>

                      {job.requirements && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm">
                            <span className="font-medium">Requirements:</span>{" "}
                            {job.requirements}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <span>Job ID: {job.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteJobId}
        onOpenChange={() => setDeleteJobId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job listing? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => console.log("Deleted")}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


export default withAuth(Jobs)

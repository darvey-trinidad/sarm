"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "@uploadthing/react";
import { type OurFileRouter } from "@/app/api/uploadthing/core";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ReportSchema } from "./schema";
import { REPORT_CATEGORY } from "@/constants/report-category";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { api } from "@/trpc/react";
import { FacilityIssueAutocomplete } from "@/components/report-autocomplete/FacilityIssueAutocomplete";
import { COMMON_FACILITY_ISSUES } from "@/constants/commont-facility-reports";

export default function ReportForm() {
  const { data: session } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(
    null,
  );
  const { data: buildings } = api.classroom.getClassroomsPerBuilding.useQuery();

  const { mutate: createFacilityIssueReport } =
    api.facilityIssue.createFacilityIssueReport.useMutation();
  const form = useForm<z.infer<typeof ReportSchema>>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      description: "",
      details: "",
      buildingId: undefined,
      classroomId: undefined,
      location: "",
      imageUrl: "",
      category: undefined,
    },
  });

  const handleSubmit = (data: z.infer<typeof ReportSchema>) => {
    setIsSubmitting(true);
    console.log("Data", data);

    createFacilityIssueReport(
      {
        reportedBy: session?.user.id ?? "",
        description: data.description,
        details: data.details,
        buildingId: data.buildingId,
        classroomId: data.classroomId,
        location: data.location,
        imageUrl: data.imageUrl,
        category: data.category,
      },
      {
        onSuccess: () => {
          toast.success("Report submitted successfully!");
          form.reset();
          setIsSubmitting(false);
        },
        onError: () => {
          toast.error("Failed to submit report");
          setIsSubmitting(false);
        },
      },
    );
  };

  const classrooms =
    buildings?.find((b) => b.buildingId === selectedBuilding)?.classrooms ?? [];

  return (
    <div>
      <Form {...form}>
        <form
          className="space-y-3 px-0 md:space-y-5"
          onSubmit={form.handleSubmit((data) =>
            showConfirmation({
              title: "Submit Report",
              description: "Are you sure you want to submit this report?",
              confirmText: "Submit",
              cancelText: "Cancel",
              variant: "success",
              onConfirm: () => handleSubmit(data),
            }),
          )}
        >
          <div className="align-items-center grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Description</FormLabel>
                  <FormControl>
                    <FacilityIssueAutocomplete
                      options={COMMON_FACILITY_ISSUES}
                      emptyMessage="Start typing to describe the issue..."
                      placeholder="e.g., Broken Ceiling Fan"
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription className="pt-0">
                    Select from common issues or type your own description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REPORT_CATEGORY.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the category that best describes the issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 space-y-2 md:grid-cols-3 md:space-y-5">
            <FormField
              control={form.control}
              name="buildingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setSelectedBuilding(val);
                      setSelectedClassroom(null);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a building" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buildings?.map((building) => (
                        <SelectItem
                          key={building.buildingId}
                          value={building.buildingId}
                        >
                          {building.name} - {building.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classroomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setSelectedClassroom(val);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a room" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Specific Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Near the whiteboard" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide details about the specific location.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => {
              const uploadedImage = form.watch("imageUrl");

              return (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  {uploadedImage && (
                    <p className="mt-2 text-sm">
                      Image uploaded:{" "}
                      <a
                        href={uploadedImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {uploadedFileName ?? "View Image"}
                      </a>
                    </p>
                  )}
                  <FormControl>
                    <UploadDropzone<OurFileRouter, "imageUploader">
                      endpoint="imageUploader"
                      appearance={{
                        container: "!p-5",
                        uploadIcon: "!text-primary",
                        button: "!bg-primary !text-white !text-sm !font-medium",
                      }}
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          field.onChange(res[0].ufsUrl);
                          setUploadedFileName(res[0].name);
                          toast.success("Image uploaded successfully!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                    />
                  </FormControl>

                  <FormDescription>
                    Upload up to 1 image (max 1MB each) related to the issue.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please provide detailed information about the issue..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </Form>
      {ConfirmationDialog}
    </div>
  );
}

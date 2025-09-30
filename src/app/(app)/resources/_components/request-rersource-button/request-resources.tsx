"use client";
import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Plus, Minus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TIME_OPTIONS } from "@/constants/timeslot";
import { authClient } from "@/lib/auth-client";
import { newDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { ResourceScehma } from "./schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BORROWING_STATUS } from "@/constants/borrowing-status";
import { DEFAULT_BORROWING_STATUS } from "@/constants/borrowing-status";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
type RequestResourcesDialogProps = {
  requestedDate: Date | null;
  requestedStartTime: string;
  requestedEndTime: string;
};
export default function RequestResourcesDialog({
  requestedDate,
  requestedStartTime,
  requestedEndTime,
}: RequestResourcesDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = authClient.useSession();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  api.resource.createResourceBorrowing;
  const form = useForm<z.infer<typeof ResourceScehma>>({
    resolver: zodResolver(ResourceScehma),
    defaultValues: {
      dateBorrowed: requestedDate
        ? newDate(requestedDate)
        : newDate(new Date()),
      startTime: requestedStartTime || "700",
      endTime: requestedEndTime || "2000",
      purpose: "",
      status: "pending",
      representativeBorrower: "",
      fileUrl: "",
      itemsBorrowed: [],
    },
  });

  //gets the entered date, start time and end time form the filter.
  useEffect(() => {
    form.reset({
      ...form.getValues(), // keep existing values
      dateBorrowed: requestedDate
        ? newDate(requestedDate)
        : newDate(new Date()),
      startTime: requestedStartTime || "700",
      endTime: requestedEndTime || "2000",
    });
  }, [requestedDate, requestedStartTime, requestedEndTime]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itemsBorrowed",
  });

  const { data: availableResources } =
    api.resource.getAllAvailableResources.useQuery({
      requestedDate: newDate(form.watch("dateBorrowed")),
      requestedStartTime: form.watch("startTime").toString(),
      requestedEndTime: form.watch("endTime").toString(),
    });

  const { mutate: createResourceBorrowing } =
    api.resource.createResourceBorrowing.useMutation();

  const handleSubmit = (data: z.infer<typeof ResourceScehma>) => {
    setIsSubmitting(true);
    console.log("Data", data);

    createResourceBorrowing(
      {
        borrowerId: session?.user.id || "",
        startTime: data.startTime,
        endTime: data.endTime,
        dateBorrowed: newDate(data.dateBorrowed),
        purpose: data.purpose,
        status:
          data.status == "approved" ? data.status : DEFAULT_BORROWING_STATUS,
        fileUrl: data.fileUrl,
        representativeBorrower: data.representativeBorrower || "",
        itemsBorrowed: data.itemsBorrowed.map((item) => ({
          resourceId: item.id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Request submitted successfully!");
          form.reset();
          setPdfUrl("");
          setPdfName("");
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error(error.message);
        },
      },
    );
  };

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

  const selectedId =
    form
      .watch("itemsBorrowed")
      ?.map((item) => item.id)
      .filter(Boolean) ?? [];

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Request Resource</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Resource Reservation</DialogTitle>
            <DialogDescription>
              Fill out the form below to request resource. Your request will be
              marked as <span className="font-semibold">Pending</span> until
              approved.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Confirm Resource Request",
                  description: "Are you sure you want to submit this request?",
                  confirmText: "Submit",
                  cancelText: "Cancel",
                  variant: "success",
                  onConfirm: () => handleSubmit(data),
                }),
              )}
            >
              <ScrollArea className="h-95">
                <div className="space-y-4">
                  {/* Date Borrowed */}
                  <FormField
                    control={form.control}
                    name="dateBorrowed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Date Borrowed <p className="text-destructive">*</p>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="pointer-events-auto z-50 w-auto p-0"
                            align="start"
                            forceMount
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return (
                                  date < today || date < new Date("1900-01-01")
                                );
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/*Start Time */}
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Start Time <p className="text-destructive">*</p>
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((time) => (
                                <SelectItem
                                  key={time.value}
                                  value={time.value.toString()}
                                >
                                  {time.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/*End Time */}
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            End Time <p className="text-destructive">*</p>
                          </FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((time) => (
                                <SelectItem
                                  key={time.value}
                                  value={time.value.toString()}
                                >
                                  {time.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Purpose */}
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Purpose <p className="text-destructive">*</p>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Meeting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Purpose */}
                  {session?.user?.role === "facility_manager" && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Status <p className="text-destructive">*</p>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={
                              session?.user?.role !== "facility_manager"
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                              {BORROWING_STATUS.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Representative Borrower */}
                  <FormField
                    control={form.control}
                    name="representativeBorrower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Representative Borrower{" "}
                          <p className="text-destructive">*</p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Representative's full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resource Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Borrow Items</h3>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => append({ id: "", quantity: 1 })}
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>

                    {fields.map((field, index) => {
                      const selectedResource = availableResources?.find(
                        (r) => r.id === form.watch(`itemsBorrowed.${index}.id`),
                      );

                      return (
                        <div key={field.id} className="flex gap-4">
                          {/* Item Name */}
                          <div className="flex-1">
                            <FormField
                              control={form.control}
                              name={`itemsBorrowed.${index}.id`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Item Name</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="w-full truncate">
                                        <SelectValue placeholder="Select item" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {availableResources
                                        ?.filter(
                                          (item) =>
                                            !selectedId.includes(item.id) ||
                                            item.id === field.value,
                                        )
                                        .map((item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={item.id}
                                          >
                                            {item.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Available (read-only, aligned like other fields) */}
                          <div className="w-20">
                            <FormItem>
                              <FormLabel>Available</FormLabel>
                              <FormControl>
                                <Input
                                  value={
                                    selectedResource
                                      ? selectedResource.available
                                      : ""
                                  }
                                  readOnly
                                  className="bg-muted text-muted-foreground"
                                />
                              </FormControl>
                            </FormItem>
                          </div>

                          {/* Quantity */}
                          <div className="w-24">
                            <FormField
                              control={form.control}
                              name={`itemsBorrowed.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={1}
                                      max={selectedResource?.available || 1}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Remove button */}
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => remove(index)}
                            className="mt-5 self-center"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  {/* File Attachement */}
                  <div className="flex flex-col gap-2">
                    <Label>Attachments</Label>
                    {pdfUrl.length ? (
                      <a
                        className="text-primary border-grey rounded-sm border-1 px-2 py-1 underline"
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="">{pdfName || "pdf"}</div>
                      </a>
                    ) : null}

                    <UploadButton
                      className="ut-button:bg-primary ut-button:w-full ut-button:h-7 ut-button:rounded-xs text-sm font-medium"
                      endpoint="pdfUploader"
                      onClientUploadComplete={(res) => {
                        console.log("File uploaded:", res);
                        const url = res[0]?.ufsUrl || "";
                        const name = res[0]?.name || "";
                        setPdfUrl(url);
                        setPdfName(name);
                        form.setValue("fileUrl", url);
                        toast.success("File uploaded successfully!");
                      }}
                      onUploadError={(error: Error) =>
                        console.log("Error uploading:", error.message)
                      }
                    />
                  </div>
                </div>
              </ScrollArea>
              {/* Validation Messages */}
              {Number(startTime) >= Number(endTime) && (
                <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                  End time must be after start time
                </div>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="z-50 cursor-pointer"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {ConfirmationDialog}
    </div>
  );
}

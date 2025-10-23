"use client";
import { api } from "@/trpc/react";
import { z } from "zod";
import { VenueSchema } from "./schema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFieldArray } from "react-hook-form";
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
import { RESERVATION_STATUS } from "@/constants/reservation-status";
import { authClient } from "@/lib/auth-client";
import { newDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadButton } from "@/utils/uploadthing";
import { DEFAULT_BORROWING_STATUS } from "@/constants/borrowing-status";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
type VenuePageProps = {
  venueId: string;
};

export default function RequestReservationModal({ venueId }: VenuePageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationError, setReservationError] = useState("");
  const { data: session } = authClient.useSession();
  const [isBorrowingItems, setIsBorrowingItems] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();

  const form = useForm<z.infer<typeof VenueSchema>>({
    resolver: zodResolver(VenueSchema),
    defaultValues: {
      date: newDate(new Date()),
      startTime: 700,
      endTime: 2000,
      purpose: "",
      status: "pending",
      representativeBorrower: "",
      fileUrl: "",
      borrowItems: [],
    },
  });

  const dateParam = form.watch("date");
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

  const { data: availableResources } =
    api.resource.getAllAvailableResources.useQuery(
      {
        requestedDate: newDate(dateParam),
        requestedStartTime: startTime.toString(),
        requestedEndTime: endTime.toString(),
      },
      {
        enabled: !!dateParam && !!startTime && !!endTime,
      },
    );

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "borrowItems", // must exist in your schema
  });

  const { mutate: createVenueReservation } =
    api.venue.createVenueReservation.useMutation();

  const { mutate: createVenueReservationWithBorrowing } =
    api.venue.createVenueReservationWithBorrowing.useMutation();
  console.log("Date:", new Date());
  const handleSubmit = async (data: z.infer<typeof VenueSchema>) => {
    setIsSubmitting(true);
    console.log("Data", data);

    if (isBorrowingItems && data.borrowItems && data.borrowItems.length > 0) {
      createVenueReservationWithBorrowing(
        {
          venue: {
            venueId: venueId,
            reserverId: session?.user.id ?? "",
            date: newDate(data.date),
            startTime: data.startTime,
            endTime: data.endTime,
            purpose: data.purpose,
            status: data.status,
            fileUrl: data.fileUrl ?? "",
          },
          borrowing: {
            borrowerId: session?.user.id ?? "",
            representativeBorrower: data.representativeBorrower ?? "",
            purpose: data.purpose,
            startTime: data.startTime.toString(),
            endTime: data.endTime.toString(),

            dateBorrowed: newDate(data.date),
            fileUrl: data.fileUrl,

            status:
              data.status == "approved"
                ? data.status
                : DEFAULT_BORROWING_STATUS,
            itemsBorrowed: data.borrowItems.map((item) => ({
              resourceId: item.id,
              quantity: item.quantity,
            })),
          },
        },
        {
          onSuccess: () => {
            toast.success(
              "Reservation and borrowing requests created successfully",
            );
            form.reset();
            setIsSubmitting(false);
            setPdfUrl("");
            setPdfName("");
          },
          onError: (err) => {
            setReservationError(err.message);
            console.log(err);
            toast.error(err.message || "Failed to create requests");
            setIsSubmitting(false);
            setTimeout(() => setReservationError(""), 5000);
          },
        },
      );
    } else {
      createVenueReservation(
        {
          venueId: venueId,
          reserverId: session?.user.id ?? "",
          date: newDate(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          purpose: data.purpose,
          status: data.status,
          fileUrl: data.fileUrl ?? "",
        },
        {
          onSuccess: () => {
            toast.success("Venue reservation created successfully");
            form.reset();
            setIsSubmitting(false);
          },
          onError: (err) => {
            setReservationError(err.message);
            console.log(err);
            toast.error(err.message || "Failed to create reservation");
            setIsSubmitting(false);
            setTimeout(() => setReservationError(""), 5000);
          },
        },
      );
    }
  };

  const selectedId =
    form
      .watch("borrowItems")
      ?.map((item) => item.id)
      .filter(Boolean) ?? [];

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Request Reservation</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Venue Reservation</DialogTitle>
            <DialogDescription>
              Fill out the form to request a reservation. Your request will be
              marked as <span className="font-semibold">Pending</span> until
              approved.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                showConfirmation({
                  title: "Request Venue Reservation",
                  description:
                    "Are you sure you want to request a reservation?",
                  confirmText: "Submit",
                  cancelText: "Cancel",
                  variant: "success",
                  onConfirm: () => handleSubmit(data),
                }),
              )}
              className="space-y-6"
            >
              <ScrollArea className="h-75">
                <div className="space-y-4">
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Date<p className="text-destructive">*</p>
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
                                const normalizedDate = new Date(date);
                                normalizedDate.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                return normalizedDate <= today;
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Start Time */}
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Start Time<p className="text-destructive">*</p>
                          </FormLabel>
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select start time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {TIME_OPTIONS.map((opt) => (
                                  <SelectItem
                                    key={opt.value}
                                    value={opt.value.toString()}
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Time */}
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            End Time <p className="text-destructive">*</p>
                          </FormLabel>
                          <Select
                            onValueChange={(val) => field.onChange(Number(val))}
                            value={String(field.value)}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select end time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {TIME_OPTIONS.map((opt) => (
                                  <SelectItem
                                    key={opt.value}
                                    value={opt.value.toString()}
                                  >
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
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
                          <Input placeholder="Enter purpose" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  {session?.user?.role === "facility_manager" && (
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={
                              session?.user?.role !== "facility_manager"
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                {RESERVATION_STATUS.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {isBorrowingItems && (
                    <div>
                      <div className="space-y-4">
                        <h3 className="text-md font-semibold">
                          <div className="flex items-center gap-2">
                            Borrow Items
                            <p className="text-destructive">*</p>
                          </div>
                        </h3>

                        {fields.map((field, index) => {
                          // get the selected resource details
                          const selectedResource = availableResources?.find(
                            (r) =>
                              r.id === form.watch(`borrowItems.${index}.id`),
                          );

                          return (
                            <div key={field.id}>
                              <div className="flex flex-col gap-4 sm:flex-row">
                                {/* Item Name */}
                                <div className="w-full">
                                  <FormField
                                    control={form.control}
                                    name={`borrowItems.${index}.id`}
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
                                                  !selectedId?.includes(
                                                    item.id,
                                                  ) || item.id === field.value,
                                              )
                                              .map((item) => (
                                                <SelectItem
                                                  key={item.id}
                                                  value={item.id}
                                                  title={
                                                    item.description ??
                                                    "No Description"
                                                  }
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
                                <div className="flex items-center gap-2">
                                  <div className="w-full">
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
                                  <div className="w-full">
                                    <FormField
                                      control={form.control}
                                      name={`borrowItems.${index}.quantity`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Quantity</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min={1}
                                              max={
                                                selectedResource?.available ?? 1
                                              }
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
                              </div>
                              <span className="text-muted-foreground pl-3 text-xs">
                                {selectedResource?.description}
                              </span>
                              <Separator className="my-4" />
                            </div>
                          );
                        })}

                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => append({ id: "", quantity: 1 })}
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      </div>

                      {/* Representative Borrower */}
                      <FormField
                        control={form.control}
                        name="representativeBorrower"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mt-4">
                              Representative Borrower
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
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field, fieldState }) => (
                        <div className="flex flex-col gap-2">
                          <Label>Attachments</Label>
                          {fieldState.error && (
                            <p className="text-sm text-red-500">
                              {fieldState.error.message}
                            </p>
                          )}

                          {pdfUrl.length ? (
                            <a
                              className="text-primary border-grey rounded-sm border px-2 py-1 underline"
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div>{pdfName || "pdf"}</div>
                            </a>
                          ) : null}

                          <UploadButton
                            className="ut-button:bg-primary ut-button:w-full ut-button:h-7 ut-button:rounded-xs text-sm font-medium"
                            endpoint="pdfUploader"
                            onClientUploadComplete={(res) => {
                              console.log("File uploaded:", res);
                              const url = res[0]?.ufsUrl ?? "";
                              const name = res[0]?.name ?? "";
                              setPdfUrl(url);
                              setPdfName(name);
                              field.onChange(url);
                              form.setValue("fileUrl", url);
                              toast.success("File uploaded successfully!");
                            }}
                            onUploadError={(error: Error) =>
                              console.log("Error uploading:", error.message)
                            }
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </ScrollArea>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="borrowItems"
                  checked={isBorrowingItems}
                  onCheckedChange={(checked) => setIsBorrowingItems(!!checked)}
                />
                <Label>Borrow Items</Label>
              </div>

              {/* Validation Messages */}
              {startTime >= endTime && (
                <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                  End time must be after start time
                </div>
              )}

              {reservationError && (
                <div className="rounded bg-red-50 p-2 text-center text-sm text-red-600">
                  {reservationError}
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

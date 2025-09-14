"use client";
import { api } from "@/trpc/react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { RoomSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FLOORS_OPTIONS } from "@/constants/floors";
import { CLASSROOM_TYPE_OPTIONS } from "@/constants/classroom-type";
import { USABILITY_OPTIONS } from "@/constants/usability";
import { useConfirmationDialog } from "@/components/dialog/use-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
export default function RoomFormButton() {
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const { data: buildings } = api.classroom.getAllBuildings.useQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showConfirmation, ConfirmationDialog } = useConfirmationDialog();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof RoomSchema>>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      name: "",
      buildingId: "",
      capacity: 0,
      floor: "first",
      type: "lecture",
      usability: "operational",
    },
  });

  const { mutate: createClassroom } =
    api.classroom.createClassroom.useMutation();

  const handleSubmit = (data: z.infer<typeof RoomSchema>) => {
    console.log("Data", data);
    setIsSubmitting(true);
    createClassroom(data, {
      onSuccess: () => {
        toast.success("Classroom created successfully");
        form.reset();
        setOpen(false);
        setIsSubmitting(false);
      },
      onError: () => {
        toast.error("Failed to create classroom");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Classroom</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Classroom</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Add a new classroom in a building.
          </DialogDescription>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((data) => {
                showConfirmation({
                  title: "Create Classroom",
                  description:
                    "Are you sure you want to create this classroom?",
                  confirmText: "Create",
                  variant: "default",
                  onConfirm: () => handleSubmit(data),
                });
              })}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buildingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedBuildingId(value);
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
                            <SelectItem key={building.id} value={building.id}>
                              {building.name} - {building.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Capacity"
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FLOORS_OPTIONS.map((floor) => (
                          <SelectItem key={floor.value} value={floor.value}>
                            {floor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CLASSROOM_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usability</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a usability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USABILITY_OPTIONS.map((usability) => (
                          <SelectItem
                            key={usability.value}
                            value={usability.value}
                          >
                            {usability.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Creating..." : "Create Classroom"}
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

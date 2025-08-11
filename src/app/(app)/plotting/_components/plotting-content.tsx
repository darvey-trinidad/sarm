import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PlottingForm from "./plot/plotting-form";
export default function PlottingContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Class Schedule</CardTitle>
        <CardDescription>
          Input course details and schedule information for the entire school
          year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PlottingForm />
      </CardContent>
    </Card>
  );
}

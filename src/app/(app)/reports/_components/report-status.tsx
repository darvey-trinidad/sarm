import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, Wrench, CircleCheck } from "lucide-react";

export default function reportCards() {
  const Pending = 12;
  const InProgress = 2;
  const Completed = 8;
  return (
    <div className="flex w-full flex-row space-x-5">
      {/* Pending */}
      <Card className="w-full max-w-sm gap-0 rounded-md border border-gray-200 bg-white p-4">
        <div className="flex flex-row justify-between justify-items-center pb-7">
          <h1 className="text-md font-semibold">Pending</h1>
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
        <h1 className="text-3xl font-semibold">{Pending}</h1>
        <Label className="text-sm text-gray-400">Since this month </Label>
      </Card>

      {/* In Progress */}
      <Card className="w-full max-w-sm gap-0 rounded-md border border-gray-200 bg-white p-4">
        <div className="flex flex-row justify-between justify-items-center pb-7">
          <h1 className="text-md font-semibold">In Progress</h1>
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
        <h1 className="text-3xl font-semibold">{InProgress}</h1>
        <Label className="text-sm text-gray-400">Since this month </Label>
      </Card>

      {/* Completed */}
      <Card className="w-full max-w-sm gap-0 rounded-md border border-gray-200 bg-white p-4">
        <div className="flex flex-row justify-between justify-items-center pb-7">
          <h1 className="text-md font-semibold">Completed</h1>
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
        <h1 className="text-3xl font-semibold">{Completed}</h1>
        <Label className="text-sm text-gray-400">Since this month </Label>
      </Card>
    </div>
  );
}

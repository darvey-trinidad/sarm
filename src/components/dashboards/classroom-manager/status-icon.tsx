import {
  AlertCircle,
  HelpCircle,
  BrushCleaning,
  Droplet,
  Wrench,
  Zap,
} from "lucide-react";
import {
  type ReportCategory,
  ReportCategoryStatus,
} from "@/constants/report-category";
import {
  ReportStatusValues,
  type ReportStatus,
} from "@/constants/report-status";

export const getCategoryIcon = (category: ReportCategory) => {
  switch (category) {
    case ReportCategoryStatus.Electrical:
      return <Zap className="h-4 w-4 text-yellow-600" />;
    case ReportCategoryStatus.Plumbing:
      return <Droplet className="h-4 w-4 text-blue-600" />;
    case ReportCategoryStatus.Equipment:
      return <Wrench className="h-4 w-4 text-gray-600" />;
    case ReportCategoryStatus.Sanitation:
      return <BrushCleaning className="h-4 w-4 text-green-600" />;
    default:
      return <HelpCircle className="h-4 w-4 text-purple-600" />;
  }
};

export const getCategoryBgColor = (category: ReportCategory) => {
  switch (category) {
    case ReportCategoryStatus.Electrical:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case ReportCategoryStatus.Plumbing:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case ReportCategoryStatus.Equipment:
      return "bg-gray-100 text-gray-800 border-gray-200";
    case ReportCategoryStatus.Sanitation:
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-purple-300 text-purple-800 border-purple-200";
  }
};

export const getStatusColor = (Status: ReportStatus) => {
  switch (Status) {
    case ReportStatusValues.Reported:
      return "bg-red-100 text-red-800 border-red-200";
    case ReportStatusValues.Resolved:
      return "bg-green-100 text-green-800 border-green-200";
    case ReportStatusValues.Ongoing:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case ReportStatusValues.Duplicate:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};

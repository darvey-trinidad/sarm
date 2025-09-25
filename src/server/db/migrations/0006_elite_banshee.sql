-- Step 1: Create a temporary table with the new schema.
CREATE TABLE `facility_issue_report_new` (
    `id` text PRIMARY KEY NOT NULL,
    `reported_by` text NOT NULL,
    `category` text NOT NULL,
    `building_id` text,
    `classroom_id` text,
    `location` text NOT NULL,
    `description` text NOT NULL,
    `details` text,
    `status` text NOT NULL,
    `date_reported` integer NOT NULL,
    `date_updated` integer,
    FOREIGN KEY (`reported_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`building_id`) REFERENCES `building`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`classroom_id`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

-- Step 2: Drop the original table.
DROP TABLE `facility_issue_report`;
--> statement-breakpoint

-- Step 3: Rename the new temporary table.
ALTER TABLE `facility_issue_report_new` RENAME TO `facility_issue_report`;
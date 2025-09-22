-- Step 1: Create the new 'borrowing_transaction' table.
CREATE TABLE `borrowing_transaction` (
    `id` text PRIMARY KEY NOT NULL,
    `borrower_id` text NOT NULL,
    `venue_reservation_id` text,
    `start_time` integer NOT NULL,
    `end_time` integer NOT NULL,
    `purpose` text NOT NULL,
    `status` text NOT NULL,
    `representative_borrower` text NOT NULL,
    `file_url` text,
    `date_requested` integer NOT NULL,
    `date_borrowed` integer,
    `date_returned` integer,
    FOREIGN KEY (`borrower_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`venue_reservation_id`) REFERENCES `venue_reservation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

-- Step 2: Create a temporary version of the new 'resource_borrowing' table.
CREATE TABLE `resource_borrowing_new` (
    `id` text PRIMARY KEY NOT NULL,
    `transaction_id` text NOT NULL,
    `resource_id` text NOT NULL,
    `quantity` integer NOT NULL,
    FOREIGN KEY (`transaction_id`) REFERENCES `borrowing_transaction`(`id`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (`resource_id`) REFERENCES `resource`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

-- Step 3: Insert data into the new 'borrowing_transaction' table.
INSERT INTO `borrowing_transaction` (
    id, borrower_id, venue_reservation_id, start_time, end_time,
    purpose, status, representative_borrower, file_url,
    date_requested, date_borrowed, date_returned
) SELECT
    id, borrower_id, venue_reservation_id, start_time, end_time,
    purpose, status, representative_borrower, file_url,
    date_requested, date_borrowed, date_returned
FROM resource_borrowing;
--> statement-breakpoint

-- Step 4: Insert data into the new 'resource_borrowing' table.
INSERT INTO `resource_borrowing_new` (
    id, transaction_id, resource_id, quantity
) SELECT
    id, id, resource_id, quantity
FROM resource_borrowing;
--> statement-breakpoint

-- Step 5: Drop the original 'resource_borrowing' table.
DROP TABLE `resource_borrowing`;
--> statement-breakpoint

-- Step 6: Rename the new temporary table.
ALTER TABLE `resource_borrowing_new` RENAME TO `resource_borrowing`;
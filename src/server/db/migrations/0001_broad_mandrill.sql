-- SQLite does not support "Creating foreign key on existing column" out of the box.
-- Drizzle-kit has left this for manual intervention.
-- To safely add the foreign key, we must follow a multi-step process.

-- Step 1: Create a temporary table with the same schema, including the new foreign key.
CREATE TABLE resource_borrowing_temp (
  id text PRIMARY KEY NOT NULL,
  borrower_id text NOT NULL,
  resource_id text NOT NULL,
  venue_reservation_id text, -- The new column with the foreign key
  purpose text NOT NULL,
  status text NOT NULL,
  representative_borrower text NOT NULL,
  date_requested integer NOT NULL,
  date_borrowed integer,
  date_returned integer,
  FOREIGN KEY (borrower_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (resource_id) REFERENCES resource(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (venue_reservation_id) REFERENCES venue_reservation(id) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

-- Step 2: Copy the data from the old table to the new one.
-- This ensures you don't lose any existing data.
INSERT INTO resource_borrowing_temp (
    id,
    borrower_id,
    resource_id,
    purpose,
    status,
    representative_borrower,
    date_requested,
    date_borrowed,
    date_returned
) SELECT 
    id,
    borrower_id,
    resource_id,
    purpose,
    status,
    representative_borrower,
    date_requested,
    date_borrowed,
    date_returned
FROM resource_borrowing;
--> statement-breakpoint

-- Step 3: Drop the original table.
-- This removes the old version of the table without the foreign key.
DROP TABLE resource_borrowing;
--> statement-breakpoint

-- Step 4: Rename the temporary table to the original table name.
-- This finalizes the migration, making the new table ready for use.
ALTER TABLE resource_borrowing_temp RENAME TO resource_borrowing;
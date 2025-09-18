/*
  Manual migration for changing the `responderId` column type in `room_requests`.
  The table is empty, so we'll use a simplified temp table method.
*/

-- Step 1: Create a temporary table with the new schema
CREATE TABLE room_requests_new (
  id text PRIMARY KEY NOT NULL,
  classroom_id text NOT NULL,
  date integer NOT NULL,
  start_time integer NOT NULL,
  end_time integer NOT NULL,
  subject text NOT NULL,
  section text NOT NULL,
  requester_id text NOT NULL,
  responder_id text NOT NULL, -- The changed column type
  status text NOT NULL,
  created_at integer NOT NULL,
  responded_at integer,
  FOREIGN KEY (classroom_id) REFERENCES classroom(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (requester_id) REFERENCES user(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (responder_id) REFERENCES user(id) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

-- Step 2: Drop the old table
DROP TABLE room_requests;
--> statement-breakpoint

-- Step 3: Rename the new table
ALTER TABLE room_requests_new RENAME TO room_requests;
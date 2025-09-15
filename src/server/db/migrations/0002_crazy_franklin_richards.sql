ALTER TABLE `resource_borrowing` ADD `start_time` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `resource_borrowing` ADD `end_time` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `resource_borrowing` ADD `file_url` text;--> statement-breakpoint
ALTER TABLE `venue_reservation` ADD `file_url` text;
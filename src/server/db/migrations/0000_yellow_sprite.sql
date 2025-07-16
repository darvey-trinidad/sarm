CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`role` text NOT NULL,
	`department_or_organization` text,
	`is_active` integer DEFAULT false NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `classroom_borrowing` (
	`id` text PRIMARY KEY NOT NULL,
	`classroom_id` text NOT NULL,
	`faculty_id` text NOT NULL,
	`date` integer NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`subject` text,
	`section` text,
	FOREIGN KEY (`classroom_id`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faculty_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `classroom_schedule` (
	`id` text PRIMARY KEY NOT NULL,
	`classroom_id` text NOT NULL,
	`faculty_id` text NOT NULL,
	`day` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`subject` text NOT NULL,
	`section` text NOT NULL,
	FOREIGN KEY (`classroom_id`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faculty_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `classroom_vacancy` (
	`id` text PRIMARY KEY NOT NULL,
	`classroom_id` text NOT NULL,
	`date` integer NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`reason` text,
	FOREIGN KEY (`classroom_id`) REFERENCES `classroom`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `building` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `classroom` (
	`id` text PRIMARY KEY NOT NULL,
	`building_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`capacity` integer NOT NULL,
	`usability` text DEFAULT 'operational' NOT NULL,
	FOREIGN KEY (`building_id`) REFERENCES `building`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `facility_issue_report` (
	`id` text PRIMARY KEY NOT NULL,
	`reported_by` text NOT NULL,
	`category` text NOT NULL,
	`priority_level` text,
	`date_reported` integer NOT NULL,
	`location` text NOT NULL,
	`description` text NOT NULL,
	`details` text,
	`status` text DEFAULT 'reported' NOT NULL,
	FOREIGN KEY (`reported_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resource` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`stock` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `resource_borrowing` (
	`id` text PRIMARY KEY NOT NULL,
	`borrower_id` text NOT NULL,
	`resource_id` text NOT NULL,
	`purpose` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`representative_borrower` text NOT NULL,
	`date_requested` integer NOT NULL,
	`date_borrowed` integer,
	`date_returned` integer,
	FOREIGN KEY (`borrower_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resource_id`) REFERENCES `resource`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `venue` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`capacity` integer,
	`usability` text DEFAULT 'operational' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `venue_reservation` (
	`id` text PRIMARY KEY NOT NULL,
	`venue_id` text NOT NULL,
	`reserver_id` text NOT NULL,
	`date` integer NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`purpose` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`venue_id`) REFERENCES `venue`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reserver_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
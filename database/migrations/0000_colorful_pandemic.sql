CREATE TABLE `admins` (
	`id` varchar(36) NOT NULL,
	`staff_id` varchar(255) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`other_names` text,
	`avatar_id` int,
	`email` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_id_unique` UNIQUE(`id`),
	CONSTRAINT `admins_staff_id_unique` UNIQUE(`staff_id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `admin_permissions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`tag` varchar(255) NOT NULL,
	`identifier` varchar(400),
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_permissions_identifier_unique` UNIQUE(`identifier`)
);
--> statement-breakpoint
CREATE TABLE `admin_roles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`immutable` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `admin_role_permissions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`admin_role_id` bigint unsigned NOT NULL,
	`admin_perm_id` bigint unsigned NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_role_permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `administrator_roles` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`admin_id` varchar(36) NOT NULL,
	`admin_role_id` bigint unsigned NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `administrator_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`iso` varchar(3) NOT NULL,
	`name` varchar(400) NOT NULL,
	`details` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `currencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `currencies_iso_unique` UNIQUE(`iso`),
	CONSTRAINT `currencies_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `email_verification_tokens` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`model_uuid` varchar(36),
	`code` varchar(100) NOT NULL,
	`token` text NOT NULL,
	`expires_at` datetime NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `email_verification_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_verification_tokens_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` varchar(255) NOT NULL,
	`model` text NOT NULL,
	`model_id` bigint unsigned,
	`model_uuid` varchar(36),
	`media` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`model_uuid` varchar(255),
	`model` varchar(400) NOT NULL,
	`type` varchar(400) NOT NULL,
	`data` json,
	`read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personal_access_tokens` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`token` varchar(400) NOT NULL,
	`belongs_to` varchar(36) NOT NULL,
	`device_fingerprint` text,
	`abilities` json,
	`can_expire` boolean DEFAULT true,
	`expires_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personal_access_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `personal_access_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `admin_role_permissions` ADD CONSTRAINT `admin_role_permissions_admin_role_id_admin_roles_id_fk` FOREIGN KEY (`admin_role_id`) REFERENCES `admin_roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `admin_role_permissions` ADD CONSTRAINT `admin_role_permissions_admin_perm_id_admin_permissions_id_fk` FOREIGN KEY (`admin_perm_id`) REFERENCES `admin_permissions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `administrator_roles` ADD CONSTRAINT `administrator_roles_admin_id_admins_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `administrator_roles` ADD CONSTRAINT `administrator_roles_admin_role_id_admin_roles_id_fk` FOREIGN KEY (`admin_role_id`) REFERENCES `admin_roles`(`id`) ON DELETE no action ON UPDATE no action;
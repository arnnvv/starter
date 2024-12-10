CREATE TABLE "starter_email_verification_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "starter_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "starter_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"picture" text,
	CONSTRAINT "starter_users_username_unique" UNIQUE("username"),
	CONSTRAINT "starter_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "starter_email_verification_request" ADD CONSTRAINT "starter_email_verification_request_user_id_starter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."starter_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starter_sessions" ADD CONSTRAINT "starter_sessions_user_id_starter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."starter_users"("id") ON DELETE no action ON UPDATE no action;
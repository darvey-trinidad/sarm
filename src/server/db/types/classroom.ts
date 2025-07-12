import { building } from "@/server/db/schema/classroom";
import { classroom } from "@/server/db/schema/classroom";
import { type Usability } from "@/constants/usability";

import type { InferInsertModel } from "drizzle-orm";

export type Building = InferInsertModel<typeof building>;
export type EditBuilding = { id: string } & Partial<Omit<Building, "id">>;

export type Classroom = InferInsertModel<typeof classroom>;
export type EditClassroom = { id: string } & Partial<Omit<Classroom, "id">>;

export type ChangeClassroomUsability = { id: string; usability: Usability; };
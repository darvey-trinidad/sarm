import { db, eq } from "@/server/db";
import { classroom, building } from "@/server/db/schema/classroom";
import { venue } from "@/server/db/schema/venue";

export const getBuilding = async (id: string) => {
  try {
    return await db.select().from(building).where(eq(building.id, id)).get();
  } catch (err) {
    console.error("Failed to get building:", err);
    throw new Error("Could not get building");
  }
};

export const getAllBuildings = async () => {
  try {
    return await db.select().from(building).all();
  } catch (err) {
    console.error("Failed to get all buildings:", err);
    throw new Error("Could not get all buildings");
  }
};

export const getClassroom = async (id: string) => {
  try {
    return await db.select().from(classroom).where(eq(classroom.id, id)).get();
  } catch (err) {
    console.error("Failed to get classroom:", err);
    throw new Error("Could not get classroom");
  }
};

export async function getClassroomWithBuilding(id: string) {
  return await db
    .select({
      classroomId: classroom.id,
      classroomName: classroom.name,
      classroomType: classroom.type,
      capacity: classroom.capacity,
      usability: classroom.usability,
      buildingId: building.id,
      buildingName: building.name,
      buildingDescription: building.description,
    })
    .from(classroom)
    .leftJoin(building, eq(classroom.buildingId, building.id))
    .where(eq(classroom.id, id));
}

export async function getVenueById(id: string) {
  return await db
    .select({
      venueId: venue.id,
      venueName: venue.name,
      venueDescription: venue.description,
      venueCapacity: venue.capacity,
      venueUsability: venue.usability,
    })
    .from(venue)
    .where(eq(venue.id, id));
}

export const getAllClassrooms = async () => {
  try {
    return await db
      .select({
        id: classroom.id,
        name: classroom.name,
        buildingId: classroom.buildingId,
        buildingName: building.name,
        classroomName: classroom.name,
        capacity: classroom.capacity,
        usability: classroom.usability,
      })
      .from(classroom)
      .leftJoin(building, eq(classroom.buildingId, building.id))
      .orderBy(building.name);
  } catch (err) {
    console.error("Failed to get all classrooms:", err);
    throw new Error("Could not get all classrooms");
  }
};

export const getClassroomsPerBuilding = async () => {
  try {
    const rows = await db
      .select({
        buildingId: building.id,
        buildingName: building.name,
        description: building.description,
        classroomId: classroom.id,
        classroomName: classroom.name,
      })
      .from(building)
      .innerJoin(classroom, eq(classroom.buildingId, building.id))
      .orderBy(building.name, classroom.name);

    const grouped = Object.values(
      rows.reduce(
        (acc, row) => {
          const {
            buildingId,
            buildingName,
            description,
            classroomId,
            classroomName,
          } = row;

          acc[buildingId] ??= {
            buildingId,
            name: buildingName,
            description,
            classrooms: [],
          };

          if (classroomId) {
            acc[buildingId].classrooms.push({
              id: classroomId,
              name: classroomName,
            });
          }

          return acc;
        },
        {} as Record<
          string,
          {
            buildingId: string;
            name: string;
            description: string | null;
            classrooms: { id: string; name: string }[];
          }
        >,
      ),
    );

    return grouped;
  } catch (err) {
    console.error("Failed to get classrooms per buildings:", err);
    throw new Error("Could not get classrooms per buildings");
  }
};

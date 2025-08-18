// filler code only, error kasi kapag blanko. paki bura na lang pag need
interface RoomPageProps {
  params: Promise<{ buildingId: string; roomNumber: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { buildingId, roomNumber } = await params;

  return (
    <div>
      <h1>
        Building: {buildingId}, Room: {roomNumber}
      </h1>
    </div>
  );
}

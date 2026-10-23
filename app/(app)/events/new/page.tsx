import { EventNewForm } from "@/components/events/event-new-form";

export default function EventNewPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold">이벤트 생성</h1>
      <EventNewForm />
    </div>
  );
}

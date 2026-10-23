"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateEventCoverFile } from "@/lib/storage/event-cover";

const eventFormSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(50),
  description: z.string().max(500).optional(),
  location: z.string().min(1, "장소를 입력하세요").max(100),
  eventDate: z.string().min(1, "날짜를 선택하세요"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export type EventCoverChange = {
  file: File | null;
  remove: boolean;
};

// react-hook-form의 eventDate 필드 값은 그대로 유지하되(기존 "YYYY-MM-DDTHH:mm",
// new Date()로 바로 파싱 가능), 입력 UI만 네이티브 datetime-local 위젯(브라우저/OS
// locale에 따라 "2026-11-23T18:32" 식으로 보임) 대신 "2026년 11월 23일 18시 32분"
// 형태로 직접 표시하기 위해 년/월/일/시/분 Select 5개로 조립한다.
type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => i);

function parseDatetimeLocalValue(value: string): DateTimeParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
  };
}

function formatDatetimeLocalValue(parts: DateTimeParts): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function EventDateTimeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [parts, setParts] = useState<Partial<DateTimeParts>>(
    () => parseDatetimeLocalValue(value) ?? {},
  );

  useEffect(() => {
    setParts(parseDatetimeLocalValue(value) ?? {});
  }, [value]);

  function update(next: Partial<DateTimeParts>) {
    const merged = { ...parts, ...next };
    setParts(merged);

    const { year, month, day, hour, minute } = merged;
    if (
      year !== undefined &&
      month !== undefined &&
      day !== undefined &&
      hour !== undefined &&
      minute !== undefined
    ) {
      onChange(formatDatetimeLocalValue({ year, month, day, hour, minute }));
    } else {
      onChange("");
    }
  }

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);
  if (parts.year !== undefined && !yearOptions.includes(parts.year)) {
    yearOptions.push(parts.year);
    yearOptions.sort((a, b) => a - b);
  }

  const maxDay =
    parts.year !== undefined && parts.month !== undefined
      ? getDaysInMonth(parts.year, parts.month)
      : 31;
  const dayOptions = Array.from({ length: maxDay }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={parts.year?.toString()}
          onValueChange={(v) => {
            const year = Number(v);
            const max =
              parts.month !== undefined
                ? getDaysInMonth(year, parts.month)
                : 31;
            const day =
              parts.day !== undefined && parts.day > max ? max : parts.day;
            update({ year, day });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="년" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={parts.month?.toString()}
          onValueChange={(v) => {
            const month = Number(v);
            const max =
              parts.year !== undefined
                ? getDaysInMonth(parts.year, month)
                : 31;
            const day =
              parts.day !== undefined && parts.day > max ? max : parts.day;
            update({ month, day });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="월" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_OPTIONS.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {m}월
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={parts.day?.toString()}
          onValueChange={(v) => update({ day: Number(v) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="일" />
          </SelectTrigger>
          <SelectContent>
            {dayOptions.map((d) => (
              <SelectItem key={d} value={d.toString()}>
                {d}일
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Select
          value={parts.hour?.toString()}
          onValueChange={(v) => update({ hour: Number(v) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="시" />
          </SelectTrigger>
          <SelectContent>
            {HOUR_OPTIONS.map((h) => (
              <SelectItem key={h} value={h.toString()}>
                {h}시
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={parts.minute?.toString()}
          onValueChange={(v) => update({ minute: Number(v) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="분" />
          </SelectTrigger>
          <SelectContent>
            {MINUTE_OPTIONS.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                {m}분
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function EventForm({
  mode,
  defaultValues,
  defaultCoverImageUrl,
  onSubmitSuccess,
}: {
  mode: "create" | "edit";
  defaultValues?: Partial<EventFormValues>;
  defaultCoverImageUrl?: string | null;
  onSubmitSuccess: (
    values: EventFormValues,
    cover: EventCoverChange,
  ) => void | Promise<void>;
}) {
  const pathname = usePathname();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      eventDate: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    // Next.js 클라이언트 라우터 캐시가 이 라우트의 컴포넌트 인스턴스를 재사용해
    // react-hook-form/useState 값이 재마운트 없이 남아있을 수 있다. 생성 모드는
    // 이 라우트에 들어올 때마다 항상 빈 폼이어야 하므로, pathname이 다시 이
    // 라우트로 바뀔 때마다(=재방문할 때마다) 명시적으로 리셋한다.
    if (mode !== "create") return;
    form.reset({ title: "", description: "", location: "", eventDate: "" });
    setCoverFile(null);
    setCoverError(null);
    setCoverRemoved(false);
  }, [pathname, mode, form]);

  const [coverFilePreviewUrl, setCoverFilePreviewUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!coverFile) {
      setCoverFilePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const previewUrl = coverFile
    ? coverFilePreviewUrl
    : !coverRemoved
      ? (defaultCoverImageUrl ?? null)
      : null;

  function handleCoverChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (!file) {
      setCoverFile(null);
      setCoverError(null);
      return;
    }

    const error = validateEventCoverFile(file);
    if (error) {
      setCoverError(error);
      setCoverFile(null);
      return;
    }

    setCoverError(null);
    setCoverFile(file);
    setCoverRemoved(false);
  }

  function handleRemoveCover() {
    setCoverFile(null);
    setCoverError(null);
    setCoverRemoved(true);
  }

  async function handleSubmit(values: EventFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmitSuccess(values, { file: coverFile, remove: coverRemoved });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 제목" maxLength={50} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택)</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 설명" maxLength={500} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>장소</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 장소" maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>날짜</FormLabel>
              <FormControl>
                <EventDateTimeSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormLabel>커버 이미지 (선택)</FormLabel>
          {previewUrl && (
            <div className="relative h-40 w-full overflow-hidden rounded-md border">
              <Image
                src={previewUrl}
                alt="커버 이미지 미리보기"
                fill
                sizes="100vw"
                className="object-cover"
                unoptimized={coverFile !== null}
              />
            </div>
          )}
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleCoverChange(e.target.files)}
          />
          {coverError && (
            <p className="text-destructive text-sm">{coverError}</p>
          )}
          {previewUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={handleRemoveCover}
            >
              이미지 제거
            </Button>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "처리 중..."
            : mode === "create"
              ? "이벤트 생성"
              : "수정 완료"}
        </Button>
      </form>
    </Form>
  );
}

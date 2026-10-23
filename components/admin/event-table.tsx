"use client";

import { useState } from "react";
import { CalendarXIcon, Trash2Icon } from "lucide-react";

import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar";
import { EmptyState } from "@/components/common/empty-state";
import { EventStatusBadge } from "@/components/common/event-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminEventRow } from "@/lib/types/components";

const PAGE_SIZE = 20;

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "전체 상태" },
  { value: "upcoming", label: "예정" },
  { value: "ongoing", label: "진행 중" },
  { value: "ended", label: "종료" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR");
}

export function EventTable({ rows: initialRows }: { rows: AdminEventRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = rows.filter((row) => {
    const keyword = search.trim().toLowerCase();
    const matchesSearch =
      keyword === "" ||
      row.event.title.toLowerCase().includes(keyword) ||
      row.hostName.toLowerCase().includes(keyword);
    const matchesStatus =
      statusFilter === "all" || row.event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleDelete(eventId: string) {
    setRows((prev) => prev.filter((row) => row.event.id !== eventId));
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminTableToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="제목 또는 주최자 검색"
        filterValue={statusFilter}
        onFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        filterOptions={STATUS_FILTER_OPTIONS}
      />

      {paged.length === 0 ? (
        <EmptyState
          icon={CalendarXIcon}
          title="이벤트가 없습니다"
          description="검색 조건에 맞는 이벤트를 찾을 수 없습니다."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>주최자</TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>참여자 수</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(({ event, hostName, participantCount }) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{hostName}</TableCell>
                <TableCell>{formatDate(event.eventDate)}</TableCell>
                <TableCell>{participantCount}명</TableCell>
                <TableCell>
                  <EventStatusBadge status={event.status} />
                </TableCell>
                <TableCell>{formatDate(event.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <AdminDeleteDialog
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <Trash2Icon className="text-destructive size-4" />
                      </Button>
                    }
                    title="이벤트를 삭제하시겠습니까?"
                    description={`"${event.title}" 이벤트를 삭제하면 복구할 수 없습니다.`}
                    onConfirm={() => handleDelete(event.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            이전
          </Button>
          <span className="text-muted-foreground text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}

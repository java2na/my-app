"use client";

import { useState } from "react";
import { Trash2Icon, UsersIcon } from "lucide-react";

import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar";
import { EmptyState } from "@/components/common/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUserRow } from "@/lib/types/components";

const PAGE_SIZE = 20;

const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "전체 역할" },
  { value: "user", label: "일반 사용자" },
  { value: "admin", label: "관리자" },
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR");
}

function getInitial(name: string | null) {
  return name ? name.trim().charAt(0).toUpperCase() : "?";
}

export function UserTable({ rows: initialRows }: { rows: AdminUserRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = rows.filter(({ user }) => {
    const keyword = search.trim().toLowerCase();
    const matchesSearch =
      keyword === "" ||
      (user.name ?? "").toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleDelete(userId: string) {
    setRows((prev) => prev.filter((row) => row.user.id !== userId));
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminTableToolbar
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="이름 또는 이메일 검색"
        filterValue={roleFilter}
        onFilterChange={(value) => {
          setRoleFilter(value);
          setPage(1);
        }}
        filterOptions={ROLE_FILTER_OPTIONS}
      />

      {paged.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="사용자가 없습니다"
          description="검색 조건에 맞는 사용자를 찾을 수 없습니다."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>프로필</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>역할</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>생성한 이벤트</TableHead>
              <TableHead>참여한 이벤트</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map(({ user, createdEventCount, joinedEventCount }) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.name ?? ""} />
                    )}
                    <AvatarFallback>{getInitial(user.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  {user.name ?? "이름 없음"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? "관리자" : "일반 사용자"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{createdEventCount}개</TableCell>
                <TableCell>{joinedEventCount}개</TableCell>
                <TableCell className="text-right">
                  <AdminDeleteDialog
                    trigger={
                      <Button type="button" variant="ghost" size="icon">
                        <Trash2Icon className="text-destructive size-4" />
                      </Button>
                    }
                    title="사용자를 삭제하시겠습니까?"
                    description={`"${user.name ?? user.email}" 사용자를 삭제하면 복구할 수 없습니다.`}
                    onConfirm={() => handleDelete(user.id)}
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

"use client";

import { useProfile } from "../hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { User, Mail, Phone, Calendar } from "lucide-react";
const genderLabels: Record<number, string> = {
  0: "Nữ",
  1: "Nam",
  2: "Khác",
};
export function AccountPage() {
  const { data: profile, isLoading, error } = useProfile();
  if (isLoading) {
    return <AccountPageSkeleton />;
  }
  if (error || !profile) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Không thể tải thông tin tài khoản. Vui lòng thử lại sau.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Thông tin cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{profile.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profile.email}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Số điện thoại"
                value={profile.phone || "Chưa cập nhật"}
              />
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="Giới tính"
                value={
                  profile.gender !== null && profile.gender !== undefined
                    ? genderLabels[profile.gender] || "Chưa cập nhật"
                    : "Chưa cập nhật"
                }
              />
              {profile.createdAt && (
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Ngày tham gia"
                  value={new Date(profile.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Vai trò tài khoản</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm text-muted-foreground w-24">{label}:</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
function AccountPageSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

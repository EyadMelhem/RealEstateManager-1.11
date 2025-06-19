import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TenantForm } from "@/components/forms/tenant-form";
import { Plus, Search, Users, Phone, Mail, User } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import type { Tenant } from "@shared/schema";

export default function Tenants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: tenants, isLoading } = useQuery<Tenant[]>({
    queryKey: ["/api/tenants"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/tenants/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tenant");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenants"] });
    },
  });

  const filteredTenants = tenants?.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm) ||
    tenant.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="البحث عن المستأجرين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-64"
            />
          </div>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="ml-2 h-4 w-4" />
              إضافة مستأجر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة مستأجر جديد</DialogTitle>
            </DialogHeader>
            <TenantForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants?.length ? (
          filteredTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tenant.name}
                    </h3>
                    {tenant.occupation && (
                      <p className="text-sm text-gray-600">{tenant.occupation}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="ml-2 h-4 w-4" />
                    {tenant.phone}
                  </div>
                  {tenant.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="ml-2 h-4 w-4" />
                      {tenant.email}
                    </div>
                  )}
                  {tenant.nationalId && (
                    <div className="text-sm text-gray-600">
                      رقم الهوية: {tenant.nationalId}
                    </div>
                  )}
                  {tenant.emergencyContact && (
                    <div className="text-sm text-gray-600">
                      جهة اتصال طوارئ: {tenant.emergencyContact}
                      {tenant.emergencyPhone && ` (${tenant.emergencyPhone})`}
                    </div>
                  )}
                </div>
                
                {tenant.notes && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {tenant.notes}
                  </p>
                )}
                
                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm" className="flex-1">
                    تعديل
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteMutation.mutate(tenant.id)}
                    disabled={deleteMutation.isPending}
                  >
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا يوجد مستأجرين
                </h3>
                <p className="text-gray-600 mb-6">
                  ابدأ بإضافة مستأجر جديد لإدارة قاعدة بيانات المستأجرين
                </p>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة مستأجر جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>إضافة مستأجر جديد</DialogTitle>
                    </DialogHeader>
                    <TenantForm onSuccess={() => setShowAddDialog(false)} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

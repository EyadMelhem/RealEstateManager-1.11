import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContractForm } from "@/components/forms/contract-form";
import { Plus, Search, FileText, Calendar, Building, User } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import type { ContractWithDetails } from "@shared/schema";

export default function Contracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: contracts, isLoading } = useQuery<ContractWithDetails[]>({
    queryKey: ["/api/contracts"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contracts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete contract");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
    },
  });

  const filteredContracts = contracts?.filter(contract =>
    contract.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
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
              placeholder="البحث في العقود..."
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
              إضافة عقد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة عقد إيجار جديد</DialogTitle>
            </DialogHeader>
            <ContractForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts?.length ? (
          filteredContracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 space-x-reverse mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          عقد رقم #{contract.id}
                        </h3>
                        <Badge variant={contract.isActive ? "default" : "secondary"}>
                          {contract.isActive ? "نشط" : "منتهي"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="ml-2 h-4 w-4" />
                            العقار: {contract.property.title}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="ml-2 h-4 w-4" />
                            المستأجر: {contract.tenant.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            الهاتف: {contract.tenant.phone}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="ml-2 h-4 w-4" />
                            تاريخ البداية: {formatDate(contract.startDate)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="ml-2 h-4 w-4" />
                            تاريخ النهاية: {formatDate(contract.endDate)}
                          </div>
                          <div className="text-sm text-gray-600">
                            الإيجار الشهري: {formatCurrency(contract.monthlyRent)}
                          </div>
                          {contract.securityDeposit && (
                            <div className="text-sm text-gray-600">
                              التأمين: {formatCurrency(contract.securityDeposit)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {contract.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">{contract.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm">
                      تعديل
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteMutation.mutate(contract.id)}
                      disabled={deleteMutation.isPending}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد عقود
              </h3>
              <p className="text-gray-600 mb-6">
                ابدأ بإضافة عقد إيجار جديد لإدارة العقود
              </p>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة عقد جديد
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة عقد إيجار جديد</DialogTitle>
                  </DialogHeader>
                  <ContractForm onSuccess={() => setShowAddDialog(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

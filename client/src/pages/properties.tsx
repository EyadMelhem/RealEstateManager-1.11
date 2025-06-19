import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PropertyForm } from "@/components/forms/property-form";
import { Plus, Search, Building, Home, Store, MapPin, User } from "lucide-react";
import { formatCurrency, getPropertyTypeLabel } from "@/lib/utils";
import { queryClient } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete property");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
  });

  const filteredProperties = properties?.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'villa':
        return <Home className="h-8 w-8 text-green-600" />;
      case 'commercial':
        return <Store className="h-8 w-8 text-purple-600" />;
      case 'office':
        return <Building className="h-8 w-8 text-blue-600" />;
      default:
        return <Building className="h-8 w-8 text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-gray-200 rounded"></div>
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
              placeholder="البحث عن العقارات..."
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
              إضافة عقار جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة عقار جديد</DialogTitle>
            </DialogHeader>
            <PropertyForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties?.length ? (
          filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    {getPropertyIcon(property.type)}
                  </div>
                  <Badge variant={property.isAvailable ? "default" : "secondary"}>
                    {property.isAvailable ? "متاح" : "مؤجر"}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {property.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="ml-2 h-4 w-4" />
                    {property.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="ml-2 h-4 w-4" />
                    المالك: {property.ownerName}
                  </div>
                  <div className="text-sm text-gray-600">
                    النوع: {getPropertyTypeLabel(property.type)}
                  </div>
                  {property.rooms && (
                    <div className="text-sm text-gray-600">
                      عدد الغرف: {property.rooms}
                    </div>
                  )}
                  {property.area && (
                    <div className="text-sm text-gray-600">
                      المساحة: {property.area} متر مربع
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(property.monthlyRent)}
                  </div>
                  <div className="text-sm text-gray-500">شهرياً</div>
                </div>
                
                {property.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {property.description}
                  </p>
                )}
                
                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="outline" size="sm" className="flex-1">
                    تعديل
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteMutation.mutate(property.id)}
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
                <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد عقارات
                </h3>
                <p className="text-gray-600 mb-6">
                  ابدأ بإضافة عقار جديد لإدارة محفظتك العقارية
                </p>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة عقار جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>إضافة عقار جديد</DialogTitle>
                    </DialogHeader>
                    <PropertyForm onSuccess={() => setShowAddDialog(false)} />
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

"use client";
import { Label } from "@mr/components/ui/Label";
import { Input } from "@mr/components/ui/Input";
import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { Tabs, TabsContent } from "@mr/components/ui/tabs";

export const PersonnelTabs = () => {
  const selectedEmployee = usePersonnelStore((state) => state.selectedEmployee);

  return (
    <Tabs defaultValue="info" className="w-full ">
      {/* Info */}
      <TabsContent value="info">
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-0">
            <Label htmlFor="idno" className="text-left text-sm font-semibold">
              ID No
            </Label>
            <Input
              id="idno"
              className="col-span-3"
              disabled
              defaultValue={selectedEmployee !== undefined ? selectedEmployee.idNo : ""}
            />
          </div>

          <div className="flex flex-col items-start gap-0">
            <Label htmlFor="fullname" className="text-left text-sm font-semibold">
              Name
            </Label>
            <Input
              id="fullname"
              className="col-span-3"
              disabled
              defaultValue={selectedEmployee !== undefined ? selectedEmployee.fullName : ""}
            />
          </div>

          <div className="flex flex-col items-start gap-0">
            <Label htmlFor="designation" className="text-left text-sm font-semibold">
              Designation
            </Label>
            <Input
              id="designation"
              className="col-span-3"
              disabled
              defaultValue={selectedEmployee !== undefined ? selectedEmployee.designation : ""}
            />
          </div>
          <div className="flex flex-col items-start gap-0">
            <Label htmlFor="contactnumber" className="text-left text-sm font-semibold">
              Contact Number
            </Label>
            <Input
              id="contactnumber"
              className="col-span-3"
              disabled
              defaultValue={selectedEmployee !== undefined ? selectedEmployee.contactNumber : ""}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

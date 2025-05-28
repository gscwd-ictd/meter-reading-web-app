import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mr/components/ui/tabs";
import { Heading } from "../../typography/Heading";
import { AreaTextBlastTableComponent } from "./AreaTextBlastDataTable/AreaTextBlastTableComponent";
import { IndividualTextBlastTableComponent } from "./IndividualTextBlastDataTable/IndividualTextBlastTableComponent";

export default function TextBlastTableComponent() {
  return (
    <>
      <Tabs defaultValue="area">
        <div className="m-4">
          <div className="flex flex-row justify-between items-center">
            <Heading variant={"h4"} className="text-blue-700">
              Contacts
            </Heading>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="p-4 h-full">
          <TabsContent value={"area"}>
            <AreaTextBlastTableComponent />
          </TabsContent>
          <TabsContent value={"individual"}>
            <IndividualTextBlastTableComponent />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}

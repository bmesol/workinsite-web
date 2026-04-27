import { SupplierGetStartedPage } from "../supplier-get-started/SupplierGetStartedPage";
import { ContactCard } from "@/shared/components/ContactCard/ContactCard";
import { Header } from "@/shared/components/Header/Header";
import { ContactTypes } from "../../../contacts/DTOs/ContactProps";
import { useSupplierList } from "./useSupplierList";
import { SuppliersUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

const SupplierListPage = () => {
  const navigate = useNavigate();
  const {
    supplierDetails,
    fetchSupplier,
    handleSupplierSelect,
    handleSupplierDelete,
    hasSearchFilter,
  } = useSupplierList();

  if (!supplierDetails.length && !hasSearchFilter)
    return <SupplierGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <Header title="Suppliers">
        <Button onClick={() => navigate(SuppliersUrls.create)}>
          New Supplier
        </Button>
      </Header>

      {/* Search Box */}
      <div className="flex justify-end mt-4 mb-4">
        <Input
          type="text"
          placeholder="Search suppliers..."
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
              fetchSupplier(value);
            }
          }}
          className="w-72"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pb-4">
        {!supplierDetails.length ? (
          <div className="col-span-2 my-4 text-center text-muted-foreground">
            No suppliers found
          </div>
        ) : (
          supplierDetails.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => handleSupplierSelect(supplier.id)}
            >
              <ContactCard
                name={supplier.name}
                phone={
                  supplier.contact?.contactDetails?.find(
                    (item) => item.contactType === ContactTypes.PHONE,
                  )?.value
                } // 👈 ?.
                email={
                  supplier.contact?.contactDetails?.find(
                    (item) => item.contactType === ContactTypes.EMAIL,
                  )?.value
                } // 👈 ?.
                onDelete={(e: React.MouseEvent) =>
                  handleSupplierDelete(e, supplier.id)
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { SupplierListPage };

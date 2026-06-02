// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
// import Loader from "@/components/Loader";
// import { Header } from "@/shared/components/Header/Header";
// import MaterialCard from "@/shared/components/MaterialCard/MaterialCard";
// import ToastNotification from "@/components/ToastNotification";
// import GetStartedCard from "@/components/GetStartedCard";

// import { useMaterialList } from "./useMaterialList";
// import { useLanguage } from "@/context/LanguageContext";

// export default function MaterialListScreen() {
//   const navigate = useNavigate();
//   const { t } = useLanguage();

//   const [refreshing, setRefreshing] = useState(false);

//   const {
//     materialDetails,
//     fetchMaterial,
//     handleMaterialDelete,
//     handleMaterialSelect,
//     loading,
//     searchText,
//     setSearchText,
//   } = useMaterialList();

//   // Filter
//   const filteredMaterialList = materialDetails.filter((item: any) =>
//     item.name.toLowerCase().includes(searchText.trim().toLowerCase())
//   );

//   // Refresh (manual)
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchMaterial(searchText);
//     setRefreshing(false);
//   };

//   // Reset search on mount (like useFocusEffect)
//   useEffect(() => {
//     setSearchText("");
//   }, []);

//   const handlePress = () => {
//     navigate("/material-create");
//   };

//   const handleBack = () => {
//     navigate("/");
//   };

//   if (loading && !refreshing) {
//     return <Loader />;
//   }

//   if (!materialDetails.length) {
//     return (
//       <GetStartedCard
//         buttonClick="/material-create"
//         buttonLabel={t("Create Materials")}
//         permissionKey="Material"
//       >
//         Dive into the heart of construction site management...
//       </GetStartedCard>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
      
//       {/* Toast */}
//       <div className="z-50">
//         <ToastNotification />
//       </div>

//       {/* Header */}
//       <Header
//         title={t("Material List")}
//         onBackPress={handleBack}
//         handleCreate={handlePress}
//         permissionKey="Material"
//       />

//       {/* Search + Refresh */}
//       <div className="p-4 flex gap-2">
//         <SearchBar
//           searchText={searchText}
//           setSearchText={setSearchText}
//         />

//         <button
//           onClick={handleRefresh}
//           className="px-4 py-2 bg-primary text-white rounded-md"
//         >
//           Refresh
//         </button>
//       </div>

//       {/* List */}
//       <div className="flex-1 overflow-y-auto px-4 pb-6">
//         {filteredMaterialList.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">
//             {t("No materials found")}
//           </p>
//         ) : (
//           <div className="space-y-3">
//             {filteredMaterialList.map((item: any) => (
//               <MaterialCard
//                 key={item.id}
//                 material={item}
//                 unit={item.unit?.name}
//                 hsnCode={item.hsnCode}
//                 onDelete={() => handleMaterialDelete(item.id)}
//                 onPress={() => handleMaterialSelect(item.id)}
//                 permissionKey="Material"
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
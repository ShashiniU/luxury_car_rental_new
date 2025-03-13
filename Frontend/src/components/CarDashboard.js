// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { ChevronUp, Filter, Sliders } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { Label } from "@/components/ui/label";
// import { RadioGroupItem } from "@/components/ui/radio-group";
// import { Separator } from "@/components/ui/separator";
// // import { FaSlider } from "@/components/ui/slider";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarProvider
// } from "@/components/ui/sidebar";
// import "./CarDashboard.css"; // Importing CSS file

// // Sample car data
// const cars = [
//   {
//     id: 1,
//     name: "Tesla Model 3",
//     price: 42990,
//     year: 2023,
//     make: "Tesla",
//     model: "Model 3",
//     type: "Electric",
//     mileage: 0,
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 2,
//     name: "Toyota Camry",
//     price: 26420,
//     year: 2023,
//     make: "Toyota",
//     model: "Camry",
//     type: "Hybrid",
//     mileage: 0,
//     image: "/placeholder.svg?height=200&width=300",
//   },
// ];

// const makes = ["Audi", "BMW", "Ford", "Honda", "Lexus", "Mercedes-Benz", "Tesla", "Toyota"];
// const types = ["Electric", "Gasoline", "Hybrid"];
// const years = ["2023", "2022", "2021", "2020", "2019"];

// export default function CarDashboard() {
//   const [priceRange, setPriceRange] = useState([20000, 50000]);
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   return (
//     <SidebarProvider defaultOpen={true}>
//       <div className="dashboard-container">
//         <Sidebar className="sidebar-filter">
//           <SidebarHeader className="sidebar-header">
//             <div className="sidebar-title">
//               <Filter className="icon" />
//               <h2>Filters</h2>
//             </div>
//           </SidebarHeader>
//           <SidebarContent className="sidebar-content">
//             <div className="price-filter">
//               <h3>Price Range</h3>
//               {/* <Slider defaultValue={[20000, 50000]} max={100000} step={1000} value={priceRange} onValueChange={setPriceRange} /> */}
//               <div className="price-range">
//                 <span>{formatPrice(priceRange[0])}</span>
//                 <span>{formatPrice(priceRange[1])}</span>
//               </div>
//             </div>

//             <Separator />

//             <Collapsible defaultOpen className="filter-section">
//               <CollapsibleTrigger className="filter-header">
//                 <h3>Make</h3>
//                 <ChevronUp className="icon" />
//               </CollapsibleTrigger>
//               <CollapsibleContent className="filter-options">
//                 {makes.map((make) => (
//                   <div key={make} className="filter-option">
//                     <Checkbox id={`make-${make}`} />
//                     <Label htmlFor={`make-${make}`}>{make}</Label>
//                   </div>
//                 ))}
//               </CollapsibleContent>
//             </Collapsible>

//             <Separator />

//             <Collapsible defaultOpen className="filter-section">
//               <CollapsibleTrigger className="filter-header">
//                 <h3>Type</h3>
//                 <ChevronUp className="icon" />
//               </CollapsibleTrigger>
//               <CollapsibleContent className="filter-options">
//                 {types.map((type) => (
//                   <div key={type} className="filter-option">
//                     <RadioGroupItem value={type} id={`type-${type}`} />
//                     <Label htmlFor={`type-${type}`}>{type}</Label>
//                   </div>
//                 ))}
//               </CollapsibleContent>
//             </Collapsible>

//             <Separator />

//             <Collapsible defaultOpen className="filter-section">
//               <CollapsibleTrigger className="filter-header">
//                 <h3>Year</h3>
//                 <ChevronUp className="icon" />
//               </CollapsibleTrigger>
//               <CollapsibleContent className="filter-options">
//                 {years.map((year) => (
//                   <div key={year} className="filter-option">
//                     <Checkbox id={`year-${year}`} />
//                     <Label htmlFor={`year-${year}`}>{year}</Label>
//                   </div>
//                 ))}
//               </CollapsibleContent>
//             </Collapsible>
//           </SidebarContent>
//           <SidebarFooter className="sidebar-footer">
//             <Button variant="outline">Reset</Button>
//             <Button>Apply</Button>
//           </SidebarFooter>
//         </Sidebar>

//         <div className="main-content">
//           <header className="dashboard-header">
//             <h1>Car Listings</h1>
//             <Button variant="outline" size="sm" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
//               <Sliders className="icon" /> Filters
//             </Button>
//           </header>

//           <main className="car-listings">
//             {cars.map((car) => (
//               <Card key={car.id} className="car-card">
//                 <Image src={car.image} alt={car.name} width={300} height={200} />
//                 <CardContent>
//                   <h2>{car.name}</h2>
//                   <p>{formatPrice(car.price)}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../services/api";
// import API_ENDPOINTS from "../../../constants/api.endpoint";
// import Loading from "../../../components/common/Loading";
// import Button from "../../../components/ui/Button";

 

// function BookingDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         const res = await api.get(`${API_ENDPOINTS.BOOKINGS}/${id}`);
//         setBooking(res.data);
//       } catch (err) {
//         console.error("Error fetching booking details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooking();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loading />
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500">Booking not found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-6">
//       <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
//         <h1 className="text-3xl font-bold text-primary mb-6 text-center">Booking Details</h1>

//         <div className="space-y-4">
//           <div>
//             <h2 className="text-xl font-semibold">{booking.package?.title}</h2>
//             <p className="text-gray-600">{booking.package?.from} ➔ {booking.package?.to}</p>
//             <p className="text-gray-600 text-sm">
//               {new Date(booking.package?.startDate).toLocaleDateString()} - {new Date(booking.package?.endDate).toLocaleDateString()}
//             </p>
//           </div>

//           <div className="border-t pt-4 mt-4 space-y-2">
//             <p className="text-gray-700">
//               <span className="font-semibold">Total Price: </span> ₹ {booking.totalPrice}
//             </p>
//             <p className="text-gray-700">
//               <span className="font-semibold">Status: </span> 
//               <span className={`font-bold ${
//                 booking.status === "pending" ? "text-yellow-500" :
//                 booking.status === "confirmed" ? "text-green-600" : "text-red-500"
//               }`}>
//                 {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//               </span>
//             </p>
//           </div>

        
//           {booking.selectedOptionalServices?.length > 0 && (
//             <div className="border-t pt-4 mt-4">
//               <h3 className="text-lg font-semibold mb-2">Optional Services Selected:</h3>
//               <ul className="list-disc ml-6 text-gray-700">
//                 {booking.selectedOptionalServices.map((service, index) => (
//                   <li key={index}>{service.name} (₹ {service.price})</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         <div className="mt-8 text-center">
//           <Button onClick={() => navigate('/bookings')}>Back to My Bookings</Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BookingDetails;

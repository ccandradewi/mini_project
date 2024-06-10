// import Link from "next/link";

// type Props = { children: React.ReactNode; isLogin: boolean };

// export default function FormWrapper({ children, isLogin = true }: Props) {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="w-[320px] p-5">
//         <center>
//           {/* <Logo className={"text-5xl mb-10"} /> */}
//           {children}

//           <center className="text-sm">
//             <p>{isLogin ? "Don't have an account?" : "Have an account?"}</p>
//             <Link
//               className="font-bold ml-2 text-sm text-primary"
//               href={isLogin ? "/users/v1" : "/users/v2"}
//             >
//               {isLogin ? "Register" : "Login"}
//             </Link>
//           </center>
//         </center>
//       </div>
//     </div>
//   );
// }

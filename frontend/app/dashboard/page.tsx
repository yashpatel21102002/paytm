"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Card from "@/components/Card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";

const Page = () => {
  const [balance, setBalance] = useState(null);
  const [allUser, setAllUser] = useState([]);
  var token:string|null
  if (typeof window !== 'undefined') {
     token = localStorage.getItem("token");
  }
  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(response.data.balance); // Assuming the response has a 'balance' property

        const users = await axios.get("http://localhost:8000/api/v1/user/all");
        setAllUser(users.data);
        console.log(allUser);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, []);
  return (
    <div className="w-full flex flex-col justify-center items-center mt-5">
      {/* will show the name of the user and name of the app */}
      <div className="w-full max-w-4xl flex py-5 justify-between border-b-2">
        <h1 className="text-xl font-bold text-orange-700">PayTM -💖 By Yash</h1>
        <div className="flex justify-center items-center gap-1">
          <span className="font-bold text-slate-900">Hello, User!</span>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex flex-col justify-start w-full max-w-4xl mt-4">
        <div className="p-2 md:p-2 lg:p-3 rounded-md border flex">
          <p className="text-gray-600 text-md md:text-lg lg:text-xl mb-2">
            Available Balance:
          </p>
          <p className="text-md md:text-lg lg:text-xl font-bold text-green-500">
            {balance !== null ? `$${balance.toFixed(2)}` : "Loading..."}
          </p>
        </div>
      </div>

      {/* Find users and send them money */}
      <div className="w-full max-w-4xl mt-4">
        <h1 className="text-xl font-bold">Find Users</h1>
        <p className="text-gray-400">
          You can search users from search bar and send them money. It is the
          most secure payment app constructed using database transaction logic.
          Just enjoy using this demo app, It will be great if you can share you
          exerience and feedback about this app
        </p>
      </div>

      <div className="w-full max-w-4xl mt-4">
        <Input name="name" placeholder="Search Users..." />
      </div>

      <div className="w-full max-w-4xl mt-2 overflow-hidden">
        {allUser.map((user) => (
          <Card user={user} key={user} />
        ))}
      </div>
    </div>
  );
};

export default Page;

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

function Page({ user }) {
  const { toast } = useToast();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  var token: string | null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  console.log(user);
  const handletransaction = async () => {
    setLoading(true);
    try {
      const tran = await axios.post(
        "http://localhost:8000/api/v1/account/transfer",
        {
          to: user._id,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        description: tran.data.message,
      });
      window.location.reload();
    } catch (error) {
      console.log(error, user._id, amount);
      toast({
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card>
      <div className="pt-6"></div>
      <CardContent className="flex items-center w-full gap-2">
        <div className="flex items-center gap-2 h-[40px] w-full">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {user !== null
                ? user.firstname.charAt(0) + user.lastname.charAt(0)
                : "loading..."}
            </AvatarFallback>
          </Avatar>
          <div className="w-full flex justify-evenly">
            <p className="w-[200px]">{user.firstname + " " + user.lastname}</p>
            <span className="w-[250px] text-left text-gray-700">
              {" "}
              ({user.username})
            </span>
          </div>
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"}>Send Money</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send Money</DialogTitle>
                <DialogDescription>
                  Make Your transaction seemlessly with anyone, anytime without
                  any security concerns, We are here for you!
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue={user.firstname + " " + user.lastname}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    className="col-span-3"
                    type="number"
                    max={2000}
                    min={1}
                    placeholder="1200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handletransaction}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Confirm Transaction"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default Page;

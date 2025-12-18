"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface DangerZoneProps {
  brandName: string;
  brandId: string;
}

export function DangerZone({ brandName, brandId }: DangerZoneProps) {
  const [inputValue, setInputValue] = useState("");
  const isMatch = inputValue === brandName;
  const router = useRouter();
  const [isloading, setisLoading] = useState(false);

  const handleSubmit = async ({ brandId }: { brandId: string }) => {
    try {
      setisLoading(true);
      const { error } = await authClient.organization.delete({organizationId: brandId});
      
      if (error) {
        toast.error(error.message);
        return;
      } else {
        setisLoading(false);
        toast.success(`Brand Deleted successfully`);
        router.push("/manage-brands");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand. Please try again.");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Card className="border-destructive mt-6">
      <CardHeader>
        <h2 className="text-4xl font-semibold mb-2 text-destructive">
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Deleting this brand profile will permanently remove all associated
          data, including posts, analytics, and settings. This action cannot be
          undone.
        </p>
      </CardHeader>
      <CardContent className="flex justify-start items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete this Brand Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your{" "}
                <span className="font-bold">{brandName}</span> brand profile and
                all associated data.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2">
              <p className="text-sm">
                To confirm, type{" "}
                <span className="font-bold">&quot;{brandName}&quot;</span> in
                the box below.
              </p>
              <Input
                placeholder={brandName}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => brandId && handleSubmit({ brandId })}
                disabled={!isMatch}
                variant="destructive"
              >
                {isloading ? "Deleting..." : "Delete Profile"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Say Hello!</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Hello World!</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

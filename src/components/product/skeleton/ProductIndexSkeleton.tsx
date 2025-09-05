import Button from "@/components/primitive/button/Button";
import Card from "@/components/primitive/card/Card";
import Input from "@/components/primitive/input/Input";
import { Icon } from "@iconify/react";

export default function ProductIndexSkeleton(){
  return (
    <Card 
      renderHeader={
        <h1 className="card-title placeholder-glow">
          <span className="placeholder col-3"></span>
        </h1>
      }
    >

    </Card>
  );
}
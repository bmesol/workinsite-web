import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { GetStartedCardProps } from "./DTOs";

const GetStartedCard = (props: GetStartedCardProps) => {
  const { imgSrc, buttonLabel, buttonClick, children } = props;
  const navigate = useNavigate();

  return (
    <div className="container flex justify-center items-center min-h-screen">
      <div className="w-full max-w-lg mx-auto rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-col items-center text-center gap-4">

          {/* Image */}
          <img src={imgSrc} alt="get started" className="w-auto max-h-60" />

          {/* Title */}
          <h2 className="text-xl font-bold text-black">Get Started</h2>

          {/* Description */}
          <p className="text-muted-foreground">{children}</p>

          {/* Button */}
          <Button onClick={() => navigate(buttonClick)}>
            {buttonLabel}
          </Button>

        </div>
      </div>
    </div>
  );
};

export { GetStartedCard };
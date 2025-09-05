import OnboardingLayer from "@/components/onboarding/OnboardingLayer";
import MasterLayout from "@/masterLayout/MasterLayout"

export default function Page(){
  return (
    <MasterLayout>
      <OnboardingLayer />
    </MasterLayout>
  );
}
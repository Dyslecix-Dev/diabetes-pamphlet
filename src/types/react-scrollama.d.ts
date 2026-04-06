declare module "react-scrollama" {
  import { ReactNode } from "react";

  interface StepData<T = any> {
    data: T;
    direction: "up" | "down";
    entry: IntersectionObserverEntry;
  }

  interface ScrollamaProps {
    offset?: number;
    threshold?: number;
    onStepEnter?: (data: StepData) => void;
    onStepExit?: (data: StepData) => void;
    onStepProgress?: (data: StepData & { progress: number }) => void;
    debug?: boolean;
    children: ReactNode;
  }

  interface StepProps {
    data?: any;
    children: ReactNode;
  }

  export const Scrollama: React.FC<ScrollamaProps>;
  export const Step: React.FC<StepProps>;
}

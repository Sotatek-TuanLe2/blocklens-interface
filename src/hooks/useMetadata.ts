import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { MetadataPlan } from "src/store/metadata";

type ReturnType = {
  billingPlans: MetadataPlan[];
};

const useMetadata = (): ReturnType => {
  const { plans } = useSelector((state: RootState) => state.metadata);

  return {
    billingPlans: plans
  };
};

export default useMetadata;
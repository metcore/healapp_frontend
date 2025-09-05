import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import AdditionalCostList from "@/components/additional-cost/AdditionalCostList";
export default function page(){
	return (
		<MasterLayout>
      <Breadcrumb title={"Biaya Tambahan"} />
			<AdditionalCostList />
		</MasterLayout>
	)
}
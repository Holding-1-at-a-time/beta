import { VehicleDiagram } from '@/components/VehicleDiagram';
import ServiceSelection from '@/components/ServiceSelectionComponent';
import FileUploads from '@/components/FileUploadsComponent';
import { VehicleAssessmentForm } from '@components/VehicleAssessmentForm';

// In your page or parent component
const VehicleAssessmentPage = () => {
    return (
        <div>
            <VehicleDiagram />
            <ServiceSelection />
            <FileUploads />
            <VehicleAssessmentForm />
        </div>
    );
};

export default VehicleAssessmentPage;
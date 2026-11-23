import ServiceDetails from "@/components/services/ServiceDetails";

interface ServiceDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function ServiceDetailsPage({
    params,
}: ServiceDetailsPageProps) {
    const { id } = await params;

    return <ServiceDetails serviceId={id} />;
}
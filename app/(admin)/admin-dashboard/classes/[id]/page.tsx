import { getClassById } from '@/lib/supabase/classes';
import ClassForm from '../components/class-form';
import { notFound } from 'next/navigation';

export default async function EditClassPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: classData } = await getClassById(id);

  if (!classData) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Class</h1>
      <ClassForm initialData={classData} />
    </div>
  );
}

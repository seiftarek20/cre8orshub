import AdminTaskForm from '../components/AdminTaskForm.jsx';
import AppLayout from '../components/AppLayout.jsx';

function AdminTasks() {
  return (
    <AppLayout
      eyebrow="Instructor Tools"
      title="Admin task builder"
      description="A visual task creation interface prepared for future backend saving."
    >
      <AdminTaskForm />
    </AppLayout>
  );
}

export default AdminTasks;

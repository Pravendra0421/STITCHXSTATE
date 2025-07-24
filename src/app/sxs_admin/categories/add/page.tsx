import CreateCategoryForm from "../(_components)/CreatCategoryForm";

export default function CreateCategoryPageSSR() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
        Category Management Dashboard
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Create new product categories and manage their images.
      </p>
      {/* The client-side form component is rendered here */}
      <CreateCategoryForm />
    </div>
  );
}
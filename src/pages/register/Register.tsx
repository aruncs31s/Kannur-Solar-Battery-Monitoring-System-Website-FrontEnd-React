import { RegisterHeader } from "./RegisterHeader";
import { RegisterForm } from "./RegisterForm";
import { FeatureCards } from "./FeatureCards";

export const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <RegisterHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RegisterForm />
          <FeatureCards />
        </div>
      </div>
    </div>
  );
};
